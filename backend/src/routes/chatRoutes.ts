import { Router } from 'express';
import { getRooms, createRoom, getMessages, sendMessage, getOrCreateDirectRoom } from '../controllers/chatController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.use(requireAuth as any);

import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/chat';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.get('/rooms', getRooms as any);
router.post('/rooms', createRoom as any);
router.post('/direct', getOrCreateDirectRoom as any);
router.get('/rooms/:roomId/messages', getMessages as any);
router.post('/rooms/:roomId/messages', upload.single('attachment'), sendMessage as any);

export default router;
