import mongoose from 'mongoose';

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index: MongoDB will delete document once expiresAt time is reached
    },
  },
  {
    timestamps: true,
  }
);

export const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
