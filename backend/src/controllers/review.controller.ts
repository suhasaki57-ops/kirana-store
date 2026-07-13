import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';
import Review from '../models/Review.model';
import Product from '../models/Product.model';
import Order from '../models/Order.model';
import { AuthRequest } from '../types';

// @desc    Get product reviews
export const getProductReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const query = { product: req.params.productId, isApproved: true };
  const [reviews, totalItems] = await Promise.all([
    Review.find(query).populate('user', 'name avatar').sort({ createdAt: -1 }).limit(limit).skip(skip).lean(),
    Review.countDocuments(query),
  ]);

  return ApiResponse.paginate(res, 'Reviews retrieved successfully', reviews, page, limit, totalItems);
});

// @desc    Create review
export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { product, rating, title, comment, images, orderId } = req.body;

  const productDoc = await Product.findById(product) as any;
  if (!productDoc) throw new AppError('Product not found', 404);

  const existing = await Review.findOne({ user: req.user!._id, product });
  if (existing) throw new AppError('You have already reviewed this product', 400);

  let isVerifiedPurchase = false;
  if (orderId) {
    const order = await Order.findOne({ _id: orderId, user: req.user!._id, 'items.product': product, orderStatus: 'delivered' });
    isVerifiedPurchase = !!order;
  }

  const review = await Review.create({
    user: req.user!._id,
    product,
    rating,
    title,
    comment,
    images,
    order: orderId,
    isVerifiedPurchase,
    isApproved: isVerifiedPurchase,
  });

  await productDoc.updateRating();
  return ApiResponse.success(res, 'Review created successfully', review, 201);
});

// @desc    Update review
export const updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError('Review not found', 404);
  if (review.user.toString() !== req.user!._id.toString()) throw new AppError('Not authorized to update this review', 403);

  const { rating, title, comment, images } = req.body;
  if (rating !== undefined) review.rating = rating;
  if (title !== undefined) review.title = title;
  if (comment !== undefined) review.comment = comment;
  if (images !== undefined) review.images = images;
  review.isApproved = false;
  await review.save();

  const product = await Product.findById(review.product) as any;
  if (product) await product.updateRating();

  return ApiResponse.success(res, 'Review updated successfully', review);
});

// @desc    Delete review
export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError('Review not found', 404);
  if (review.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw new AppError('Not authorized to delete this review', 403);
  }

  const productId = review.product;
  await review.deleteOne();

  const product = await Product.findById(productId) as any;
  if (product) await product.updateRating();

  return ApiResponse.success(res, 'Review deleted successfully');
});

// @desc    Mark review as helpful
export const markHelpful = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { $inc: { helpful: 1 } }, { new: true });
  if (!review) throw new AppError('Review not found', 404);
  return ApiResponse.success(res, 'Review marked as helpful', review);
});
