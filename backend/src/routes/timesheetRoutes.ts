import { Router } from 'express';
import { getTimesheets, createTimesheetEntry } from '../controllers/timesheetController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.use(requireAuth as any);

router.get('/', getTimesheets as any);
router.post('/', createTimesheetEntry as any);

export default router;
