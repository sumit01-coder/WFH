import React, { useState, useEffect } from 'react';
import { Calendar, Video, Clock, Users, Plus, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';

const Meetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const [meetingsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/meetings`),
        axios.get(`${API_URL}/users`)
      ]);
      setMeetings(meetingsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !startTime || !endTime) return;

    try {
      const startAt = new Date(`${date}T${startTime}`);
      const endAt = new Date(`${date}T${endTime}`);
      
      const payload = {
        title,
        location,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        participants: selectedParticipants
      };

      await axios.post(`${API_URL}/meetings`, payload);
      setIsModalOpen(false);
      // Reset form
      setTitle(''); setDate(''); setStartTime(''); setEndTime(''); setLocation(''); setSelectedParticipants([]);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to schedule meeting');
    }
  };

  const toggleParticipant = (userId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="text-blue-500" size={32} />
            Meetings
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Schedule and join upcoming meetings with your team.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white"
        >
          <Plus size={20} /> Schedule Meeting
        </button>
      </header>

      {meetings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No upcoming meetings</h3>
          <p className="text-slate-500 dark:text-slate-400">You don't have any scheduled meetings. Click "Schedule Meeting" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting, i) => {
            const isVideo = meeting.location?.toLowerCase().includes('http') || meeting.location?.toLowerCase().includes('zoom') || meeting.location?.toLowerCase().includes('meet');
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={meeting.id} 
                className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all hover:shadow-md group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">{meeting.title}</h3>
                  {isVideo ? <Video className="text-blue-400 shrink-0" size={24} /> : <Users className="text-purple-400 shrink-0" size={24} />}
                </div>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                    <Calendar size={18} className="text-slate-400" /> 
                    <span>{formatDate(meeting.startAt)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <Clock size={18} className="text-slate-400" /> 
                    <span>
                      {new Date(meeting.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(meeting.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <Users size={18} className="text-slate-400" /> 
                    <span>{meeting.participants?.length || 0} Attendees</span>
                  </div>
                  {meeting.location && (
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 line-clamp-1">
                      <MapPin size={18} className="text-slate-400 shrink-0" /> 
                      <span className="truncate">{meeting.location}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Organizer: <span className="font-medium text-slate-700 dark:text-slate-300">{meeting.organizer?.firstName}</span>
                  </div>
                  {isVideo ? (
                    <a href={meeting.location} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors">
                      Join Call
                    </a>
                  ) : (
                    <button className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors">
                      View Details
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="text-blue-500" size={24} /> Schedule Meeting
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:bg-slate-700"><X size={24}/></button>
              </div>
              
              <form onSubmit={handleSchedule} className="p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Meeting Title</label>
                    <input 
                      type="text" required autoFocus
                      value={title} onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Q3 Roadmap Planning"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date</label>
                      <input 
                        type="date" required min={new Date().toISOString().split('T')[0]}
                        value={date} onChange={e => setDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 dark:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Start Time</label>
                      <input 
                        type="time" required
                        value={startTime} onChange={e => setStartTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 dark:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">End Time</label>
                      <input 
                        type="time" required
                        value={endTime} onChange={e => setEndTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 dark:text-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location / Video Link</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={location} onChange={e => setLocation(e.target.value)}
                        placeholder="https://zoom.us/j/123456789 or Conference Room A"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                      <span>Invite Attendees</span>
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{selectedParticipants.length} selected</span>
                    </label>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 max-h-48 overflow-y-auto">
                      {users.filter(u => u.id !== user?.id).map(u => (
                        <label key={u.id} className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={selectedParticipants.includes(u.id)}
                            onChange={() => toggleParticipant(u.id)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{u.firstName} {u.lastName}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{u.role?.name}</span>
                          </div>
                        </label>
                      ))}
                      {users.length <= 1 && (
                        <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">No other employees found in the company.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">Schedule Meeting</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Meetings;
