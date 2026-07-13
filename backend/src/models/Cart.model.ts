import mongoose, { Schema } from 'mongoose';

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
          default: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        variant: {
          type: Map,
          of: String,
        },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 });

cartSchema.pre('save', function (next) {
  const doc = this as any;
  doc.subtotal = doc.items.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0
  );
  next();
});

export default mongoose.model('Cart', cartSchema);
