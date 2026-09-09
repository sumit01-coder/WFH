import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { getAttendance, checkIn, checkOut } from '../controllers/attendanceController';

const router = Router();

router.use(requireAuth as any);

router.get('/', getAttendance as any);
router.post('/checkin', checkIn as any);
import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/worklogs';
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

router.patch('/:id/checkout', upload.single('worklog_attachment'), checkOut as any);

export default router;
