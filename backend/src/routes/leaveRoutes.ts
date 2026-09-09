import { Router } from 'express';
import { createLeaveRequest, getLeaveRequests, updateLeaveStatus, getLeaveBalances } from '../controllers/leaveController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth as any);

router.get('/balances', getLeaveBalances as any);
router.get('/', getLeaveRequests as any);
router.post('/', createLeaveRequest as any);
router.put('/:id/status', requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER'), updateLeaveStatus as any);

export default router;
