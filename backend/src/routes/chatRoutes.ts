import { Router } from 'express';
import { getRooms, getMessages, sendMessage } from '../controllers/chatController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.use(requireAuth as any);

router.get('/rooms', getRooms as any);
router.get('/rooms/:roomId/messages', getMessages as any);
router.post('/rooms/:roomId/messages', sendMessage as any);

export default router;
