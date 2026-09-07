import { Router } from 'express';
import { getTasks, createTask, updateTaskStatus } from '../controllers/taskController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.use(requireAuth as any);

router.get('/', getTasks as any);
router.post('/', createTask as any);
router.patch('/:id/status', updateTaskStatus as any);

export default router;
