import cron from 'node-cron';
import prisma from '../utils/prisma';
import { getIO } from '../socket';

export const startAttendanceJob = () => {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('[Cron] Running attendance lock check...');
    try {
      const companies = await prisma.company.findMany({
        where: { isActive: true }
      });

      for (const company of companies) {
        // 1. Get current time in company timezone
        const nowLocalStr = new Date().toLocaleString("en-US", { timeZone: company.timezone });
        const nowLocal = new Date(nowLocalStr);
        
        // 2. Check if today is a configured working day
        const dayOfWeek = new Intl.DateTimeFormat('en-US', { timeZone: company.timezone, weekday: 'short' }).format(new Date()).toUpperCase();
        const workingDays = company.workingDays as string[];
        
        if (!workingDays.includes(dayOfWeek)) {
          continue; // Not a working day for this company, skip
        }

        // 3. Check if current time is past workingHoursEnd
        const currentHour = nowLocal.getHours();
        const currentMinute = nowLocal.getMinutes();
        
        const endHour = company.workingHoursEnd.getUTCHours();
        const endMinute = company.workingHoursEnd.getUTCMinutes();

        const isPastEndTime = currentHour > endHour || (currentHour === endHour && currentMinute >= endMinute);
        
        if (!isPastEndTime) {
          continue; // Working hours have not ended yet, skip
        }

        // 4. Determine "Today" as a Date object for Prisma (UTC midnight representing the local date)
        const localDateStr = new Intl.DateTimeFormat('en-CA', { 
          timeZone: company.timezone, 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        }).format(new Date()); // format: YYYY-MM-DD
        
        const localToday = new Date(`${localDateStr}T00:00:00Z`);

        // 5. Find employees who have NOT checked in today
        const activeUsers = await prisma.user.findMany({
          where: { 
            companyId: company.id, 
            status: 'ACTIVE', 
            isDeleted: false 
          },
          select: { id: true, firstName: true, lastName: true }
        });

        if (activeUsers.length === 0) continue;

        const todaysAttendance = await prisma.attendance.findMany({
          where: { 
            companyId: company.id, 
            date: localToday 
          },
          select: { userId: true }
        });

        const attendedUserIds = new Set(todaysAttendance.map(a => a.userId));
        const missingUsers = activeUsers.filter(u => !attendedUserIds.has(u.id));

        if (missingUsers.length === 0) {
          continue; // Everyone checked in (or was already marked absent)
        }

        // Check who among missingUsers is on an approved leave today
        const todaysLeaves = await prisma.leaveRequest.findMany({
          where: {
            companyId: company.id,
            status: 'APPROVED',
            startDate: { lte: localToday },
            endDate: { gte: localToday }
          },
          select: { userId: true }
        });

        const usersOnLeave = new Set(todaysLeaves.map(l => l.userId));

        console.log(`[Cron] Company ${company.name}: Locking attendance for ${missingUsers.length} missing employees (${usersOnLeave.size} on leave).`);

        // 6. Mark missing users as ABSENT or ON_LEAVE
        const createData = missingUsers.map(u => {
          const isOnLeave = usersOnLeave.has(u.id);
          return {
            companyId: company.id,
            userId: u.id,
            date: localToday,
            status: isOnLeave ? 'ON_LEAVE' : 'ABSENT',
            notes: isOnLeave ? 'System auto-locked (On approved leave)' : 'System auto-locked (No show)',
          };
        });

        await prisma.attendance.createMany({ data: createData });

        // 7. Notify HR and Company Admins
        const hrUsers = await prisma.user.findMany({
          where: {
            companyId: company.id,
            userRoles: { 
              some: { role: { name: { in: ['HR', 'COMPANY_ADMIN'] } } } 
            },
            status: 'ACTIVE',
            isDeleted: false
          }
        });

        if (hrUsers.length > 0) {
          const notifications = hrUsers.map(hr => ({
            companyId: company.id,
            userId: hr.id,
            type: 'SYSTEM',
            title: 'Attendance Auto-Locked',
            body: `${missingUsers.length} employees did not check in today. Their attendance has been automatically marked as Absent.`,
          }));

          await prisma.notification.createMany({ data: notifications });

          // Emit real-time notification event via Socket.io
          try {
            const io = getIO();
            hrUsers.forEach(hr => {
              io.to(`user_${hr.id}`).emit('new_notification');
            });
          } catch (ioErr) {
            console.error('[Cron] Failed to emit socket notification:', ioErr);
          }
        }
      }
    } catch (err) {
      console.error('[Cron] Error in attendance lock job:', err);
    }
  });
  
  console.log('[Cron] Attendance job scheduled.');
};
