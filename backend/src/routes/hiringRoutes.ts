import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { createJobPost, getJobPosts, getJobApplications, updateApplicationStatus } from '../controllers/hiringController'

const router = Router()

router.post('/jobs', requireAuth, createJobPost)
router.get('/jobs', requireAuth, getJobPosts)
router.get('/jobs/:id/applications', requireAuth, getJobApplications)
router.put('/applications/:id/status', requireAuth, updateApplicationStatus)

export default router
