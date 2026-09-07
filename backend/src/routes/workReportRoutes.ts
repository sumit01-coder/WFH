import { Router } from 'express';
import { getWorkReports, submitWorkReport } from '../controllers/workReportController';

const router = Router();

router.get('/', getWorkReports);
router.post('/', submitWorkReport);

export default router;
