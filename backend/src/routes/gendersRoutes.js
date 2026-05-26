import express from 'express';
import { getGenders } from '../controllers/gendersController.js';

const router = express.Router();

router.get('/', getGenders);

export default router;