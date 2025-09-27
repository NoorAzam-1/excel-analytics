import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { generateInsights } from '../controllers/aiController.js';

const aiRouter = express.Router();

aiRouter.post('/insights', verifyToken(['user', 'admin']), generateInsights);

export default aiRouter;
