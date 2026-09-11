import { Router } from 'express';
import { getDepartments, createDepartment } from '../controllers/departmentController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth as any);

router.get('/', getDepartments as any);
router.post('/', requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN'), createDepartment as any);

export default router;
