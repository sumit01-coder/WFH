import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { inviteUser, listCompanyUsers } from '../controllers/userManagementController';

const router = Router();

// Only HR, Company Admin, and Super Admin can invite users
router.post('/invite', requireAuth, requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN'), inviteUser as any);

// Everyone in the company can see the list of users (to know their colleagues)
router.get('/', requireAuth, listCompanyUsers as any);

export default router;
