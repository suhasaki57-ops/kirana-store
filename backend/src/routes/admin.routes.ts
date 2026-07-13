import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router: Router = Router();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

export default router;
