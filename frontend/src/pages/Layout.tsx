import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, Users, FolderKanban, CheckSquare, Settings, Clock, Home, Bell, MessageSquare, Calendar, Target, ChevronLeft, ChevronRight, UserCircle, Globe } from 'lucide-react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, show: true },
    { name: 'Notifications', path: '/notifications', icon: Bell, show: true },
    { name: 'Projects', path: '/projects', icon: FolderKanban, show: true },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare, show: true },
    { name: 'Chat', path: '/chat', icon: MessageSquare, show: true },
    { name: 'Meetings', path: '/meetings', icon: Calendar, show: true },
    { name: 'Goals', path: '/goals', icon: Target, show: true },
    { name: 'Attendance', path: '/attendance', icon: Clock, show: true },
    { name: 'WFH', path: '/wfh', icon: Home, show: true },
    { name: 'Employees', path: '/employees', icon: Users, show: hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN') },
    { name: 'Admin Panel', path: '/admin', icon: Globe, show: hasRole('SUPER_ADMIN') },
    { name: 'Profile', path: '/profile', icon: UserCircle, show: true },
  ].filter(item => item.show);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white shadow-sm border-r border-slate-200 p-4 flex flex-col hidden md:flex transition-all duration-300 relative z-20`}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-blue-600 rounded-full p-1 border border-slate-200 shadow-md text-white hover:bg-blue-500 z-50 transition-transform hover:scale-110"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className={`flex items-center gap-3 mb-10 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain shrink-0" />
          {!isCollapsed && <h1 className="text-xl font-bold tracking-tight whitespace-nowrap overflow-hidden">WorkFlow<span className="text-blue-400">Pro</span></h1>}
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 py-3 rounded-xl transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${
                  isActive 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white shadow-sm'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <div className={`mt-auto pt-6 border-t border-slate-200 flex flex-col gap-2 ${isCollapsed ? 'items-center' : ''}`}>
          <button title={isCollapsed ? 'Settings' : undefined} className={`w-full flex items-center gap-3 py-3 text-slate-500 hover:text-slate-900 hover:bg-white shadow-sm rounded-xl transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
            <Settings size={20} className="shrink-0" />
            {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden">Settings</span>}
          </button>
          <button 
            onClick={handleLogout}
            title={isCollapsed ? 'Logout' : undefined}
            className={`w-full flex items-center gap-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
