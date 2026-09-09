import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Layout from './pages/Layout';
import DashboardHome from './pages/DashboardHome';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Attendance from './pages/Attendance';
import WFH from './pages/WFH';
import Notifications from './pages/Notifications';
import Chat from './pages/Chat';
import Meetings from './pages/Meetings';
import Goals from './pages/Goals';
import Employees from './pages/Employees';
import Profile from './pages/Profile';
import SuperAdminPanel from './pages/SuperAdminPanel';
import Teams from './pages/Teams';
import Settings from './pages/Settings';
import Documents from './pages/Documents';
import Leaves from './pages/Leaves';
import Reports from './pages/Reports';
import Performance from './pages/Performance';
import Timesheets from './pages/Timesheets';
import Payroll from './pages/Payroll';
import Expenses from './pages/Expenses';
import Assets from './pages/Assets';
import Onboarding from './pages/Onboarding';
import Offboarding from './pages/Offboarding';
import ActivityMonitor from './pages/ActivityMonitor';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const isDesktop = !!(window as any).ipcRenderer;
  return isAuthenticated ? <>{children}</> : <Navigate to={isDesktop ? "/login" : "/home"} />;
};

function App() {
  return (
    <Routes>
      <Route path="/home" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        } 
      >
        <Route index element={<DashboardHome />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="wfh" element={<WFH />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="chat" element={<Chat />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="goals" element={<Goals />} />
        <Route path="teams" element={<Teams />} />
        <Route path="employees" element={<Employees />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin" element={<SuperAdminPanel />} />
        <Route path="documents" element={<Documents />} />
        <Route path="leaves" element={<Leaves />} />
        <Route path="reports" element={<Reports />} />
        <Route path="performance" element={<Performance />} />
        <Route path="timesheets" element={<Timesheets />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="assets" element={<Assets />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="offboarding" element={<Offboarding />} />
        <Route path="activity-monitor" element={<ActivityMonitor />} />
      </Route>
    </Routes>
  );
}

export default App;
