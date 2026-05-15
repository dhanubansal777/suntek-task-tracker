import { Router } from 'express';
import { getDailySummary } from '../controllers/summary.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/daily', getDailySummary);

export default router;
