import mongoose from 'mongoose';

const technicalStandardSchema = new mongoose.Schema(
  {
    diameter: {
      type: String,
      required: [true, 'Nominal diameter is required'],
      trim: true,
    },
    plies: {
      type: String,
      required: [true, 'Construction / Plies is required'],
      default: '3-Strand',
      trim: true,
    },
    approxWeight: {
      type: String,
      required: [true, 'Approximate weight is required'],
      trim: true,
    },
    breakingLoad: {
      type: String,
      required: [true, 'Average breaking load is required'],
      trim: true,
    },
    primaryUse: {
      type: String,
      required: [true, 'Recommended utility is required'],
      trim: true,
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

const TechnicalStandard =
  mongoose.models.TechnicalStandard ||
  mongoose.model('TechnicalStandard', technicalStandardSchema);

export default TechnicalStandard;
