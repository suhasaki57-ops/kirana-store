import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router: Router = Router();

router.use(authenticate);

export default router;
