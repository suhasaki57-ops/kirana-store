import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';
import Order from '../models/Order.model';
import { AuthRequest, PaymentStatus } from '../types';

// Lazy-initialise so missing env vars don't crash on import
const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
  });

// Use the oldest supported stable version string that ships with the installed SDK
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' as any });

// @desc    Create Razorpay order
export const createRazorpayOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);
  if (order.user.toString() !== req.user!._id.toString()) throw new AppError('Not authorized', 403);

  const options = {
    amount: Math.round(order.total * 100),
    currency: 'INR',
    receipt: order.orderNumber,
    notes: { orderId: order._id.toString() },
  };
  const razorpayOrder = await getRazorpay().orders.create(options);

  return ApiResponse.success(res, 'Razorpay order created', {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// @desc    Verify Razorpay payment
export const verifyRazorpayPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(body)
    .digest('hex');

  if (expected !== razorpaySignature) throw new AppError('Invalid payment signature', 400);

  order.paymentStatus = PaymentStatus.COMPLETED;
  order.paymentDetails = { orderId: razorpayOrderId, paymentId: razorpayPaymentId, signature: razorpaySignature };
  await order.save();

  return ApiResponse.success(res, 'Payment verified successfully', order);
});

// @desc    Create Stripe checkout session
export const createStripeCheckout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId).populate('items.product');
  if (!order) throw new AppError('Order not found', 404);
  if (order.user.toString() !== req.user!._id.toString()) throw new AppError('Not authorized', 403);

  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.name, images: item.image ? [item.image] : [] },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await getStripe().checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/orders/${order._id}?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/orders/${order._id}?cancelled=true`,
    metadata: { orderId: order._id.toString() },
  });

  return ApiResponse.success(res, 'Stripe checkout session created', { sessionId: session.id, url: session.url });
});

// @desc    Stripe webhook (raw body — registered before express.json in app.ts)
export const stripeWebhook = (req: Request, res: Response): void => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(req.body as Buffer, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ success: false, message: `Webhook Error: ${msg}` });
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.metadata?.orderId) {
      Order.findByIdAndUpdate(session.metadata.orderId, {
        paymentStatus: PaymentStatus.COMPLETED,
        'paymentDetails.transactionId': session.id,
      }).catch((e) => console.error('Stripe webhook update failed:', e));
    }
  }

  res.status(200).json({ received: true });
};

// @desc    Get payment status
export const getPaymentStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) throw new AppError('Order not found', 404);
  if (order.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw new AppError('Not authorized', 403);
  }

  return ApiResponse.success(res, 'Payment status retrieved', {
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    paymentDetails: order.paymentDetails,
  });
});
