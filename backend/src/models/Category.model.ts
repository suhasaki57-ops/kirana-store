import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: { type: String, unique: true, lowercase: true, sparse: true },
    description: { type: String, maxlength: [500, 'Description cannot exceed 500 characters'] },
    image: { url: String, publicId: String },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    seoTitle: { type: String, maxlength: [60, 'SEO title cannot exceed 60 characters'] },
    seoDescription: { type: String, maxlength: [160, 'SEO description cannot exceed 160 characters'] },
  },
  { timestamps: true }
);

categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });

categorySchema.pre('save', function (next) {
  const doc = this as any;
  if (doc.isModified('name')) {
    doc.slug = slugify(doc.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.pre('save', async function (next) {
  const doc = this as any;
  if (doc.parent && doc.parent.toString() === doc._id.toString()) {
    return next(new Error('A category cannot be its own parent'));
  }
  next();
});

export default mongoose.model('Category', categorySchema);
