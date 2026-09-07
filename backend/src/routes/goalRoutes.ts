import { Router } from 'express';
import { getGoals, updateGoalProgress } from '../controllers/goalController';

const router = Router();

router.get('/', getGoals);
router.patch('/:id/progress', updateGoalProgress);

export default router;
