import express from 'express';
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from '../controllers/certificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCertifications);
router.post('/', protect, createCertification);
router.put('/:id', protect, updateCertification);
router.delete('/:id', protect, deleteCertification);

export default router;
