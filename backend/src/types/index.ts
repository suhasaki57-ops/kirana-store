import { Document, Types } from 'mongoose';
import { Request } from 'express';

// ─── User ────────────────────────────────────────────────────────────────────
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  generateRefreshToken(): string;
}

// ─── Product ─────────────────────────────────────────────────────────────────
export interface IProductImage {
  url: string;
  publicId: string;
  alt?: string;
  isDefault: boolean;
}

export interface IProductSpecification {
  name: string;
  value: string;
}

export interface IProductVariant {
  name: string;
  options: string[];
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  costPerItem?: number;
  category: Types.ObjectId;
  subcategory?: Types.ObjectId;
  images: IProductImage[];
  stock: number;
  sku: string;
  barcode?: string;
  brand?: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  specifications?: IProductSpecification[];
  variants?: IProductVariant[];
  averageRating: number;
  numReviews: number;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  updateRating(): Promise<void>;
}

// ─── Category ────────────────────────────────────────────────────────────────
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; publicId: string };
  parent?: Types.ObjectId;
  isActive: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface ICartItem {
  _id?: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  price: number;
  variant?: Record<string, string>;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Wishlist ────────────────────────────────────────────────────────────────
export interface IWishlist extends Document {
  user: Types.ObjectId;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  PACKED = 'packed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  COD = 'cod',
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
}

export interface IAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: Record<string, string>;
}

export interface IOrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: Types.ObjectId | any;
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress?: IAddress;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDetails?: {
    transactionId?: string;
    paymentId?: string;
    orderId?: string;
    signature?: string;
  };
  orderStatus: OrderStatus;
  statusHistory: IOrderStatusHistory[];
  coupon?: Types.ObjectId;
  notes?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  returnedAt?: Date;
  returnReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Review ──────────────────────────────────────────────────────────────────
export interface IReview extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  order?: Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Coupon ──────────────────────────────────────────────────────────────────
export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export interface ICoupon extends Document {
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  userUsageLimit?: number;
  isActive: boolean;
  startsAt?: Date;
  expiresAt?: Date;
  applicableProducts?: Types.ObjectId[];
  applicableCategories?: Types.ObjectId[];
  excludedProducts?: Types.ObjectId[];
  excludedCategories?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  isValid(): boolean;
}

// ─── Banner ──────────────────────────────────────────────────────────────────
export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  image: { url: string; publicId: string };
  link?: string;
  buttonText?: string;
  position: number;
  isActive: boolean;
  startsAt?: Date;
  endsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export enum NotificationType {
  ORDER = 'order',
  PAYMENT = 'payment',
  PRODUCT = 'product',
  ACCOUNT = 'account',
  PROMOTION = 'promotion',
  SYSTEM = 'system',
}

export interface INotification extends Document {
  user: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Address model ───────────────────────────────────────────────────────────
export interface IAddressModel extends Document {
  user: Types.ObjectId;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Express Request extension ───────────────────────────────────────────────
export interface AuthRequest extends Request {
  user?: IUser;
}
