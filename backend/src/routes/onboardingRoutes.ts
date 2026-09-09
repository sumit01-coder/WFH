import { Router } from 'express';
import { getOnboardingTasks, createOnboardingTask, updateOnboardingTaskStatus } from '../controllers/onboardingController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth as any);

router.get('/', getOnboardingTasks as any);
router.post('/', requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN'), createOnboardingTask as any);
router.put('/:id', updateOnboardingTaskStatus as any);

export default router;
