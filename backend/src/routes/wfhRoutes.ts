import { Router } from 'express';
import { getWfhRequests, createWfhRequest, updateWfhStatus } from '../controllers/wfhController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.use(requireAuth as any);

router.get('/', getWfhRequests as any);
router.post('/', createWfhRequest as any);
router.patch('/:id/status', updateWfhStatus as any);

export default router;
