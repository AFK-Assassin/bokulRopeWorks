import express from 'express';
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getApplications);
router.post('/', protect, createApplication);
router.put('/:id', protect, updateApplication);
router.delete('/:id', protect, deleteApplication);

export default router;
