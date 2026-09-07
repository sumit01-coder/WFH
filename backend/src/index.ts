import dotenv from 'dotenv';
dotenv.config(); // Must be called FIRST before any other imports read process.env

import express from 'express';
import cors from 'cors';
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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
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

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'WorkFlow Pro API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
