import { Router } from 'express';
import { getExpenses, submitExpense, updateExpenseStatus } from '../controllers/expenseController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth as any);

router.get('/', getExpenses as any);
router.post('/', submitExpense as any);
router.put('/:id/status', requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN'), updateExpenseStatus as any);

export default router;
