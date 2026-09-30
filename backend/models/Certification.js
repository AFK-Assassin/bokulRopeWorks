import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certification title is required'],
      trim: true,
    },
    issuingAuthority: {
      type: String,
      required: true,
      trim: true,
    },
    certificateNumber: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    standardCode: {
      type: String,
      default: 'IS 5175 / ISO 9001',
      trim: true,
    },
    validUntil: {
      type: String,
      default: '',
    },
    documentUrl: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
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

const Certification = mongoose.models.Certification || mongoose.model('Certification', certificationSchema);
export default Certification;
