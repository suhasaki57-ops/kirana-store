import mongoose, { Schema } from 'mongoose';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../types';

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        variant: { type: Map, of: String },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    billingAddress: {
      fullName: String, phone: String, addressLine1: String, addressLine2: String,
      city: String, state: String, country: String, zipCode: String,
    },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    shippingCharges: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    paymentDetails: {
      transactionId: String, paymentId: String, orderId: String, signature: String,
    },
    orderStatus: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
    statusHistory: [
      {
        status: { type: String, enum: Object.values(OrderStatus), required: true },
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
    notes: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    returnedAt: Date,
    returnReason: String,
  },
  { timestamps: true }
);

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.pre('save', function (next) {
  const doc = this as any;
  if (!doc.orderNumber) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    doc.orderNumber = `ORD-${ts}-${rand}`;
  }
  next();
});

orderSchema.pre('save', function (next) {
  const doc = this as any;
  if (doc.isModified('orderStatus')) {
    doc.statusHistory.push({ status: doc.orderStatus, timestamp: new Date() });
  }
  next();
});

export default mongoose.model('Order', orderSchema);
