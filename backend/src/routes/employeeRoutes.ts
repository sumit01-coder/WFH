import { Router } from 'express';
import { getEmployees, createEmployee, deleteEmployee } from '../controllers/employeeController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/', requireAuth, getEmployees);
router.post('/', requireAuth, createEmployee);
router.delete('/:id', requireAuth, deleteEmployee);

export default router;
