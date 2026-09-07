import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';

export const getWfhRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const { userId, companyId, role } = req.user!;

    let whereClause: any = { companyId };
    
    if (status) whereClause.status = String(status);

    if (role === 'EMPLOYEE') {
      // Employees see only their own
      whereClause.userId = userId;
    } else if (role === 'MANAGER') {
      // Managers see their own AND their subordinates
      const subordinates = await prisma.user.findMany({
        where: { managerId: userId },
        select: { id: true }
      });
      const subIds = subordinates.map(s => s.id);
      whereClause.userId = { in: [userId, ...subIds] };
    }
    // HR, COMPANY_ADMIN, SUPER_ADMIN see everyone in the company (whereClause.companyId is enough)

    const requests = await prisma.wfhRequest.findMany({
      where: whereClause,
      include: { 
        user: { select: { firstName: true, lastName: true, email: true } },
        reviewedBy: { select: { firstName: true, lastName: true } }
      },
      orderBy: { date: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching WFH requests' });
  }
};

export const createWfhRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { date, reason } = req.body;
    const { userId, companyId } = req.user!;
    const requestDate = new Date(date);

    const existing = await prisma.wfhRequest.findUnique({
      where: { userId_date: { userId, date: requestDate } }
    });

    if (existing) return res.status(400).json({ error: 'WFH request already exists for this date' });

    const wfhRequest = await prisma.wfhRequest.create({
      data: { companyId, userId, date: requestDate, reason, status: 'PENDING' }
    });
    res.status(201).json(wfhRequest);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating WFH request' });
  }
};

export const updateWfhStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const { status, reviewRemarks } = req.body;
    const { userId, role } = req.user!;

    // Check if user is allowed to approve
    if (role === 'EMPLOYEE' || role === 'MANAGER') {
      return res.status(403).json({ error: 'You are not authorized to review WFH requests. Only HR can approve or decline.' });
    }

    const request = await prisma.wfhRequest.findUnique({ where: { id }, include: { user: true } });
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const updated = await prisma.wfhRequest.update({
      where: { id },
      data: {
        status,
        reviewedById: userId,
        reviewRemarks,
        reviewedAt: new Date()
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating WFH status' });
  }
};
