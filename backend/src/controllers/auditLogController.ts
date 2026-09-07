import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.query;
    const logs = await prisma.auditLog.findMany({
      where: { companyId: String(companyId) },
      include: { actor: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching audit logs' });
  }
};
