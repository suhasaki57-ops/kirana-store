import mongoose, { Schema } from 'mongoose';
import { ICoupon, CouponType } from '../types';

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, 'Coupon code cannot exceed 20 characters'],
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    type: {
      type: String,
      enum: Object.values(CouponType),
      required: [true, 'Coupon type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Coupon value is required'],
      min: [0, 'Value cannot be negative'],
    },
    minOrderAmount: {
      type: Number,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      min: 0,
    },
    usageLimit: {
      type: Number,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    userUsageLimit: {
      type: Number,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startsAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    applicableProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    applicableCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    excludedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    excludedCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
couponSchema.index({ isActive: 1 });
couponSchema.index({ expiresAt: 1 });

// Validate percentage value
couponSchema.pre('save', function (next) {
  if (this.type === CouponType.PERCENTAGE && this.value > 100) {
    return next(new Error('Percentage value cannot exceed 100'));
  }
  next();
});

// Check if coupon is valid
couponSchema.methods.isValid = function (): boolean {
  if (!this.isActive) return false;

  const now = new Date();
  if (this.startsAt && this.startsAt > now) return false;
  if (this.expiresAt && this.expiresAt < now) return false;

  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;

  return true;
};

export default mongoose.model<ICoupon>('Coupon', couponSchema);
