import { Router } from 'express';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../controllers/teamController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth as any);

router.get('/', getTeams as any);
router.post('/', requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER'), createTeam as any);
router.put('/:id', requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER'), updateTeam as any);
router.delete('/:id', requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER'), deleteTeam as any);

export default router;
