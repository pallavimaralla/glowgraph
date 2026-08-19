import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    range: {
      type: String,
      enum: ['Hydra Pure', 'Clarify Essence', 'Renewal Ritual', 'Balance & Glow', 'Calm Shield', 'Radiant Layer'],
      required: true,
    },
    routineCategory: {
      type: String,
      enum: ['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen', 'Treatment', 'Eye Care', 'Lip Care'],
      required: true,
    },
    concernTags: [
      {
        type: String,
        enum: ['Hydration', 'Breakouts', 'Anti-Aging', 'Dark Spots', 'Sensitive', 'Oily', 'Dry', 'Uneven Tone', 'Dullness', 'Irritation'],
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/300x400?text=Verrà+Product',
    },
    embedding: [Number],
  },
  { timestamps: true }
);

productSchema.index({ range: 1, routineCategory: 1 });
productSchema.index({ concernTags: 1 });
productSchema.index({ price: 1 });

export default mongoose.model('Product', productSchema);
