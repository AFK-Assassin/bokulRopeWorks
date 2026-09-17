import express from 'express';
import { login, logout, getMe, seedAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/seed', seedAdmin);

export default router;
