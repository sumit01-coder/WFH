import { Router } from 'express';
import { getTeams, createTeam } from '../controllers/teamController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth as any);

router.get('/', getTeams as any);
router.post('/', requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER'), createTeam as any);

export default router;
