import express from 'express';
import { getSizes } from '../controllers/sizesController.js';

const router = express.Router();

router.get('/', getSizes);

export default router;