import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';

export const submitWorkReport = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId } = req.user!;
    const { date, completedWork, wip, blockers, tomorrowPlan, hoursWorked } = req.body;

    const report = await prisma.workReport.create({
      data: {
        companyId,
        userId,
        date: new Date(date),
        completedWork,
        wip,
        blockers,
        tomorrowPlan,
        hoursWorked,
        status: 'SUBMITTED'
      },
      include: {
        user: { select: { firstName: true, lastName: true } }
      }
    });

    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit work report' });
  }
};

export const getWorkReports = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId, role } = req.user!;
    
    let whereClause: any = { companyId };
    
    if (!['HR', 'MANAGER', 'COMPANY_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      whereClause.userId = userId;
    }

    const reports = await prisma.workReport.findMany({
      where: whereClause,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        reviewedBy: { select: { firstName: true, lastName: true } }
      },
      orderBy: { date: 'desc' }
    });

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch work reports' });
  }
};

export const reviewWorkReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reviewComments, status } = req.body;
    const { companyId, userId } = req.user!;

    const report = await prisma.workReport.findFirst({
      where: { id, companyId }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const updatedReport = await prisma.workReport.update({
      where: { id },
      data: {
        status: status || 'REVIEWED',
        reviewComments,
        reviewedById: userId,
        reviewedAt: new Date()
      },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        reviewedBy: { select: { firstName: true, lastName: true } }
      }
    });

    res.json(updatedReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to review work report' });
  }
};
