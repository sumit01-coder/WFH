import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';

export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId, role } = req.user!;
    
    let whereClause: any = { companyId };
    if (!['HR', 'COMPANY_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      whereClause.userId = userId;
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

export const submitExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId } = req.user!;
    const { amount, category, description, receiptUrl } = req.body;

    if (!amount || !category || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expense = await prisma.expense.create({
      data: {
        companyId,
        userId,
        amount: Number(amount),
        category,
        description,
        receiptUrl,
        status: 'PENDING'
      },
      include: {
        user: { select: { firstName: true, lastName: true } }
      }
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit expense' });
  }
};

export const updateExpenseStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { companyId } = req.user!;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const expense = await prisma.expense.update({
      where: { id, companyId },
      data: { status }
    });

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update expense status' });
  }
};
