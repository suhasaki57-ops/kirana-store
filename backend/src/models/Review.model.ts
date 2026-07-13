import mongoose, { Schema } from 'mongoose';

const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, required: [true, 'Rating is required'], min: [1, 'Min 1'], max: [5, 'Max 5'] },
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 100 },
    comment: { type: String, required: [true, 'Comment is required'], maxlength: 1000 },
    images: [String],
    isVerifiedPurchase: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    helpful: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ createdAt: -1 });

reviewSchema.post('save', async function () {
  const Product = mongoose.model('Product');
  const product = await Product.findById((this as any).product) as any;
  if (product) await product.updateRating();
});

// 'deleteOne' is used instead of deprecated 'remove'
reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
  const Product = mongoose.model('Product');
  const product = await Product.findById((this as any).product) as any;
  if (product) await product.updateRating();
});

export default mongoose.model('Review', reviewSchema);
