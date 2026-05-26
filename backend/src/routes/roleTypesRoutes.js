import express from 'express';
import {getRoleTypes} from '../controllers/roleTypesController.js'

const router = express.Router();

router.get('/', getRoleTypes);

export default router