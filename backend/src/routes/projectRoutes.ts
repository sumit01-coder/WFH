import { Router } from 'express';
import { getProjects, createProject, updateProject } from '../controllers/projectController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth);

router.get('/', getProjects);
router.post('/', requireRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'HR', 'MANAGER'), createProject);
router.put('/:id', requireRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'HR', 'MANAGER'), updateProject);

export default router;
