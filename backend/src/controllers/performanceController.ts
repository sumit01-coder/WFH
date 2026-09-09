import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';

export const getPerformanceRecords = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId, role } = req.user!;
    
    let whereClause: any = { companyId };
    
    // If regular employee, only show their own records
    if (!['HR', 'MANAGER', 'COMPANY_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      whereClause.userId = userId;
    }

    const records = await prisma.performanceRecord.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { periodStart: 'desc' }
    });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch performance records' });
  }
};

export const generatePerformanceRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    const { employeeId, period, periodStart, periodEnd } = req.body;

    // In a real system, this would query the Tasks, Attendance, and WorkReports tables to compute.
    // For now, we will generate a mock computed record for demonstration purposes.
    const start = new Date(periodStart);
    const end = new Date(periodEnd);

    const record = await prisma.performanceRecord.upsert({
      where: {
        userId_period_periodStart: {
          userId: employeeId,
          period,
          periodStart: start
        }
      },
      update: {
        periodEnd: end,
        tasksCompleted: Math.floor(Math.random() * 20) + 5,
        attendanceDays: 20,
        computedScore: Math.floor(Math.random() * 3) + 7 // 7 to 10
      },
      create: {
        companyId,
        userId: employeeId,
        period,
        periodStart: start,
        periodEnd: end,
        tasksCompleted: Math.floor(Math.random() * 20) + 5,
        attendanceDays: 20,
        computedScore: Math.floor(Math.random() * 3) + 7 // 7 to 10
      },
      include: {
        user: { select: { firstName: true, lastName: true } }
      }
    });

    res.status(201).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate performance record' });
  }
};
