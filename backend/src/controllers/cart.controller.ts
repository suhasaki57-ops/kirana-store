import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';
import Cart from '../models/Cart.model';
import Product from '../models/Product.model';
import { AuthRequest } from '../types';

const populateCart = (cartId: unknown) =>
  Cart.findById(cartId).populate({ path: 'items.product', select: 'name price images stock isActive slug' });

// @desc    Get user cart
export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await Cart.findOne({ user: req.user!._id }).populate({
    path: 'items.product',
    select: 'name price images stock isActive slug',
  });

  if (!cart) return ApiResponse.success(res, 'Cart retrieved successfully', { items: [], subtotal: 0 });
  return ApiResponse.success(res, 'Cart retrieved successfully', cart);
});

// @desc    Add item to cart
export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { productId, quantity = 1, variant } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);
  if (!(product as any).isActive) throw new AppError('Product is not available', 400);
  if ((product as any).stock < quantity) throw new AppError(`Only ${(product as any).stock} items available in stock`, 400);

  let cart = await Cart.findOne({ user: req.user!._id }) as any;

  if (!cart) {
    cart = await Cart.create({
      user: req.user!._id,
      items: [{ product: productId, quantity, price: (product as any).price, variant }],
    });
  } else {
    const idx = cart.items.findIndex((i: any) => i.product.toString() === productId);
    if (idx > -1) {
      const newQty = cart.items[idx].quantity + quantity;
      if ((product as any).stock < newQty) throw new AppError(`Only ${(product as any).stock} items available in stock`, 400);
      cart.items[idx].quantity = newQty;
      cart.items[idx].price = (product as any).price;
    } else {
      cart.items.push({ product: productId, quantity, price: (product as any).price, variant });
    }
    await cart.save();
  }

  const populated = await populateCart(cart._id);
  return ApiResponse.success(res, 'Item added to cart', populated, 201);
});

// @desc    Update cart item quantity
export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) throw new AppError('Quantity must be at least 1', 400);

  const cart = await Cart.findOne({ user: req.user!._id }) as any;
  if (!cart) throw new AppError('Cart not found', 404);

  const item = cart.items.find((i: any) => i._id.toString() === req.params.itemId);
  if (!item) throw new AppError('Cart item not found', 404);

  const product = await Product.findById(item.product) as any;
  if (!product) throw new AppError('Product not found', 404);
  if (product.stock < quantity) throw new AppError(`Only ${product.stock} items available in stock`, 400);

  item.quantity = quantity;
  await cart.save();

  const populated = await populateCart(cart._id);
  return ApiResponse.success(res, 'Cart updated successfully', populated);
});

// @desc    Remove item from cart
export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await Cart.findOne({ user: req.user!._id }) as any;
  if (!cart) throw new AppError('Cart not found', 404);

  const before = cart.items.length;
  cart.items = cart.items.filter((i: any) => i._id.toString() !== req.params.itemId);
  if (cart.items.length === before) throw new AppError('Cart item not found', 404);

  await cart.save();
  return ApiResponse.success(res, 'Item removed from cart', cart);
});

// @desc    Clear cart
export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  await Cart.findOneAndUpdate({ user: req.user!._id }, { $set: { items: [], subtotal: 0 } });
  return ApiResponse.success(res, 'Cart cleared successfully');
});
