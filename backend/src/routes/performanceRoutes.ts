import { Router } from 'express';
import { getPerformanceRecords, generatePerformanceRecord } from '../controllers/performanceController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth as any);

router.get('/', getPerformanceRecords as any);
router.post('/generate', requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER'), generatePerformanceRecord as any);

export default router;
