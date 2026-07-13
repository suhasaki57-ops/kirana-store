import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';
import Wishlist from '../models/Wishlist.model';
import Product from '../models/Product.model';
import { AuthRequest } from '../types';

// @desc    Get user wishlist
// @route   GET /api/v1/wishlist
// @access  Private
export const getWishlist = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    let wishlist = await Wishlist.findOne({ user: req.user!._id }).populate({
      path: 'products',
      select: 'name slug price comparePrice images averageRating numReviews stock isActive',
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user!._id,
        products: [],
      });
    }

    return ApiResponse.success(res, 'Wishlist retrieved successfully', wishlist);
  }
);

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist/:productId
// @access  Private
export const addToWishlist = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    let wishlist = await Wishlist.findOne({ user: req.user!._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user!._id,
        products: [productId],
      });
    } else {
      // Check if already in wishlist
      if (wishlist.products.includes(productId as any)) {
        throw new AppError('Product already in wishlist', 400);
      }

      wishlist.products.push(productId as any);
      await wishlist.save();
    }

    return ApiResponse.success(
      res,
      'Product added to wishlist',
      wishlist,
      201
    );
  }
);

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Private
export const removeFromWishlist = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user!._id });

    if (!wishlist) {
      throw new AppError('Wishlist not found', 404);
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();

    return ApiResponse.success(res, 'Product removed from wishlist', wishlist);
  }
);

// @desc    Check if product is in wishlist
// @route   GET /api/v1/wishlist/check/:productId
// @access  Private
export const checkWishlist = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user!._id });

    const isInWishlist = wishlist
      ? wishlist.products.some((id) => id.toString() === productId)
      : false;

    return ApiResponse.success(res, 'Wishlist check completed', { isInWishlist });
  }
);
