import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { getAttendance, checkIn, checkOut } from '../controllers/attendanceController';

const router = Router();

router.use(requireAuth as any);

router.get('/', getAttendance as any);
router.post('/checkin', checkIn as any);
router.patch('/:id/checkout', checkOut as any);

export default router;
