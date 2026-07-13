import { Router } from 'express';
import {
  getCategories,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router: Router = Router();

// Public routes
router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategory);

// Protected/Admin routes
router.post('/', authenticate, authorize(UserRole.ADMIN), createCategory);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), updateCategory);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteCategory);

export default router;
