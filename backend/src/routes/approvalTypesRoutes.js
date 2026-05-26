import express from 'express';
import { getApprovalTypes } from '../controllers/approvalTypesController.js';

const router = express.Router();

router.get('/', getApprovalTypes);

export default router;