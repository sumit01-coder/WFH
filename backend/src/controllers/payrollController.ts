import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';

export const getPayrolls = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId, role } = req.user!;
    
    let whereClause: any = { companyId };
    if (!['HR', 'COMPANY_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      whereClause.userId = userId;
    }

    const payrolls = await prisma.payroll.findMany({
      where: whereClause,
      include: {
        user: { select: { firstName: true, lastName: true, email: true, designation: true, department: true } }
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }]
    });

    res.json(payrolls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payroll records' });
  }
};

export const generatePayroll = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    const { employeeId, month, year, basicSalary, bonuses, deductions } = req.body;

    if (!employeeId || !month || !year || !basicSalary) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const netPay = Number(basicSalary) + Number(bonuses || 0) - Number(deductions || 0);

    const payroll = await prisma.payroll.create({
      data: {
        companyId,
        userId: employeeId,
        month: Number(month),
        year: Number(year),
        basicSalary: Number(basicSalary),
        bonuses: Number(bonuses || 0),
        deductions: Number(deductions || 0),
        netPay,
        status: 'GENERATED'
      },
      include: {
        user: { select: { firstName: true, lastName: true } }
      }
    });

    res.status(201).json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate payroll' });
  }
};

export const markPayrollPaid = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user!;

    const payroll = await prisma.payroll.update({
      where: { id, companyId },
      data: { status: 'PAID' }
    });

    res.json(payroll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark payroll as paid' });
  }
};
