import { Router } from 'express';
import { getDepartments, createDepartment } from '../controllers/departmentController';

const router = Router();

router.get('/', getDepartments);
router.post('/', createDepartment);

export default router;
