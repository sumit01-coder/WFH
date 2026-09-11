import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import { canModifyUser } from '../utils/rbac';
import prisma from '../utils/prisma';

export const createLeaveRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId } = req.user!;
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        companyId,
        userId,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason
      },
      include: {
        user: { select: { firstName: true, lastName: true, managerId: true } }
      }
    });

    // Notify HR and the employee's manager
    const hrAndManagers = await prisma.user.findMany({
      where: {
        companyId,
        isDeleted: false,
        OR: [
          { userRoles: { some: { role: { name: { in: ['HR', 'COMPANY_ADMIN'] } } } } },
          { id: leaveRequest.user.managerId || '' }
        ]
      },
      select: { id: true }
    });

    const applicantName = `${leaveRequest.user.firstName} ${leaveRequest.user.lastName}`;
    await prisma.notification.createMany({
      data: hrAndManagers
        .filter(u => u.id !== userId)
        .map(u => ({
          companyId,
          userId: u.id,
          type: 'LEAVE',
          title: 'New Leave Request',
          body: `${applicantName} has submitted a ${leaveType} leave request.`,
          resourceType: 'LEAVE',
          resourceId: leaveRequest.id
        }))
    });

    res.status(201).json(leaveRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating leave request' });
  }
};

export const getLeaveRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId, role } = req.user!;
    const { date, status } = req.query;
    
    let whereClause: any = { companyId };
    
    if (date) {
      const d = new Date(String(date));
      const startOfDay = new Date(d.setUTCHours(0, 0, 0, 0));
      whereClause.startDate = { lte: startOfDay };
      whereClause.endDate = { gte: startOfDay };
    }

    if (status) {
      whereClause.status = status;
    }

    // If not a manager/HR/admin, only show their own leaves
    if (!['HR', 'MANAGER', 'COMPANY_ADMIN', 'SUPER_ADMIN'].includes(role)) {
      whereClause.userId = userId;
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: whereClause,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        reviewedBy: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(leaveRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching leave requests' });
  }
};

export const updateLeaveStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reviewRemarks } = req.body;
    const { companyId, userId } = req.user!;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const leaveRequest = await prisma.leaveRequest.findFirst({
      where: { id, companyId }
    });

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    const canAssign = await canModifyUser(req.user!.role, leaveRequest.userId, false);
    if (!canAssign) {
      return res.status(403).json({ error: 'You do not have permission to approve/reject leaves for this user.' });
    }

    const updatedLeave = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status,
        reviewRemarks,
        reviewedById: userId,
        reviewedAt: new Date()
      },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        reviewedBy: { select: { firstName: true, lastName: true } }
      }
    });

    if (status === 'APPROVED') {
      const days = Math.ceil((new Date(updatedLeave.endDate).getTime() - new Date(updatedLeave.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      const balance = await prisma.leaveBalance.findUnique({
        where: { userId_leaveType: { userId: updatedLeave.userId, leaveType: updatedLeave.leaveType } }
      });
      
      if (balance) {
        await prisma.leaveBalance.update({
          where: { id: balance.id },
          data: { usedDays: balance.usedDays + days }
        });
      } else {
        await prisma.leaveBalance.create({
          data: {
            companyId: updatedLeave.companyId,
            userId: updatedLeave.userId,
            leaveType: updatedLeave.leaveType,
            totalDays: 15,
            usedDays: days
          }
        });
      }
    }

    // Notify the employee about the decision
    await prisma.notification.create({
      data: {
        companyId,
        userId: updatedLeave.userId,
        type: 'LEAVE',
        title: `Leave Request ${status === 'APPROVED' ? 'Approved ✅' : 'Rejected ❌'}`,
        body: `Your ${updatedLeave.leaveType} leave request has been ${status.toLowerCase()}.${
          reviewRemarks ? ` Remarks: ${reviewRemarks}` : ''
        }`,
        resourceType: 'LEAVE',
        resourceId: updatedLeave.id
      }
    });

    res.json(updatedLeave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating leave request' });
  }
};

export const getLeaveBalances = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.user!;
    const targetUserId = (req.query.userId as string) || userId;

    if (targetUserId !== userId) {
      if (!['HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(role)) {
        return res.status(403).json({ error: 'You do not have permission to view this user\'s leave balances.' });
      }
    }

    const balances = await prisma.leaveBalance.findMany({
      where: { userId: targetUserId }
    });
    
    // If no balances exist, return defaults
    if (balances.length === 0) {
      return res.json([
        { leaveType: 'VACATION', totalDays: 15, usedDays: 0 },
        { leaveType: 'SICK', totalDays: 10, usedDays: 0 },
        { leaveType: 'PERSONAL', totalDays: 5, usedDays: 0 }
      ]);
    }
    
    res.json(balances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch leave balances' });
  }
};

export const updateLeaveBalance = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    const { userId, leaveType, totalDays, usedDays } = req.body;

    if (!userId || !leaveType || totalDays === undefined || usedDays === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const balance = await prisma.leaveBalance.upsert({
      where: {
        userId_leaveType: {
          userId,
          leaveType
        }
      },
      update: {
        totalDays: Number(totalDays),
        usedDays: Number(usedDays)
      },
      create: {
        userId,
        companyId,
        leaveType,
        totalDays: Number(totalDays),
        usedDays: Number(usedDays)
      }
    });

    res.json(balance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating leave balance' });
  }
};

export const updateBulkLeaveBalances = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    const { leaveType, totalDays, resetUsedDays } = req.body;

    if (!leaveType || totalDays === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get all users in the company
    const users = await prisma.user.findMany({
      where: { companyId },
      select: { id: true }
    });

    // We can't do updateMany for upserts easily in Prisma if records don't exist,
    // so we iterate or use a transaction.
    const upsertPromises = users.map(u => {
      const updateData: any = { totalDays: Number(totalDays) };
      if (resetUsedDays) {
        updateData.usedDays = 0;
      }

      return prisma.leaveBalance.upsert({
        where: {
          userId_leaveType: {
            userId: u.id,
            leaveType
          }
        },
        update: updateData,
        create: {
          userId: u.id,
          companyId,
          leaveType,
          totalDays: Number(totalDays),
          usedDays: 0
        }
      });
    });

    await prisma.$transaction(upsertPromises);

    res.json({ success: true, message: `Updated ${leaveType} balance for ${users.length} employees.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error bulk updating leave balances' });
  }
};
