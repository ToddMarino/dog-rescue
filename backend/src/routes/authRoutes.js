import express from 'express';
import { login, signup, me } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Protected Route
router.get('/me', authMiddleware, me)

export default router;