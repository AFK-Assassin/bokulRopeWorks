import express from 'express';
import {
  getProcessSteps,
  createProcessStep,
  updateProcessStep,
  deleteProcessStep,
} from '../controllers/processController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProcessSteps);
router.post('/', protect, createProcessStep);
router.put('/:id', protect, updateProcessStep);
router.delete('/:id', protect, deleteProcessStep);

export default router;
