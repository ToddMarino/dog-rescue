import express from 'express';
import { getStates } from '../controllers/statesController.js';

const router = express.Router();

router.get('/', getStates);

export default router;