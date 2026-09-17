import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';
import { generateQuoteEstimate } from '../services/aiQuoteService.js';

let inMemoryInquiries = [];

// @desc    Submit a new quotation / contact inquiry & generate instant AI estimate with price range
// @route   POST /api/inquiries
export const createInquiry = async (req, res, next) => {
  try {
    const {
      fullName,
      companyName,
      email,
      phone,
      productInterest,
      diameter,
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

    const estimate = await generateQuoteEstimate({
      fullName,
      companyName,
      email,
      phone,
      productInterest,
      diameter,
      requiredQuantity,
      deliveryLocation,
      message,
    });

    const inquiryPayload = {
      fullName,
      companyName: companyName || '',
      email,
      phone,
      productInterest: productInterest || 'General Inquiry',
      requiredQuantity: requiredQuantity || '',
      deliveryLocation: deliveryLocation || '',
      message,
      estimate,
      status: 'New',
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      const savedInquiry = await Inquiry.create(inquiryPayload);
      return res.status(201).json({
        success: true,
        message: 'Your inquiry has been submitted successfully. Instant price range & technical estimation generated.',
        data: savedInquiry,
        estimate,
      });
    }

    inquiryPayload._id = `inq-${Date.now()}`;
    inMemoryInquiries.unshift(inquiryPayload);

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. Instant price range & technical estimation generated.',
      data: inquiryPayload,
      estimate,
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

// @desc    Update inquiry status (Admin)
// @route   PATCH /api/inquiries/:id/status
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['New', 'Contacted', 'Quoted', 'Closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const updated = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
      if (updated) {
        return res.status(200).json({ success: true, data: updated, message: 'Status updated' });
      }
    }

    const item = inMemoryInquiries.find((i) => i._id === id);
    if (item) {
      item.status = status;
      return res.status(200).json({ success: true, data: item, message: 'Status updated' });
    }

    res.status(404).json({ success: false, message: 'Inquiry not found' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry (Admin)
// @route   DELETE /api/inquiries/:id
export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Inquiry.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Inquiry deleted' });
    }

    inMemoryInquiries = inMemoryInquiries.filter((i) => i._id !== id);
    res.status(200).json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    next(error);
  }
};
