import { Router } from 'express'
import multer from 'multer'
import { getJobPostDetails, applyForJob } from '../controllers/publicController'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }) // 10MB limit

router.get('/jobs/:id', getJobPostDetails)
router.post('/jobs/:id/apply', upload.single('resume'), applyForJob)

export default router
