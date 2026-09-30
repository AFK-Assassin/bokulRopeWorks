import express from 'express';
import { getMedia, createMedia, deleteMedia } from '../controllers/mediaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMedia);
router.post('/', protect, createMedia);
router.delete('/:id', protect, deleteMedia);

export default router;
