import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  Users, FolderKanban, CheckSquare, Building2, Clock,
  TrendingUp, Shield, UserPlus, CalendarCheck, BarChart3,
  Globe, CreditCard
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-slate-500 font-medium text-sm">{title}</h3>
      <span className={`p-2 rounded-lg ${color}`}><Icon size={18} /></span>
    </div>
    <p className="text-4xl font-bold text-slate-900">{value}</p>
  </motion.div>
);

const DashboardHome = () => {
  const { user, hasRole } = useAuth();

  const roleBadge: Record<string, { label: string; color: string }> = {
    SUPER_ADMIN:   { label: 'Super Admin',   color: 'bg-purple-100 text-purple-700' },
    COMPANY_ADMIN: { label: 'Company Admin', color: 'bg-blue-100 text-blue-700' },
    HR:            { label: 'HR Manager',    color: 'bg-pink-100 text-pink-700' },
    MANAGER:       { label: 'Manager',       color: 'bg-orange-100 text-orange-700' },
    EMPLOYEE:      { label: 'Employee',      color: 'bg-green-100 text-green-700' },
  };

  const badge = roleBadge[user?.role ?? 'EMPLOYEE'];

  const superAdminStats = [
    { title: 'Total Companies', value: 5, icon: Building2, color: 'bg-purple-50 text-purple-500' },
    { title: 'Total Users', value: 128, icon: Users, color: 'bg-blue-50 text-blue-500' },
    { title: 'Active Subscriptions', value: 4, icon: CreditCard, color: 'bg-green-50 text-green-500' },
    { title: 'Platform Uptime', value: '99.9%', icon: Globe, color: 'bg-teal-50 text-teal-500' },
  ];

  const companyAdminStats = [
    { title: 'Total Employees', value: 24, icon: Users, color: 'bg-blue-50 text-blue-500' },
    { title: 'Departments', value: 6, icon: Building2, color: 'bg-indigo-50 text-indigo-500' },
    { title: 'Active Projects', value: 8, icon: FolderKanban, color: 'bg-purple-50 text-purple-500' },
    { title: 'Pending Approvals', value: 3, icon: CheckSquare, color: 'bg-orange-50 text-orange-500' },
  ];

  const hrStats = [
    { title: 'Total Employees', value: 24, icon: Users, color: 'bg-blue-50 text-blue-500' },
    { title: 'New Joiners This Month', value: 2, icon: UserPlus, color: 'bg-green-50 text-green-500' },
    { title: 'Pending Leave Requests', value: 5, icon: CalendarCheck, color: 'bg-pink-50 text-pink-500' },
    { title: 'Attendance Rate', value: '92%', icon: TrendingUp, color: 'bg-teal-50 text-teal-500' },
  ];

  const managerStats = [
    { title: 'Team Members', value: 6, icon: Users, color: 'bg-blue-50 text-blue-500' },
    { title: 'Tasks This Week', value: 14, icon: CheckSquare, color: 'bg-purple-50 text-purple-500' },
    { title: 'Pending WFH Approvals', value: 2, icon: CalendarCheck, color: 'bg-orange-50 text-orange-500' },
    { title: 'Team Performance', value: '87%', icon: BarChart3, color: 'bg-green-50 text-green-500' },
  ];

  const employeeStats = [
    { title: 'My Tasks Today', value: 4, icon: CheckSquare, color: 'bg-blue-50 text-blue-500' },
    { title: 'Hours Worked Today', value: '6.5h', icon: Clock, color: 'bg-green-50 text-green-500' },
    { title: 'WFH This Month', value: '3/8', icon: CalendarCheck, color: 'bg-purple-50 text-purple-500' },
    { title: 'Tasks Completed', value: '87%', icon: TrendingUp, color: 'bg-orange-50 text-orange-500' },
  ];

  const statsMap: Record<string, typeof superAdminStats> = {
    SUPER_ADMIN:   superAdminStats,
    COMPANY_ADMIN: companyAdminStats,
    HR:            hrStats,
    MANAGER:       managerStats,
    EMPLOYEE:      employeeStats,
  };

  const currentStats = statsMap[user?.role ?? 'EMPLOYEE'] ?? employeeStats;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back, {user?.firstName}! 👋</h2>
          </div>
          <div className="flex items-center gap-3">
            {badge && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                <Shield size={11} /> {badge.label}
              </span>
            )}
            <p className="text-slate-500 text-sm">Here's what's happening today.</p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xl text-white shadow-lg">
          {user?.firstName?.charAt(0)}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {currentStats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Role-specific quick actions */}
      {hasRole('SUPER_ADMIN') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-1">Super Admin Panel</h3>
          <p className="text-purple-200 text-sm">You have full access to all companies and settings.</p>
        </motion.div>
      )}

      {hasRole('COMPANY_ADMIN') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-1">Company Administration</h3>
          <p className="text-blue-200 text-sm">Manage your company, departments, and HR team from the sidebar.</p>
        </motion.div>
      )}

      {hasRole('HR') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-1">HR Overview</h3>
          <p className="text-pink-100 text-sm">You have 5 pending leave requests and 2 new onboarding tasks.</p>
        </motion.div>
      )}

      {hasRole('MANAGER') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-1">Team Snapshot</h3>
          <p className="text-orange-100 text-sm">2 WFH approvals pending and your team has 14 tasks due this week.</p>
        </motion.div>
      )}

      {hasRole('EMPLOYEE') && !hasRole('MANAGER', 'HR', 'COMPANY_ADMIN', 'SUPER_ADMIN') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-1">Your Day</h3>
          <p className="text-green-100 text-sm">You have 4 tasks due today. Don't forget to submit your daily work report!</p>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardHome;
