import { Response } from 'express';
import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';
import User from '../models/User.model';
import { AuthRequest, UserRole } from '../types';
import { sendEmail } from '../services/email.service';

// Cookie options
const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge,
});

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, email, password, phone, role } = req.body;

    if (!phone) {
      throw new AppError('Phone number is mandatory', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role === 'admin' ? UserRole.ADMIN : UserRole.USER,
    });

    // Generate tokens
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie('token', token, getCookieOptions(15 * 60 * 1000)); // 15 minutes
    res.cookie('refreshToken', refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 days

    // Send welcome email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to E-Commerce Platform',
        html: `
          <h1>Welcome ${user.name}!</h1>
          <p>Thank you for registering with us.</p>
          <p>Start shopping now and enjoy exclusive deals!</p>
        `,
      });
    } catch (error) {
      // Log error but don't fail registration
      console.error('Failed to send welcome email:', error);
    }

    return ApiResponse.success(
      res,
      'Registration successful',
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
        refreshToken,
      },
      201
    );
  }
);

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { email, password, phone } = req.body;

    if (!phone) {
      throw new AppError('Phone number is mandatory for login', 400);
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated', 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    res.cookie('token', token, getCookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

    return ApiResponse.success(res, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
      refreshToken,
    });
  }
);

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (req.user) {
      // Clear refresh token from database
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }

    // Clear cookies
    res.clearCookie('token');
    res.clearCookie('refreshToken');

    return ApiResponse.success(res, 'Logout successful');
  }
);

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError('User not found', 404);
    }

    return ApiResponse.success(res, 'User retrieved successfully', {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        avatar: req.user.avatar,
        isEmailVerified: req.user.isEmailVerified,
      },
    });
  }
);

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError('User not found', 404);
    }

    // Generate new tokens
    const token = req.user.generateAuthToken();
    const newRefreshToken = req.user.generateRefreshToken();

    // Update refresh token in database
    req.user.refreshToken = newRefreshToken;
    await req.user.save();

    // Set new cookies
    res.cookie('token', token, getCookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', newRefreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

    return ApiResponse.success(res, 'Token refreshed successfully', {
      token,
      refreshToken: newRefreshToken,
    });
  }
);

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('No user found with that email', 404);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset Request</h1>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>This link will expire in 30 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });

      return ApiResponse.success(res, 'Password reset email sent');
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      throw new AppError('Failed to send reset email. Please try again.', 500);
    }
  }
);

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return ApiResponse.success(res, 'Password reset successful');
  }
);

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!req.user) {
      throw new AppError('User not found', 404);
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return ApiResponse.success(res, 'Password changed successfully');
  }
);
