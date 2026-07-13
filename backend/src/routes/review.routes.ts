import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
} from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';

const router: Router = Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.use(authenticate);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.put('/:id/helpful', markHelpful);

export default router;
