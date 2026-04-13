import express from 'express';
import { getDogs, getDogById } from '../controllers/dogsController.js';

const router = express.Router();

router.get('/', getDogs);
router.get('/:id', getDogById)

export default router;