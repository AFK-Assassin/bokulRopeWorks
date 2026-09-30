import express from 'express';
import {
  getMessages,
  createMessage,
  markMessageRead,
  archiveMessage,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMessages);
router.post('/', createMessage);
router.patch('/:id/read', protect, markMessageRead);
router.patch('/:id/archive', protect, archiveMessage);
router.delete('/:id', protect, deleteMessage);

export default router;
