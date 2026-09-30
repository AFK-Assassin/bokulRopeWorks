import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Application title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    suitableProducts: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      default: '/images/bokul_rope_works_hero.webp',
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export default Application;
