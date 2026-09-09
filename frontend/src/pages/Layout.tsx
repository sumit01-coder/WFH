import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFeatures } from '../contexts/FeaturesContext';
import { 
  LogOut, LayoutDashboard, Users, FolderKanban, CheckSquare, Settings, Clock, Home, 
  Bell, MessageSquare, Calendar, Target, ChevronLeft, ChevronRight, UserCircle, 
  Globe, FileText, TrendingUp, DollarSign, CreditCard, Laptop, UserPlus, UserMinus,
  ChevronDown, ChevronUp, Briefcase, Monitor
} from 'lucide-react';
import { useNavigate, Outlet, Link, useLocation, NavLink } from 'react-router-dom';

const Layout = () => {
  const { user, logout, hasRole } = useAuth();
  const { features } = useFeatures();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(['Workspace', 'Projects & Tasks', 'HR & Operations', 'Finance & IT', 'Administration']);

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const navGroups = [
    {
      title: 'Workspace',
      icon: LayoutDashboard,
      show: true,
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, show: true },
        { name: 'Chat', path: '/chat', icon: MessageSquare, show: true },
        { name: 'Meetings', path: '/meetings', icon: Calendar, show: true },
        { name: 'Documents', path: '/documents', icon: FileText, show: true },
        { name: 'Notifications', path: '/notifications', icon: Bell, show: true },
        { name: 'Profile', path: '/profile', icon: UserCircle, show: true },
      ]
    },
    {
      title: 'Projects & Tasks',
      icon: FolderKanban,
      show: !hasRole('COMPANY_ADMIN', 'SUPER_ADMIN'),
      items: [
        { name: 'Projects', path: '/projects', icon: FolderKanban, show: true },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare, show: true },
        { name: 'Teams', path: '/teams', icon: Users, show: hasRole('HR', 'MANAGER') },
        { name: 'Goals', path: '/goals', icon: Target, show: true },
      ]
    },
    {
      title: 'HR & Operations',
      icon: Briefcase,
      show: !hasRole('SUPER_ADMIN'),
      items: [
        { name: 'Attendance', path: '/attendance', icon: Clock, show: !hasRole('COMPANY_ADMIN') },
        { name: 'Timesheets', path: '/timesheets', icon: Clock, show: !hasRole('COMPANY_ADMIN') },
        { name: 'Leaves', path: '/leaves', icon: Calendar, show: !hasRole('COMPANY_ADMIN') },
        { name: 'WFH', path: '/wfh', icon: Home, show: !hasRole('COMPANY_ADMIN') },
        { name: 'Reports', path: '/reports', icon: CheckSquare, show: true },
        { name: 'Performance', path: '/performance', icon: TrendingUp, show: hasRole('HR', 'MANAGER', 'COMPANY_ADMIN') },
      ]
    },
    {
      title: 'Finance & IT',
      icon: DollarSign,
      show: hasRole('HR', 'MANAGER', 'COMPANY_ADMIN') && (features.hasPayroll || features.hasExpenses || features.hasAssets),
      items: [
        { name: 'Payroll', path: '/payroll', icon: DollarSign, show: hasRole('HR', 'MANAGER', 'COMPANY_ADMIN') && features.hasPayroll },
        { name: 'Expenses', path: '/expenses', icon: CreditCard, show: hasRole('HR', 'MANAGER', 'COMPANY_ADMIN') && features.hasExpenses },
        { name: 'Assets', path: '/assets', icon: Laptop, show: hasRole('HR', 'COMPANY_ADMIN') && features.hasAssets },
      ]
    },
    {
      title: 'Administration',
      icon: Globe,
      show: hasRole('HR', 'SUPER_ADMIN', 'MANAGER', 'COMPANY_ADMIN'),
      items: [
        { name: 'Onboarding', path: '/onboarding', icon: UserPlus, show: hasRole('HR', 'COMPANY_ADMIN') && features.hasOnboarding },
        { name: 'Offboarding', path: '/offboarding', icon: UserMinus, show: hasRole('HR', 'COMPANY_ADMIN') && features.hasOffboarding },
        { name: 'Employees', path: '/employees', icon: Users, show: hasRole('HR', 'COMPANY_ADMIN') },
        { name: 'Admin Panel', path: '/admin', icon: Globe, show: hasRole('SUPER_ADMIN') },
        { name: 'Activity Monitor', path: '/activity-monitor', icon: Monitor, show: hasRole('HR', 'MANAGER', 'COMPANY_ADMIN') },
      ]
    }
  ];

  const toggleGroup = (title: string) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenGroups(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);
  };

  const getRoleBadgeColor = (role: string | undefined) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-700';
      case 'COMPANY_ADMIN': return 'bg-blue-100 text-blue-700';
      case 'HR': return 'bg-pink-100 text-pink-700';
      case 'MANAGER': return 'bg-orange-100 text-orange-700';
      case 'EMPLOYEE': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white dark:bg-slate-900 shadow-sm border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex transition-all duration-300 relative z-50 h-screen`}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-blue-600 rounded-full p-1 border border-slate-200 dark:border-slate-800 shadow-md text-white hover:bg-blue-500 z-50 transition-transform hover:scale-110"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className={`flex flex-col items-center gap-2 mt-4 mb-6 ${isCollapsed ? 'justify-center' : 'px-4'}`}>
          <img 
            src={user?.logoUrl ? `http://localhost:5000${user.logoUrl}` : "./logo.png"} 
            alt="Logo" 
            className="w-16 h-16 object-contain shrink-0 rounded-xl" 
          />
          {!isCollapsed && (
            <div className="flex flex-col items-center text-center max-w-full">
              <h1 className="text-lg font-bold tracking-tight truncate w-full px-2 text-slate-800 dark:text-white">
                {user?.companyName || (
                  <>WorkFlow<span className="text-blue-400">Pro</span></>
                )}
              </h1>
              {user?.companyName && (
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
                  Powered by WorkFlowPro
                </span>
              )}
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          {navGroups.map((group) => {
            const GroupIcon = group.icon;
            const visibleItems = group.items.filter(item => item.show);
            if (!group.show || visibleItems.length === 0) return null;
            const isOpen = openGroups.includes(group.title);
            const hasActiveItem = visibleItems.some(item => location.pathname === item.path);

            return (
              <div key={group.title} className="space-y-1">
                <button 
                  onClick={() => toggleGroup(group.title)}
                  title={isCollapsed ? group.title : undefined}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                    isCollapsed ? 'justify-center' : ''
                  } ${hasActiveItem && !isOpen ? 'text-blue-600 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  <div className="flex items-center gap-3">
                    <GroupIcon size={20} className={`shrink-0 ${hasActiveItem && !isOpen ? 'text-blue-500' : ''}`} />
                    {!isCollapsed && <span className="font-semibold text-xs tracking-wider uppercase">{group.title}</span>}
                  </div>
                  {!isCollapsed && (
                    isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>

                {(!isCollapsed && isOpen) && (
                  <div className="space-y-1 mt-1 border-l-2 border-slate-100 dark:border-slate-800 ml-5 pl-2">
                    {visibleItems.map(item => {
                      const isActive = location.pathname === item.path;
                      const Icon = item.icon;
                      return (
                        <Link 
                          key={item.name} 
                          to={item.path} 
                          className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
                            isActive 
                              ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 font-medium' 
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:bg-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <Icon size={18} className="shrink-0" />
                          <span className="font-medium whitespace-nowrap overflow-hidden">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className={`mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2 ${isCollapsed ? 'items-center' : ''}`}>
          <NavLink to="/settings" title={isCollapsed ? 'Settings' : undefined} className={({ isActive }) => `w-full flex items-center gap-3 py-3 rounded-xl transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:text-white hover:bg-white shadow-sm'}`}>
            <Settings size={20} className="shrink-0" />
            {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden">Settings</span>}
          </NavLink>
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
      <main className="flex-1 h-screen overflow-y-auto flex flex-col relative">
        <header className="sticky top-0 z-40 bg-white dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-3 flex justify-end items-center">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{user?.firstName} {user?.lastName}</p>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 uppercase ${getRoleBadgeColor(user?.role)}`}>
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 uppercase">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
          </div>
        </header>
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
