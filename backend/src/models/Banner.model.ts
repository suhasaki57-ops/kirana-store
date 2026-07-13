import mongoose, { Schema } from 'mongoose';

const bannerSchema = new Schema(
  {
    title: { type: String, required: [true, 'Banner title is required'], trim: true, maxlength: [100, 'Title cannot exceed 100 characters'] },
    subtitle: { type: String, trim: true, maxlength: [200, 'Subtitle cannot exceed 200 characters'] },
    image: {
      url: { type: String, required: [true, 'Banner image is required'] },
      publicId: { type: String, required: true },
    },
    link: { type: String, trim: true },
    buttonText: { type: String, trim: true, maxlength: [50, 'Button text cannot exceed 50 characters'] },
    position: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startsAt: Date,
    endsAt: Date,
  },
  { timestamps: true }
);

bannerSchema.index({ isActive: 1 });
bannerSchema.index({ position: 1 });

export default mongoose.model('Banner', bannerSchema);
