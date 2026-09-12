import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, MessageSquare, AlertTriangle, FileText, Briefcase, ClipboardList, Home, UserCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/notifications`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await axios.patch(`${API_URL}/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.post(`${API_URL}/notifications/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'TASK': return { icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' };
      case 'PROJECT': return { icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/30' };
      case 'LEAVE': return { icon: UserCheck, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30' };
      case 'WFH': return { icon: Home, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30' };
      case 'APPROVAL': return { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-50 dark:bg-green-900/30' };
      case 'COMMENT': return { icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/30' };
      case 'ALERT': return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30' };
      default: return { icon: FileText, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' };
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const filters = ['ALL', 'TASK', 'PROJECT', 'LEAVE', 'WFH', 'ALERT'];
  const filtered = filter === 'ALL' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="relative">
              <Bell className="text-yellow-500" size={32} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            Notifications
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You\'re all caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchNotifications}
            className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              Mark all as read
            </button>
          )}
        </div>
      </header>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
          >
            {f === 'ALL' ? `All (${notifications.length})` : f}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-5 flex gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-500 dark:text-slate-400">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No notifications here</p>
            <p className="text-sm mt-1">You're all caught up for this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence>
              {filtered.map((notif, i) => {
                const { icon: Icon, color, bg } = getIcon(notif.type);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    key={notif.id}
                    onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                    className={`p-5 flex gap-4 transition-colors cursor-pointer group ${
                      !notif.isRead
                        ? 'bg-blue-50/60 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                      <Icon className={color} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h4 className={`font-semibold text-sm truncate ${
                          !notif.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {notif.title}
                        </h4>
                        <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">{formatTime(notif.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{notif.body}</p>
                    </div>
                    <div className="flex items-center">
                      {!notif.isRead ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 shrink-0" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full opacity-0" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;


