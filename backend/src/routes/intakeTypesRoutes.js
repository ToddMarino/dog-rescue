import express from 'express';
import { getIntakeTypes } from '../controllers/intakeTypesController.js';

const router = express.Router();

router.get('/', getIntakeTypes);

export default router;