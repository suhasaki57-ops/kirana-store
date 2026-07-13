import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router: Router = Router();

// Public routes
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);

// Protected/Admin routes
router.post('/', authenticate, authorize(UserRole.ADMIN), createProduct);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), updateProduct);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteProduct);

export default router;
