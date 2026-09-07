import React, { useState, useEffect } from 'react';
import { Calendar, Video, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Meetings = () => {
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    setMeetings([
      { id: '1', title: 'Weekly Sync', time: '10:00 AM - 11:00 AM', date: 'Today', attendees: 4, type: 'Video' },
      { id: '2', title: 'Design Review', time: '2:00 PM - 3:00 PM', date: 'Tomorrow', attendees: 3, type: 'In-person' },
    ]);
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="text-blue-500" size={32} />
            Meetings
          </h2>
          <p className="text-slate-500 mt-1">Schedule and join upcoming meetings.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white">
          Schedule Meeting
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meetings.map((meeting, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={meeting.id} 
            className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/30 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-300 transition-colors">{meeting.title}</h3>
              {meeting.type === 'Video' ? <Video className="text-blue-400" size={24} /> : <Users className="text-purple-400" size={24} />}
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-slate-500">
                <Calendar size={18} /> <span>{meeting.date}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Clock size={18} /> <span>{meeting.time}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Users size={18} /> <span>{meeting.attendees} Attendees</span>
              </div>
            </div>

            <button className="w-full py-2 rounded-xl bg-slate-100 hover:bg-blue-600 text-white font-medium transition-colors">
              {meeting.type === 'Video' ? 'Join Call' : 'View Details'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Meetings;
