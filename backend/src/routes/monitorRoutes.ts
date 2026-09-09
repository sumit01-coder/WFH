import { Router } from 'express'
import multer from 'multer'
import { requireAuth } from '../middleware/requireAuth'
import { logActivity, uploadScreenshot, getActivityLogs, getScreenshots } from '../controllers/monitorController'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

router.post('/activity', requireAuth, logActivity)
router.post('/screenshot', requireAuth, upload.single('screenshot'), uploadScreenshot)
router.get('/activity', requireAuth, getActivityLogs)
router.get('/screenshots', requireAuth, getScreenshots)

export default router
