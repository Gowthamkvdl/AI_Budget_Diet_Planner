import express from 'express';
import { savePlan, getHistory } from '../controller/historyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, savePlan);
router.get('/', authMiddleware, getHistory);

export default router;