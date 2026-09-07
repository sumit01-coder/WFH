import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getWorkReports = async (req: Request, res: Response) => {
  try {
    const { companyId, userId, date } = req.query;
    const whereClause: any = { companyId: String(companyId) };
    if (userId) whereClause.userId = String(userId);
    if (date) whereClause.date = new Date(String(date));

    const reports = await prisma.workReport.findMany({
      where: whereClause,
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { date: 'desc' }
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching work reports' });
  }
};

export const submitWorkReport = async (req: Request, res: Response) => {
  try {
    const { companyId, userId, date, completedWork, wip, blockers, tomorrowPlan, hoursWorked } = req.body;
    const reportDate = new Date(date);

    const report = await prisma.workReport.create({
      data: {
        companyId, userId, date: reportDate, completedWork, wip, blockers, tomorrowPlan, hoursWorked, status: 'SUBMITTED'
      }
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Server error submitting work report' });
  }
};
