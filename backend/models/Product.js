import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Jute Rope',
    },
    shortDescription: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      default: '100% High-Grade Tossa / White Jute Fibre',
    },
    ply: {
      type: String,
      default: '3-Ply Hawser Laid',
    },
    diameterRange: {
      type: String,
      default: '6mm - 40mm',
    },
    length: {
      type: String,
      default: '100m / 220m Coils / Custom Cut',
    },
    breakingStrength: {
      type: String,
      default: '1,900 - 2,400 kgf (IS 5175 compliant)',
    },
    color: {
      type: String,
      default: 'Natural Golden Brown',
    },
    packaging: {
      type: String,
      default: 'Heavy-Duty Gunny Bundles / Wrapped Coils',
    },
    moq: {
      type: String,
      default: '500 kg / Bulk Commercial Order',
    },
    applications: {
      type: [String],
      default: [],
    },
    technicalSpecs: {
      type: Object,
      default: {},
    },
    imageUrl: {
      type: String,
      default: '/images/bokul_rope_works_hero.webp',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
