import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/auth.controller';
import { authenticate, verifyRefreshToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  registerValidator,
  loginValidator,
  emailValidator,
  resetPasswordValidator,
  changePasswordValidator,
} from '../validators/auth.validator';

const router: Router = Router();

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/forgot-password', emailValidator, validate, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validate, resetPassword);
router.post('/refresh', verifyRefreshToken, refreshToken);

// Protected routes
router.use(authenticate);
router.post('/logout', logout);
router.get('/me', getMe);
router.put('/change-password', changePasswordValidator, validate, changePassword);

export default router;
