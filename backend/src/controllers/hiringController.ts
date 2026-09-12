import { Request, Response } from 'express'
import prisma from '../utils/prisma'
import { AuthRequest } from '../middleware/requireAuth'

// POST /api/hiring/jobs
export const createJobPost = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId
    const { title, description, salary, experience, type } = req.body

    const job = await prisma.jobPost.create({
      data: {
        companyId,
        title,
        description,
        salary,
        experience,
        type // INTERNSHIP or DIRECT
      }
    })

    res.status(201).json({ success: true, job })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create job post' })
  }
}

// GET /api/hiring/jobs
export const getJobPosts = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId
    const jobs = await prisma.jobPost.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    })

    res.json({ jobs })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch job posts' })
  }
}

// GET /api/hiring/jobs/:id/applications
export const getJobApplications = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId
    const { id } = req.params

    const job = await prisma.jobPost.findFirst({
      where: { id, companyId }
    })

    if (!job) {
      res.status(404).json({ error: 'Job post not found' })
      return
    }

    const applications = await prisma.jobApplication.findMany({
      where: { jobPostId: id },
      orderBy: { appliedAt: 'desc' }
    })

    res.json({ job, applications })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
}

// PUT /api/hiring/applications/:id/status
export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId
    const { id } = req.params
    const { status } = req.body // SHORTLISTED or REJECTED

    // Verify application belongs to a job from this company
    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: { jobPost: true }
    })

    if (!application || application.jobPost.companyId !== companyId) {
      res.status(404).json({ error: 'Application not found' })
      return
    }

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: { status }
    })

    res.json({ success: true, application: updated })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update application status' })
  }
}
