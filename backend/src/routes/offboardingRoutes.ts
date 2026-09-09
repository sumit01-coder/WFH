import { Router } from 'express';
import { getOffboardingTasks, createOffboardingTask, updateOffboardingTaskStatus } from '../controllers/offboardingController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth as any);

router.get('/', getOffboardingTasks as any);
router.post('/', requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN'), createOffboardingTask as any);
router.put('/:id', updateOffboardingTaskStatus as any);

export default router;
