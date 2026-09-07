import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, MessageSquare, AlertTriangle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setNotifications([
      { id: '1', title: 'New Task Assigned', body: 'You have been assigned to "Design Landing Page".', type: 'TASK', isRead: false, time: '10 mins ago' },
      { id: '2', title: 'WFH Request Approved', body: 'Your request for Sep 12 has been approved.', type: 'APPROVAL', isRead: false, time: '1 hour ago' },
      { id: '3', title: 'Project Deadline Approaching', body: 'Mobile App Launch is due in 3 days.', type: 'ALERT', isRead: true, time: 'Yesterday' },
      { id: '4', title: 'New Comment', body: 'John left a comment on your task.', type: 'COMMENT', isRead: true, time: 'Yesterday' },
    ]);
  }, []);

  const getIcon = (type: string) => {
    switch(type) {
      case 'TASK': return <CheckCircle2 className="text-blue-400" size={20} />;
      case 'APPROVAL': return <CheckCircle2 className="text-green-400" size={20} />;
      case 'ALERT': return <AlertTriangle className="text-orange-400" size={20} />;
      case 'COMMENT': return <MessageSquare className="text-purple-400" size={20} />;
      default: return <FileText className="text-slate-500" size={20} />;
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="text-yellow-500" size={32} />
            Notifications
          </h2>
          <p className="text-slate-500 mt-1">Stay updated with your latest alerts.</p>
        </div>
        <button onClick={markAllRead} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
          Mark all as read
        </button>
      </header>

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="divide-y divide-white/5">
          {notifications.map((notif, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              key={notif.id} 
              className={`p-5 flex gap-4 hover:bg-white shadow-sm transition-colors cursor-pointer ${!notif.isRead ? 'bg-blue-500/5' : ''}`}
            >
              <div className="mt-1">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-semibold ${!notif.isRead ? 'text-slate-900' : 'text-slate-600'}`}>{notif.title}</h4>
                  <span className="text-xs text-slate-400">{notif.time}</span>
                </div>
                <p className="text-sm text-slate-500">{notif.body}</p>
              </div>
              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shadow-md"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
