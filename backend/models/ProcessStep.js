import mongoose from 'mongoose';

const processStepSchema = new mongoose.Schema(
  {
    stepNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    title: {
      type: String,
      required: [true, 'Step title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Step description is required'],
    },
    imageUrl: {
      type: String,
      default: '/images/bokul_rope_works_process.webp',
    },
    keyParameters: {
      type: [String],
      default: [],
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
  { timestamps: true }
);

const ProcessStep = mongoose.models.ProcessStep || mongoose.model('ProcessStep', processStepSchema);
export default ProcessStep;
