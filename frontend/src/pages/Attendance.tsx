import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, Play, Square, X, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useActivity } from '../contexts/ActivityContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Attendance = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [workNotes, setWorkNotes] = useState('');

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API_URL}/attendance`);
      setAttendanceRecords(res.data);
      
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = res.data.find((r: any) => new Date(r.date).toISOString().split('T')[0] === today);
      setCurrentRecord(todayRecord || null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    try {
      const res = await axios.post(`${API_URL}/attendance/checkin`, {
        date: new Date().toISOString(),
        time: new Date().toISOString()
      });
      setCurrentRecord(res.data);
      fetchAttendance();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to check in');
    }
  };

  const { activeSeconds, idleSeconds, resetTracker } = useActivity();

  const handleCheckOutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRecord) return;
    
    const activeH = Math.floor(activeSeconds / 3600);
    const activeM = Math.floor((activeSeconds % 3600) / 60);
    const idleH = Math.floor(idleSeconds / 3600);
    const idleM = Math.floor((idleSeconds % 3600) / 60);
    
    const systemLog = `\n\n[System Log: App Active for ${activeH}h ${activeM}m, Idle for ${idleH}h ${idleM}m]`;
    
    try {
      await axios.patch(`${API_URL}/attendance/${currentRecord.id}/checkout`, {
        time: new Date().toISOString(),
        notes: workNotes + systemLog
      });
      setIsCheckOutModalOpen(false);
      setWorkNotes('');
      resetTracker();
      fetchAttendance();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to check out');
    }
  };
  
  const isCheckedIn = currentRecord && !currentRecord.checkOutAt;
  const isCheckedOut = currentRecord && currentRecord.checkOutAt;

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
            <Clock className="text-blue-500" size={32} />
            Attendance
          </h2>
          <p className="text-slate-500 mt-1">Track your daily working hours and submit your work log.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Check In/Out Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm border border-slate-200 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden h-full"
        >
          {isCheckedIn && <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />}
          
          <div className="text-5xl font-mono font-bold text-slate-900 mb-2 z-10">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-slate-500 mb-8 z-10 flex items-center gap-2">
            <Calendar size={16} />
            {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          {!isCheckedOut ? (
            <button
              onClick={() => isCheckedIn ? setIsCheckOutModalOpen(true) : handleCheckIn()}
              className={`z-10 flex items-center gap-3 px-12 py-4 rounded-full font-bold text-xl transition-all shadow-xl hover:scale-105 ${
                isCheckedIn 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30'
              }`}
            >
              {isCheckedIn ? (
                <><Square size={24} fill="currentColor" /> Check Out</>
              ) : (
                <><Play size={24} fill="currentColor" /> Check In</>
              )}
            </button>
          ) : (
             <div className="z-10 flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg bg-green-100 text-green-700">
                <CheckCircle2 size={24} /> Shift Completed
             </div>
          )}
          
          {isCheckedIn && (
            <p className="mt-6 text-blue-600 font-medium z-10 bg-blue-50 px-4 py-2 rounded-full text-sm">
              You are currently clocked in.
            </p>
          )}
        </motion.div>

        {/* Recent History */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-6 backdrop-blur-md">
          <h3 className="text-xl font-bold mb-4 text-slate-900">Recent Logs</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {attendanceRecords.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No recent attendance records.</p>
            ) : (
              attendanceRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="flex flex-col p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.checkOutAt ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {record.checkOutAt ? <CheckCircle2 size={20} /> : <Play size={20} />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{new Date(record.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(record.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                          {record.checkOutAt ? new Date(record.checkOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ' Now'}
                        </p>
                      </div>
                    </div>
                    {record.totalMinutes !== null && (
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{formatDuration(record.totalMinutes)}</p>
                        <p className="text-xs text-slate-400">Total</p>
                      </div>
                    )}
                  </div>
                  {record.notes && (
                    <div className="mt-2 text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                      <span className="font-semibold block mb-1">Work Log:</span>
                      {record.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isCheckOutModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                  <ClipboardList className="text-blue-500" size={24} /> 
                  Submit Work Log
                </h3>
                <button onClick={() => setIsCheckOutModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleCheckOutSubmit} className="p-6">
                <p className="text-sm text-slate-500 mb-4">
                  Before you check out, please log the work you completed during this session. This will be saved to your attendance record.
                </p>
                <div>
                  <textarea 
                    required 
                    rows={5} 
                    placeholder="e.g., Finished the landing page design, fixed 2 bugs in the backend API, and had a sync with the marketing team."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    value={workNotes} onChange={e => setWorkNotes(e.target.value)} 
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => setIsCheckOutModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20"
                  >
                    <Square fill="currentColor" size={18} /> Check Out Now
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Attendance;
