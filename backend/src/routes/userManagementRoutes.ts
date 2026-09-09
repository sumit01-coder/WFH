import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { inviteUser, listCompanyUsers, toggleUserAccess } from '../controllers/userManagementController';
import { getMyFeatures } from '../controllers/userFeaturesController';

const router = Router();

// Only HR, Company Admin, and Super Admin can invite users
router.post('/invite', requireAuth, requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN'), inviteUser as any);

// Everyone in the company can see the list of users (to know their colleagues)
router.get('/', requireAuth, listCompanyUsers as any);

// Returns which sidebar features/sections are active for the logged-in user
router.get('/me/features', requireAuth, getMyFeatures as any);

// Toggle user login access (active/suspended)
router.put('/:id/access', requireAuth, requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN'), toggleUserAccess as any);

export default router;
