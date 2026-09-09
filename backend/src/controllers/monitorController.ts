import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'
import { AuthRequest } from '../middleware/requireAuth'

const prisma = new PrismaClient()

// POST /api/monitor/activity — receive batch of activity logs from desktop app
export const logActivity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId
    const companyId = req.user!.companyId
    const { logs } = req.body as {
      logs: { appName: string; windowTitle: string; durationSec: number; isIdle: boolean; recordedAt: string }[]
    }

    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      res.status(400).json({ error: 'No logs provided' })
      return
    }

    await prisma.activityLog.createMany({
      data: logs.map((l) => ({
        companyId,
        userId,
        appName: l.appName,
        windowTitle: l.windowTitle,
        durationSec: l.durationSec,
        isIdle: l.isIdle,
        recordedAt: new Date(l.recordedAt),
      })),
    })

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save activity logs' })
  }
}

// POST /api/monitor/screenshot — upload a screenshot
export const uploadScreenshot = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId
    const companyId = req.user!.companyId

    if (!req.file) {
      res.status(400).json({ error: 'No screenshot file provided' })
      return
    }

    const screenshotDir = path.join(process.cwd(), 'uploads', 'screenshots', companyId, userId)
    fs.mkdirSync(screenshotDir, { recursive: true })

    const filename = `${Date.now()}.jpg`
    const filePath = path.join(screenshotDir, filename)
    fs.writeFileSync(filePath, req.file.buffer)

    await prisma.desktopScreenshot.create({
      data: {
        companyId,
        userId,
        filePath: `/uploads/screenshots/${companyId}/${userId}/${filename}`,
        takenAt: new Date(),
      },
    })

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save screenshot' })
  }
}

// GET /api/monitor/activity?userId=&date= — HR/Manager view activity logs
export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId
    const { userId, date } = req.query

    const targetDate = date ? new Date(date as string) : new Date()
    const start = new Date(targetDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(targetDate)
    end.setHours(23, 59, 59, 999)

    const logs = await prisma.activityLog.findMany({
      where: {
        companyId,
        ...(userId ? { userId: userId as string } : {}),
        recordedAt: { gte: start, lte: end },
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, photoUrl: true } },
      },
      orderBy: { recordedAt: 'desc' },
    })

    // Aggregate by app
    const appSummary: Record<string, number> = {}
    for (const log of logs) {
      if (!log.isIdle) {
        appSummary[log.appName] = (appSummary[log.appName] || 0) + log.durationSec
      }
    }

    res.json({ logs, appSummary })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch activity logs' })
  }
}

// GET /api/monitor/screenshots?userId=&date= — HR/Manager view screenshots
export const getScreenshots = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId
    const { userId, date } = req.query

    const targetDate = date ? new Date(date as string) : new Date()
    const start = new Date(targetDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(targetDate)
    end.setHours(23, 59, 59, 999)

    const screenshots = await prisma.desktopScreenshot.findMany({
      where: {
        companyId,
        ...(userId ? { userId: userId as string } : {}),
        takenAt: { gte: start, lte: end },
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { takenAt: 'desc' },
    })

    res.json({ screenshots })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch screenshots' })
  }
}
