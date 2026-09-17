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
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    productInterest: {
      type: String,
      default: 'General Inquiry',
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
      required: [true, 'Message is required'],
    },
    estimate: {
      type: Object,
      default: null,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Quoted', 'Closed'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
