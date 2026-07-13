import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router: Router = Router();

// All user routes require authentication
router.use(authenticate);

// Routes will be implemented in controllers

export default router;
