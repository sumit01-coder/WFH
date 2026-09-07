import { Router } from 'express';
import { getMeetings, createMeeting } from '../controllers/meetingController';

const router = Router();

router.get('/', getMeetings);
router.post('/', createMeeting);

export default router;
