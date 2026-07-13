import mongoose, { Schema } from 'mongoose';

const addressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    addresses: [
      {
        fullName: { type: String, required: [true, 'Full name is required'], trim: true },
        phone: { type: String, required: [true, 'Phone is required'], trim: true },
        addressLine1: { type: String, required: [true, 'Address line 1 is required'], trim: true },
        addressLine2: { type: String, trim: true },
        city: { type: String, required: [true, 'City is required'], trim: true },
        state: { type: String, required: [true, 'State is required'], trim: true },
        country: { type: String, required: [true, 'Country is required'], trim: true },
        zipCode: { type: String, required: [true, 'Zip code is required'], trim: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

addressSchema.index({ user: 1 });

addressSchema.pre('save', function (next) {
  const doc = this as any;
  const defaults = doc.addresses.filter((a: any) => a.isDefault);
  if (defaults.length > 1) {
    doc.addresses.forEach((addr: any, index: number) => {
      if (index < doc.addresses.length - 1) addr.isDefault = false;
    });
  }
  next();
});

export default mongoose.model('Address', addressSchema);
