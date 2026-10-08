import express from 'express';
import {
  getTechnicalStandards,
  createTechnicalStandard,
  updateTechnicalStandard,
  deleteTechnicalStandard,
} from '../controllers/standardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTechnicalStandards);
router.post('/', protect, createTechnicalStandard);
router.put('/:id', protect, updateTechnicalStandard);
router.delete('/:id', protect, deleteTechnicalStandard);

export default router;
