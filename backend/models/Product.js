import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Twisted Ropes', 'Industrial Cordage', 'Packaging Twines', 'Custom Orders'],
      default: 'Twisted Ropes',
    },
    description: {
      type: String,
      required: true,
    },
    diameterRange: {
      type: String,
      default: '6mm - 40mm',
    },
    ply: {
      type: String,
      default: '3-Ply / 4-Ply',
    },
    applications: {
      type: [String],
      default: [],
    },
    moq: {
      type: String,
      default: '500 kg / Bulk Order',
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
