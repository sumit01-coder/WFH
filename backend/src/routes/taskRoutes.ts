import { Router } from 'express';
import { getTasks, createTask, updateTaskStatus, updateTask, deleteTask } from '../controllers/taskController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.use(requireAuth as any);

router.get('/', getTasks as any);
router.post('/', createTask as any);
router.patch('/:id/status', updateTaskStatus as any);
router.put('/:id', updateTask as any);
router.delete('/:id', deleteTask as any);

export default router;
