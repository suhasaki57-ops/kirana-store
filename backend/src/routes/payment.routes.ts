import { Router } from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripeCheckout,
  getPaymentStatus,
} from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';

const router: Router = Router();

// All payment routes require authentication
// Note: Stripe webhook is registered directly in app.ts (needs raw body parser)
router.use(authenticate);

router.post('/razorpay/create', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);
router.post('/stripe/create', createStripeCheckout);
router.get('/status/:orderId', getPaymentStatus);

export default router;
