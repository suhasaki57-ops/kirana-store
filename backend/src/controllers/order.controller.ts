import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';
import Order from '../models/Order.model';
import Cart from '../models/Cart.model';
import Product from '../models/Product.model';
import Coupon from '../models/Coupon.model';
import { AuthRequest, OrderStatus, PaymentStatus, CouponType } from '../types';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../services/email.service';

// @desc    Create order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      couponCode,
      notes,
    } = req.body;

    if (!items || items.length === 0) {
      throw new AppError('No order items provided', 400);
    }

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        throw new AppError(`Product ${item.product} not found`, 404);
      }

      if (!product.isActive) {
        throw new AppError(`Product ${product.name} is not available`, 400);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for ${product.name}. Only ${product.stock} available`,
          400
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price: product.price,
        quantity: item.quantity,
        variant: item.variant,
      });

      // Reduce product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Apply coupon if provided
    let discount = 0;
    let couponId = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

      if (!coupon || !coupon.isValid()) {
        throw new AppError('Invalid or expired coupon', 400);
      }

      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        throw new AppError(
          `Minimum order amount of $${coupon.minOrderAmount} required for this coupon`,
          400
        );
      }

      // Calculate discount
      if (coupon.type === CouponType.PERCENTAGE) {
        discount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.value;
      }

      discount = Math.min(discount, subtotal);

      coupon.usedCount += 1;
      await coupon.save();
      couponId = coupon._id;
    }

    // Calculate tax and shipping
    const taxRate = 0.1; // 10%
    const tax = (subtotal - discount) * taxRate;
    const shippingCharges = subtotal > 50 ? 0 : 5; // Free shipping over $50
    const total = subtotal - discount + tax + shippingCharges;

    // Create order
    const order = await Order.create({
      user: req.user!._id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      paymentMethod,
      coupon: couponId,
      notes,
    });

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: req.user!._id },
      { $set: { items: [], subtotal: 0 } }
    );

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(req.user!.email, order.orderNumber, {
        total: order.total,
      });
    } catch (_err) {
      // Non-fatal — don't fail the request
    }

    return ApiResponse.success(res, 'Order created successfully', order, 201);
  }
);

// @desc    Get user orders
// @route   GET /api/v1/orders
// @access  Private
export const getOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { user: req.user!._id };

    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    const [orders, totalItems] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('items.product', 'name slug')
        .lean(),
      Order.countDocuments(query),
    ]);

    return ApiResponse.paginate(
      res,
      'Orders retrieved successfully',
      orders,
      page,
      limit,
      totalItems
    );
  }
);

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name slug images')
      .populate('user', 'name email');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // order.user may be a populated object or just an ObjectId string/ObjectId
    const rawUser = order.user as any;
    const orderUserId =
      rawUser && typeof rawUser === 'object' && '_id' in rawUser
        ? rawUser._id.toString()
        : String(rawUser);

    if (orderUserId !== req.user!._id.toString() && req.user!.role !== 'admin') {
      throw new AppError('Not authorized to access this order', 403);
    }

    return ApiResponse.success(res, 'Order retrieved successfully', order);
  }
);

// @desc    Update order status (Admin only)
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id).populate('user', 'email');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    order.orderStatus = status;

    if (status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    } else if (status === OrderStatus.CANCELLED) {
      order.cancelledAt = new Date();
      order.cancelReason = note;

      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await order.save();

    // Send status update email
    try {
      const userEmail = (order.user as any)?.email;
      if (userEmail) {
        await sendOrderStatusEmail(userEmail, order.orderNumber, status);
      }
    } catch (_err) {
      // Non-fatal
    }

    return ApiResponse.success(res, 'Order status updated successfully', order);
  }
);

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check ownership
    if (order.user.toString() !== req.user!._id.toString()) {
      throw new AppError('Not authorized to cancel this order', 403);
    }

    // Only allow cancellation of pending or confirmed orders
    if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.orderStatus)) {
      throw new AppError('Order cannot be cancelled at this stage', 400);
    }

    order.orderStatus = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    order.cancelReason = reason;

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    await order.save();

    return ApiResponse.success(res, 'Order cancelled successfully', order);
  }
);

// @desc    Update payment status
// @route   PUT /api/v1/orders/:id/payment
// @access  Private
export const updatePaymentStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { paymentStatus, paymentDetails } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    order.paymentStatus = paymentStatus;
    if (paymentDetails) {
      order.paymentDetails = paymentDetails;
    }

    if (paymentStatus === PaymentStatus.COMPLETED) {
      order.orderStatus = OrderStatus.CONFIRMED;
    }

    await order.save();

    return ApiResponse.success(res, 'Payment status updated successfully', order);
  }
);
