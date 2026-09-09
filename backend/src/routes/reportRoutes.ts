import { Router } from 'express';
import { submitWorkReport, getWorkReports, reviewWorkReport } from '../controllers/reportController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth as any);

router.get('/', getWorkReports as any);
router.post('/', submitWorkReport as any);
router.put('/:id/review', requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER'), reviewWorkReport as any);

export default router;
