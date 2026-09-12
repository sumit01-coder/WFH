import dotenv from 'dotenv';
dotenv.config(); // Must be called FIRST before any other imports read process.env

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import companyRoutes from './routes/companyRoutes';
import employeeRoutes from './routes/employeeRoutes';
import departmentRoutes from './routes/departmentRoutes';
import teamRoutes from './routes/teamRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import wfhRoutes from './routes/wfhRoutes';
import workReportRoutes from './routes/workReportRoutes';
import notificationRoutes from './routes/notificationRoutes';
import auditLogRoutes from './routes/auditLogRoutes';
import chatRoutes from './routes/chatRoutes';
import meetingRoutes from './routes/meetingRoutes';
import goalRoutes from './routes/goalRoutes';
import userManagementRoutes from './routes/userManagementRoutes';
import documentRoutes from './routes/documentRoutes';
import leaveRoutes from './routes/leaveRoutes';
import reportRoutes from './routes/reportRoutes';
import performanceRoutes from './routes/performanceRoutes';
import timesheetRoutes from './routes/timesheetRoutes';
import payrollRoutes from './routes/payrollRoutes';
import expenseRoutes from './routes/expenseRoutes';
import assetRoutes from './routes/assetRoutes';
import onboardingRoutes from './routes/onboardingRoutes';
import offboardingRoutes from './routes/offboardingRoutes';
import monitorRoutes from './routes/monitorRoutes';
import integrationRoutes from './routes/integrationRoutes';
import hiringRoutes from './routes/hiringRoutes';
import publicRoutes from './routes/publicRoutes';

import { createServer } from 'http';
import { initSocket } from './socket';
import prisma from './utils/prisma';
import { startAttendanceJob } from './jobs/attendanceJob';

const app = express();
const PORT = process.env.PORT || 5000;
const server = createServer(app);

// Trust reverse proxy (required for Hostinger/production deployments)
// This allows express-rate-limit to correctly read X-Forwarded-For headers
app.set('trust proxy', 1);


import path from 'path';

// Initialize Socket.io
initSocket(server);

// Start background jobs
startAttendanceJob();

// Security: fail fast if JWT secrets are missing in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'secret') {
    throw new Error('FATAL: JWT_SECRET environment variable is not set or uses insecure default!');
  }
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === 'refresh_secret') {
    throw new Error('FATAL: JWT_REFRESH_SECRET environment variable is not set or uses insecure default!');
  }
}

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 login/register attempts per 15 min per IP
  message: { error: 'Too many requests from this IP, please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // max 300 general API requests per minute per IP
  message: { error: 'Too many requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Allow serving uploaded files
}));

// CORS
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '2mb' })); // Limit request body size

// Serve uploads directory
app.use('/api-uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authLimiter, authRoutes); // Rate-limited auth routes
app.use('/api', apiLimiter); // General rate limit on all /api routes
app.use('/api/company', companyRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/wfh', wfhRoutes);
app.use('/api/work-reports', workReportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/users', userManagementRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/payrolls', payrollRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/offboarding', offboardingRoutes);
app.use('/api/monitor', monitorRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/hiring', hiringRoutes);
app.use('/api/public', publicRoutes); // Public routes (no auth required)


app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'WorkNexus API is running' });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Setup Daily Cleanup Job for Activity Monitor Data (Runs every 24 hours)
  setInterval(async () => {
    try {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const deletedLogs = await prisma.activityLog.deleteMany({
        where: { recordedAt: { lt: twoWeeksAgo } }
      });
      const deletedScreenshots = await prisma.desktopScreenshot.deleteMany({
        where: { takenAt: { lt: twoWeeksAgo } }
      });

      if (deletedLogs.count > 0 || deletedScreenshots.count > 0) {
        console.log(`[Cleanup] Deleted ${deletedLogs.count} old activity logs and ${deletedScreenshots.count} old screenshots.`);
      }
    } catch (err) {
      console.error('[Cleanup] Error deleting old monitor data:', err);
    }
  }, 24 * 60 * 60 * 1000);
});
