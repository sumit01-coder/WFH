import { Router } from 'express';
import { getPayrolls, generatePayroll, markPayrollPaid } from '../controllers/payrollController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth as any);

router.get('/', getPayrolls as any);
router.post('/generate', requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN'), generatePayroll as any);
router.put('/:id/pay', requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN'), markPayrollPaid as any);

export default router;
