import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';

// In-memory store for inquiries when DB is offline
const inMemoryInquiries = [];

// @desc    Submit a new quotation / contact inquiry
// @route   POST /api/inquiries
export const createInquiry = async (req, res, next) => {
  try {
    const {
      fullName,
      companyName,
      email,
      phone,
      productInterest,
      requiredQuantity,
      deliveryLocation,
      message,
    } = req.body;

    if (!fullName || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fullName, email, phone, and message.',
      });
    }

    const inquiryPayload = {
      fullName,
      companyName: companyName || '',
      email,
      phone,
      productInterest: productInterest || 'General Inquiry',
      requiredQuantity: requiredQuantity || '',
      deliveryLocation: deliveryLocation || '',
      message,
      status: 'New',
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      const savedInquiry = await Inquiry.create(inquiryPayload);
      return res.status(201).json({
        success: true,
        message: 'Your inquiry has been submitted successfully. Our sales team will reach out shortly.',
        data: savedInquiry,
      });
    }

    // Fallback store
    inquiryPayload._id = `inq-${Date.now()}`;
    inMemoryInquiries.push(inquiryPayload);

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully (Logged). Our sales team will reach out shortly.',
      data: inquiryPayload,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries (for admin review)
// @route   GET /api/inquiries
export const getInquiries = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const inquiries = await Inquiry.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: inquiries.length,
        data: inquiries,
      });
    }

    res.status(200).json({
      success: true,
      count: inMemoryInquiries.length,
      data: inMemoryInquiries,
    });
  } catch (error) {
    next(error);
  }
};
