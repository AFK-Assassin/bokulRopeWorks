import Inquiry from '../models/Inquiry.js';
import ActivityLog from '../models/ActivityLog.js';
import { generateQuoteEstimate } from '../services/aiQuoteService.js';

export const createInquiry = async (req, res, next) => {
  try {
    const {
      fullName,
      companyName,
      email,
      phone,
      whatsApp,
      productInterest,
      diameter,
      requiredQuantity,
      deliveryLocation,
      message,
    } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a Full Name and Phone number',
      });
    }

    let estimate = null;
    try {
      estimate = await generateQuoteEstimate({
        productName: productInterest,
        quantity: requiredQuantity,
        diameter: diameter,
        location: deliveryLocation,
      });
    } catch (aiError) {
      console.warn('[AI Quote Warning] Fallback to deterministic model:', aiError.message);
    }

    const inquiry = await Inquiry.create({
      fullName,
      companyName: companyName || '',
      email: email || '',
      phone,
      whatsApp: whatsApp || phone,
      productInterest: productInterest || 'General Inquiry',
      diameter: diameter || '',
      requiredQuantity: requiredQuantity || 'Standard Batch',
      deliveryLocation: deliveryLocation || 'Not specified',
      message: message || '',
      estimate,
      status: 'NEW',
    });

    res.status(201).json({
      success: true,
      message: 'Quotation request submitted to Bokul Rope Works sales desk',
      data: inquiry,
      estimate,
    });
  } catch (error) {
    next(error);
  }
};

export const getInquiries = async (req, res, next) => {
  try {
    const { status, search, archived } = req.query;
    let query = {};

    if (archived === 'true') {
      query.isArchived = true;
    } else {
      query.isArchived = false;
    }

    if (status && status !== 'All') {
      query.status = status.toUpperCase();
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { productInterest: { $regex: search, $options: 'i' } },
      ];
    }

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status, internalNotes, isArchived } = req.body;
    let updateFields = {};
    if (status) updateFields.status = status.toUpperCase();
    if (internalNotes !== undefined) updateFields.internalNotes = internalNotes;
    if (isArchived !== undefined) updateFields.isArchived = isArchived;

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    await ActivityLog.create({
      action: `Updated Quote #${inquiry._id.toString().slice(-6)} Status: ${inquiry.status}`,
      category: 'Quote',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    await ActivityLog.create({
      action: `Deleted Quote Request: ${inquiry.fullName} (${inquiry.productInterest})`,
      category: 'Quote',
      adminEmail: req.user?.email || 'admin@bokulrope.com',
    });

    res.status(200).json({
      success: true,
      message: 'Inquiry removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
