import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  updatePaymentStatus,
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router: Router = Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/payment', updatePaymentStatus);

// Admin only
router.put('/:id/status', authorize(UserRole.ADMIN), updateOrderStatus);

export default router;
