import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';
import Category from '../models/Category.model';
import { AuthRequest } from '../types';

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const query: any = {};

    // Filter by active status
    if (req.query.active !== undefined) {
      query.isActive = req.query.active === 'true';
    } else {
      query.isActive = true; // Default to active only
    }

    // Filter by parent
    if (req.query.parent === 'null') {
      query.parent = null; // Top-level categories only
    } else if (req.query.parent) {
      query.parent = req.query.parent;
    }

    const categories = await Category.find(query)
      .populate('parent', 'name slug')
      .sort({ order: 1, name: 1 })
      .lean();

    return ApiResponse.success(
      res,
      'Categories retrieved successfully',
      categories
    );
  }
);

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name slug')
      .lean();

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Get subcategories
    const subcategories = await Category.find({ parent: (category as any)._id }).lean();

    return ApiResponse.success(res, 'Category retrieved successfully', {
      category,
      subcategories,
    });
  }
);

// @desc    Get category by slug
// @route   GET /api/v1/categories/slug/:slug
// @access  Public
export const getCategoryBySlug = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parent', 'name slug')
      .lean();

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Get subcategories
    const subcategories = await Category.find({ parent: (category as any)._id }).lean();

    return ApiResponse.success(res, 'Category retrieved successfully', {
      category,
      subcategories,
    });
  }
);

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private/Admin
export const createCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const category = await Category.create(req.body);

    return ApiResponse.success(
      res,
      'Category created successfully',
      category,
      201
    );
  }
);

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return ApiResponse.success(res, 'Category updated successfully', category);
  }
);

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Check if category has subcategories
    const subcategories = await Category.countDocuments({ parent: category._id });
    if (subcategories > 0) {
      throw new AppError(
        'Cannot delete category with subcategories. Please delete subcategories first.',
        400
      );
    }

    await category.deleteOne();

    return ApiResponse.success(res, 'Category deleted successfully');
  }
);
