import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: { type: String, unique: true, lowercase: true, sparse: true },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    comparePrice: { type: Number, min: [0, 'Compare price cannot be negative'] },
    costPerItem: { type: Number, min: [0, 'Cost per item cannot be negative'] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category is required'] },
    subcategory: { type: Schema.Types.ObjectId, ref: 'Category' },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        alt: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    stock: { type: Number, required: [true, 'Stock is required'], min: [0, 'Stock cannot be negative'], default: 0 },
    sku: { type: String, required: [true, 'SKU is required'], unique: true, uppercase: true },
    barcode: { type: String, unique: true, sparse: true },
    brand: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    specifications: [{ name: { type: String, required: true }, value: { type: String, required: true } }],
    variants: [{ name: { type: String, required: true }, options: [String] }],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    weight: { type: Number, min: 0 },
    dimensions: { length: Number, width: Number, height: Number },
    seoTitle: { type: String, maxlength: [60, 'SEO title cannot exceed 60 characters'] },
    seoDescription: { type: String, maxlength: [160, 'SEO description cannot exceed 160 characters'] },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });

productSchema.pre('save', function (next) {
  const doc = this as any;
  if (doc.isModified('name')) {
    doc.slug = slugify(doc.name, { lower: true, strict: true });
  }
  next();
});

productSchema.methods.updateRating = async function () {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    { $match: { product: this._id, isApproved: true } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    this.averageRating = Math.round(stats[0].avgRating * 10) / 10;
    this.numReviews = stats[0].numReviews;
  } else {
    this.averageRating = 0;
    this.numReviews = 0;
  }
  await this.save();
};

export default mongoose.model('Product', productSchema);
