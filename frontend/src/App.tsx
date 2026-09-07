import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
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
        <Route path="employees" element={<Employees />} />
        <Route path="profile" element={<Profile />} />
        <Route path="admin" element={<SuperAdminPanel />} />
      </Route>
    </Routes>
  );
}

export default App;
