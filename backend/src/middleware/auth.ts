import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import User from '../models/User.model';
import { AuthRequest, UserRole } from '../types';

interface JwtPayload {
  id: string;
  role: UserRole;
}

// Verify JWT token and attach user to request
export const authenticate = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(
        new AppError('Authentication required. Please log in.', 401)
      );
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      // Get user from database
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new AppError('User not found', 401));
      }

      if (!user.isActive) {
        return next(
          new AppError('Your account has been deactivated', 403)
        );
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      return next(new AppError('Invalid or expired token', 401));
    }
  }
);

// Check if user has required role
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role '${req.user.role}' is not authorized to access this resource`,
          403
        )
      );
    }

    next();
  };
};

// Verify refresh token
export const verifyRefreshToken = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return next(new AppError('Refresh token is required', 401));
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as JwtPayload;

      const user = await User.findById(decoded.id).select('+refreshToken');

      if (!user) {
        return next(new AppError('User not found', 401));
      }

      if (user.refreshToken !== refreshToken) {
        return next(new AppError('Invalid refresh token', 401));
      }

      req.user = user;
      next();
    } catch (error) {
      return next(new AppError('Invalid or expired refresh token', 401));
    }
  }
);
