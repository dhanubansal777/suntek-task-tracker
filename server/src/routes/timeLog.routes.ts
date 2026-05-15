import { Router } from 'express';
import { startTimeLog, stopTimeLog } from '../controllers/timeLog.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/start', startTimeLog);
router.patch('/:id/stop', stopTimeLog);

export default router;
