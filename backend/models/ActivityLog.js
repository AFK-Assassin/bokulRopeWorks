import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Product', 'Quote', 'Message', 'Process', 'Application', 'Certification', 'Media', 'Settings', 'Auth'],
      default: 'Product',
    },
    details: {
      type: String,
      default: '',
    },
    adminEmail: {
      type: String,
      default: 'admin@bokulrope.com',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
