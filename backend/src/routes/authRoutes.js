import express from 'express';
import { login, signup, me } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Protected Route
// this route will be called automatically by the frontend. A check will be made to see if there is a cookie in localstorage and used to refresh the session.
router.get('/me', authMiddleware, me)

export default router;