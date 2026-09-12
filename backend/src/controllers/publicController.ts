import { Request, Response } from 'express'
import prisma from '../utils/prisma'
import path from 'path'
import fs from 'fs'

// GET /api/public/jobs/:id
export const getJobPostDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    const job = await prisma.jobPost.findUnique({
      where: { id },
      include: {
        company: {
          select: { name: true, logoUrl: true, website: true }
        }
      }
    })

    if (!job || job.status !== 'OPEN') {
      res.status(404).json({ error: 'Job post not found or closed' })
      return
    }

    res.json({ job })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch job details' })
  }
}

// POST /api/public/jobs/:id/apply
export const applyForJob = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const { name, email, phone, department, technologyKnowledge, cgpa, passingYear } = req.body

    const job = await prisma.jobPost.findUnique({
      where: { id }
    })

    if (!job || job.status !== 'OPEN') {
      res.status(404).json({ error: 'Job post not found or closed' })
      return
    }

    if (!req.file) {
      res.status(400).json({ error: 'Resume file is required' })
      return
    }

    // Save resume file
    const resumeDir = path.join(process.cwd(), 'uploads', 'resumes', job.companyId, job.id)
    fs.mkdirSync(resumeDir, { recursive: true })

    const ext = path.extname(req.file.originalname)
    const filename = `${Date.now()}${ext}`
    const filePath = path.join(resumeDir, filename)
    
    fs.writeFileSync(filePath, req.file.buffer)

    const resumeUrl = `/api-uploads/resumes/${job.companyId}/${job.id}/${filename}`

    const application = await prisma.jobApplication.create({
      data: {
        jobPostId: job.id,
        name,
        email,
        phone,
        department,
        technologyKnowledge,
        cgpa,
        passingYear,
        resumeUrl
      }
    })

    res.status(201).json({ success: true, application })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to submit application' })
  }
}
