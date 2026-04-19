import express from 'express';
import { getDogs, getDogById, createDog, deleteDog, updateDog } from '../controllers/dogsController.js';

const router = express.Router();

// GET requests - public routes
router.get('/', getDogs);
router.get('/:id', getDogById)
// POST request - admin route
router.post('/', createDog)
// PATCH request - admin route
router.patch('/:id', updateDog)
// DELTE request - admin route
router.delete('/:id', deleteDog)

export default router;