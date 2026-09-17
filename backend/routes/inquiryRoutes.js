import express from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for buyers submitting quotation requests
router.post('/', createInquiry);

// Protected routes for Owner/Admin lead management
router.get('/', protect, getInquiries);
router.patch('/:id/status', protect, updateInquiryStatus);
router.delete('/:id', protect, deleteInquiry);

export default router;
