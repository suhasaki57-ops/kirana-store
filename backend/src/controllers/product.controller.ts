import mongoose from 'mongoose';
import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';
import Product from '../models/Product.model';
import Category from '../models/Category.model';
import { AuthRequest } from '../types';

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { isActive: true };

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice as string);
    }

    // Brand filter
    if (req.query.brand) {
      query.brand = req.query.brand;
    }

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search as string };
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // Sorting
    let sort: any = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sort = { price: 1 };
          break;
        case 'price-desc':
          sort = { price: -1 };
          break;
        case 'name-asc':
          sort = { name: 1 };
          break;
        case 'name-desc':
          sort = { name: -1 };
          break;
        case 'rating':
          sort = { averageRating: -1 };
          break;
      }
    }

    const [products, totalItems] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .lean(),
      Product.countDocuments(query),
    ]);

    return ApiResponse.paginate(
      res,
      'Products retrieved successfully',
      products,
      page,
      limit,
      totalItems
    );
  }
);

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .lean();

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return ApiResponse.success(res, 'Product retrieved successfully', product);
  }
);

// @desc    Get product by slug
// @route   GET /api/v1/products/slug/:slug
// @access  Public
export const getProductBySlug = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .lean();

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return ApiResponse.success(res, 'Product retrieved successfully', product);
  }
);

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (req.body.category && typeof req.body.category === 'string' && !mongoose.Types.ObjectId.isValid(req.body.category)) {
      let cat = await Category.findOne({
        name: { $regex: new RegExp(`^${req.body.category.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') }
      });
      if (!cat) {
        cat = await Category.create({ name: req.body.category });
      }
      req.body.category = cat._id;
    }
    const product = await Product.create(req.body);

    return ApiResponse.success(
      res,
      'Product created successfully',
      product,
      201
    );
  }
);

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return ApiResponse.success(res, 'Product updated successfully', product);
  }
);

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return ApiResponse.success(res, 'Product deleted successfully');
  }
);

// @desc    Get related products
// @route   GET /api/v1/products/:id/related
// @access  Public
export const getRelatedProducts = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const limit = parseInt(req.query.limit as string) || 4;

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    })
      .limit(limit)
      .select('name slug price images averageRating numReviews')
      .lean();

    return ApiResponse.success(
      res,
      'Related products retrieved successfully',
      relatedProducts
    );
  }
);
