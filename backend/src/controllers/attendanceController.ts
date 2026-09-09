import { Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import prisma from '../utils/prisma';

export const getAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { userId: reqUserId, date } = req.query;
    const { companyId, userId: tokenUserId, role } = req.user!;
    
    const whereClause: any = { companyId };
    
    if (role === 'EMPLOYEE' || role === 'MANAGER') {
      // By default, employees/managers only see their own attendance here unless they specify their subordinate's ID
      // (For a real system, you'd check if reqUserId is a subordinate of tokenUserId. For now, we restrict to their own)
      whereClause.userId = tokenUserId;
    } else {
      if (reqUserId) whereClause.userId = String(reqUserId);
    }
    
    if (date) whereClause.date = new Date(String(date));

    const attendance = await prisma.attendance.findMany({
      where: whereClause,
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { date: 'desc' }
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching attendance' });
  }
};

export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const { date, time } = req.body;
    const { companyId, userId } = req.user!;
    const attendanceDate = new Date(date);
    
    // Check if already checked in today
    const existing = await prisma.attendance.findFirst({
      where: { userId, date: attendanceDate }
    });
    
    if (existing) return res.status(400).json({ error: 'Already checked in today' });

    const attendance = await prisma.attendance.create({
      data: {
        companyId,
        userId,
        date: attendanceDate,
        checkInAt: new Date(time),
        status: 'PRESENT'
      }
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Server error during check-in' });
  }
};

export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params['id'] as string;
    const { time, notes } = req.body;
    const { companyId, userId } = req.user!;
    
    const attendance = await prisma.attendance.findUnique({ where: { id } });
    if (!attendance) return res.status(404).json({ error: 'Attendance record not found' });
    if (attendance.userId !== userId || attendance.companyId !== companyId) {
       return res.status(403).json({ error: 'Unauthorized' });
    }
    if (attendance.checkOutAt) {
       return res.status(400).json({ error: 'Already checked out' });
    }
    
    const checkOutTime = new Date(time);
    const totalMinutes = attendance.checkInAt ? Math.floor((checkOutTime.getTime() - attendance.checkInAt.getTime()) / 60000) : 0;

    const updated = await prisma.attendance.update({
      where: { id },
      data: {
        checkOutAt: checkOutTime,
        totalMinutes,
        notes
      }
    });

    if (req.file) {
      await prisma.file.create({
        data: {
          companyId,
          uploadedById: userId,
          resourceType: 'ATTENDANCE',
          resourceId: id,
          originalName: req.file.originalname,
          storedName: req.file.filename,
          filePath: req.file.path,
          mimeType: req.file.mimetype,
          sizeBytes: BigInt(req.file.size)
        }
      });
    }

    // NEW: If the user had activity logs today, notify HR/Managers that they checked out
    const hasLogs = await prisma.activityLog.findFirst({
      where: { userId, recordedAt: { gte: attendance.date } }
    });

    if (hasLogs) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { firstName: true, lastName: true } });
      const managersAndHR = await prisma.user.findMany({
        where: { 
          companyId, 
          userRoles: { some: { role: { name: { in: ['HR', 'COMPANY_ADMIN', 'MANAGER'] } } } }
        }
      });
      
      const notifications = managersAndHR.map(m => ({
        companyId,
        userId: m.id,
        title: 'Employee Checked Out',
        message: `${user?.firstName} ${user?.lastName} has checked out. Their desktop activity tracking for the day has ended.`,
        type: 'SYSTEM',
      }));
      
      if (notifications.length > 0) {
        await prisma.notification.createMany({ data: notifications });
      }
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error during check-out' });
  }
};
