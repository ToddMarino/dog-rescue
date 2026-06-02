import express from 'express';
import {
  addDogPhoto,
  deleteDogPhoto,
  getDogPhotos,
  setPrimaryPhoto,
} from '../controllers/dogPhotosController.js';

const router = express.Router();

router.get('/dogs/:id/photos', getDogPhotos);
router.post('/', addDogPhoto);
router.patch('/dog-photos/:photo_id/primary', setPrimaryPhoto);
router.delete('/dog-photos/:photo_id', deleteDogPhoto);

export default router;
