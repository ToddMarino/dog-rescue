import express from 'express';
import {getLocationTypes} from '../controllers/locationTypesController.js'

const router = express.Router();

router.get('/', getLocationTypes);

export default router;