import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      enum: ['image', 'document', 'pdf'],
      default: 'image',
    },
    fileSize: {
      type: Number, // in bytes
      default: 0,
    },
    altText: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);
export default Media;
