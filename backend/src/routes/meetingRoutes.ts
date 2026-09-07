import { Router } from 'express';
import { getMeetings, createMeeting } from '../controllers/meetingController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.use(requireAuth as any);

router.get('/', getMeetings as any);
router.post('/', createMeeting as any);

export default router;
