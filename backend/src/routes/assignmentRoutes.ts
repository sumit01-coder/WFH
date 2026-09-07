import { Router } from 'express';
import { getAssignments, createAssignment } from '../controllers/assignmentController';

const router = Router();

router.get('/', getAssignments);
router.post('/', createAssignment);

export default router;
