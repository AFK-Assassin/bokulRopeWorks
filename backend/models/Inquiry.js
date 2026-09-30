import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    whatsApp: {
      type: String,
      trim: true,
      default: '',
    },
    productInterest: {
      type: String,
      default: '3-Strand Hawser Laid Jute Rope',
    },
    diameter: {
      type: String,
      default: '',
    },
    requiredQuantity: {
      type: String,
      default: '',
    },
    deliveryLocation: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    estimate: {
      type: Object,
      default: null,
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'QUOTED', 'NEGOTIATING', 'WON', 'LOST', 'New', 'Contacted', 'Quoted', 'Closed'],
      default: 'NEW',
    },
    internalNotes: {
      type: String,
      default: '',
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
