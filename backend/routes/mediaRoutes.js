import express from 'express';
import {
  getMedia,
  createMedia,
  uploadMediaFile,
  deleteMedia,
  upload,
} from '../controllers/mediaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMedia);
router.post('/', protect, createMedia);
router.post('/upload', protect, upload.single('file'), uploadMediaFile);
router.delete('/:id', protect, deleteMedia);

export default router;
