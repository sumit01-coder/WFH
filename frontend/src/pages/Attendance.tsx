import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, Play, Square, X, ClipboardList, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useActivity } from '../contexts/ActivityContext';

import AdminAttendanceDashboard from '../components/attendance/AdminAttendanceDashboard';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Attendance = () => {
  const { user, hasRole, token } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [workNotes, setWorkNotes] = useState('');
  const [worklogFile, setWorklogFile] = useState<File | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const isCheckedIn = currentRecord && !currentRecord.checkOutAt;
  const isCheckedOut = currentRecord && currentRecord.checkOutAt;
  const isAdmin = hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN');
  const activeBreak = currentRecord?.breaks?.find((b: any) => !b.breakEnd);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API_URL}/attendance`);
      setAttendanceRecords(res.data);
      
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = res.data.find((r: any) => 
        new Date(r.date).toISOString().split('T')[0] === today && r.userId === user?.id
      );
      setCurrentRecord(todayRecord || null);

      if (user?.companyId) {
        const companyRes = await axios.get(`${API_URL}/company/${user.companyId}`);
        setCompanyProfile(companyRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees`);
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
    if (hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN')) {
      fetchEmployees();
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Advanced Web Monitoring ---
  useEffect(() => {
    let stream: MediaStream | null = null;
    let captureInterval: NodeJS.Timeout | null = null;
    let monitoringSocket: any = null;

    const startMonitoring = async () => {
      if (!isCheckedIn || activeBreak || isAdmin) return;
      
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
          console.warn("Screen capture not supported in this browser.");
          return;
        }

        // 1. Request screen share
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: "monitor" }
        });

        // 2. Connect to socket
        import('socket.io-client').then(({ io }) => {
          monitoringSocket = io(API_URL.replace('/api', ''), {
            auth: { token: localStorage.getItem('token') }
          });

          let counter = 0;

          const captureAndEmit = () => {
            if (!stream) return;
            const videoTrack = stream.getVideoTracks()[0];
            if (!videoTrack || videoTrack.readyState === 'ended') return;

            const video = document.createElement('video');
            video.srcObject = new MediaStream([videoTrack]);
            video.play().then(() => {
              const canvas = document.createElement('canvas');
              canvas.width = 800;
              canvas.height = 450;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL('image/jpeg', 0.5);
                
                const currentScore = parseInt(localStorage.getItem('productivityScore') || '100', 10);
                
                monitoringSocket.emit('monitoring_update', {
                  screenshot: imageData,
                  productivityScore: currentScore,
                  timestamp: new Date().toISOString()
                });

                // Every 60 seconds, save to Database for Activity Monitor history
                if (counter % 6 === 0) {
                  // Save screenshot to DB
                  canvas.toBlob((blob) => {
                    if (blob) {
                      const fd = new FormData();
                      fd.append('screenshot', blob, 'screenshot.jpg');
                      axios.post(`${API_URL}/monitor/screenshot`, fd, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                      }).catch(console.error);
                    }
                  }, 'image/jpeg', 0.5);

                  // Save activity log to DB
                  axios.post(`${API_URL}/monitor/activity`, {
                    logs: [{
                      appName: 'Web Browser',
                      windowTitle: document.title,
                      durationSec: 60,
                      isIdle: currentScore < 50, // rough heuristic
                      recordedAt: new Date().toISOString()
                    }]
                  }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                  }).catch(console.error);
                }
                
                counter++;
              }
              video.pause();
              video.srcObject = null;
            }).catch(err => console.error("Video play error", err));
          };

          // 3. Send first frame immediately
          captureAndEmit();

          // 4. Setup periodic capture (every 10 seconds for more real-time feel, or 60s)
          captureInterval = setInterval(captureAndEmit, 10000);
        });

      } catch (err) {
        console.warn("Screen monitoring permission denied or failed:", err);
      }
    };

    startMonitoring();

    return () => {
      if (captureInterval) clearInterval(captureInterval);
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (monitoringSocket) monitoringSocket.disconnect();
    };
  }, [isCheckedIn, activeBreak, isAdmin]);

  const handleCheckIn = async () => {
    try {
      const res = await axios.post(`${API_URL}/attendance/checkin`, {
        date: new Date().toISOString(),
        time: new Date().toISOString()
      });
      setCurrentRecord(res.data);
      
      // Start desktop monitoring if inside Electron app
      if ((window as any).desktopMonitor && token) {
        (window as any).desktopMonitor.start(token);
      }
      
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
      const formData = new FormData();
      formData.append('time', new Date().toISOString());
      formData.append('notes', workNotes + systemLog);
      if (worklogFile) {
        formData.append('worklog_attachment', worklogFile);
      }

      await axios.patch(`${API_URL}/attendance/${currentRecord.id}/checkout`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Stop desktop monitoring
      if ((window as any).desktopMonitor) {
        (window as any).desktopMonitor.stop();
      }

      setIsCheckOutModalOpen(false);
      setWorkNotes('');
      setWorklogFile(null);
      resetTracker();
      fetchAttendance();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to check out');
    }
  };

  const handleTakeBreak = async () => {
    if (!currentRecord?.id) return;
    try {
      await axios.post(`${API_URL}/attendance/${currentRecord.id}/break/start`);
      // Pause desktop activity monitor
      if ((window as any).desktopMonitor) {
        (window as any).desktopMonitor.pause();
      }
      fetchAttendance();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to start break');
    }
  };

  const handleEndBreak = async () => {
    if (!activeBreak?.id) return;
    try {
      await axios.patch(`${API_URL}/attendance/break/${activeBreak.id}/end`);
      // Resume desktop activity monitor
      if ((window as any).desktopMonitor) {
        (window as any).desktopMonitor.resume();
      }
      fetchAttendance();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to end break');
    }
  };

  const getEmployeeTodayStatus = (empId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const record = attendanceRecords.find(r => r.userId === empId && new Date(r.date).toISOString().split('T')[0] === today);
    if (!record) return { label: 'Leave / Not Marked', color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' };
    if (record.status === 'ABSENT') return { label: 'Absent', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' };
    if (record.checkOutAt) return { label: 'Checked Out', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' };
    return { label: 'Working', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' };
  };

  const filteredRecords = attendanceRecords.filter(r => {
    if (selectedEmployeeId && selectedEmployeeId !== 'all') {
      return r.userId === selectedEmployeeId;
    }
    return true;
  });

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const formatTime12h = (isoString: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    let h = d.getUTCHours();
    const m = String(d.getUTCMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
  };

  let isPastWorkingHours = false;
  if (companyProfile?.workingHoursEnd) {
    const endStr = new Date(companyProfile.workingHoursEnd).toISOString().split('T')[1]; // "18:00:00.000Z"
    const [endH, endM] = endStr.split(':').map(Number);
    
    // We compare currentTime against the end time
    // companyProfile.timezone could be used here if needed, but since we just want local time for now,
    // and assuming the user is in the same timezone (or the UI displays local time):
    const currentH = currentTime.getHours();
    const currentM = currentTime.getMinutes();
    
    if (currentH > endH || (currentH === endH && currentM >= endM)) {
      isPastWorkingHours = true;
    }
  }

  const checkInDisabled = !isCheckedIn && isPastWorkingHours;
  const [adminView, setAdminView] = useState<'dashboard' | 'personal'>('dashboard');

  if (isAdmin && adminView === 'dashboard') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit mb-[-1rem]">
          <button 
            onClick={() => setAdminView('dashboard')}
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-white dark:bg-slate-900 shadow-sm text-blue-600"
          >
            Team Dashboard
          </button>
          <button 
            onClick={() => setAdminView('personal')}
            className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            My Attendance
          </button>
        </div>
        <AdminAttendanceDashboard />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto relative">
      {isAdmin && (
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit mb-6">
          <button 
            onClick={() => setAdminView('dashboard')}
            className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Team Dashboard
          </button>
          <button 
            onClick={() => setAdminView('personal')}
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-white dark:bg-slate-900 shadow-sm text-blue-600"
          >
            My Attendance
          </button>
        </div>
      )}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <Clock className="text-blue-500" size={32} />
            Attendance
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track your daily working hours and submit your work log.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
        
        {/* Check In/Out Widget */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden"
          >
            {isCheckedIn && <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />}
            
            {activeBreak && (
              <div className="z-10 bg-amber-100 text-amber-800 text-sm font-bold px-4 py-1.5 rounded-full mb-4 flex items-center gap-2">
                <Coffee size={16} /> On a break
              </div>
            )}
            
            <div className="text-5xl font-mono font-bold text-slate-900 dark:text-white mb-2 z-10">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-slate-500 dark:text-slate-400 mb-6 z-10 flex items-center gap-2">
              <Calendar size={16} />
              {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>

            {companyProfile?.workingHoursStart && companyProfile?.workingHoursEnd && (
              <div className="z-10 mb-8 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800 flex items-center gap-2">
                <Clock size={16} />
                Office Hours: {formatTime12h(companyProfile.workingHoursStart)} - {formatTime12h(companyProfile.workingHoursEnd)}
              </div>
            )}

            {!isCheckedOut ? (
              <div className="z-10 flex flex-col gap-4 w-full max-w-[280px]">
                {isCheckedIn && (
                  <button
                    onClick={activeBreak ? handleEndBreak : handleTakeBreak}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-lg transition-all shadow-lg hover:scale-105 ${
                      activeBreak 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/30' 
                        : 'bg-amber-400 hover:bg-amber-500 text-amber-900 shadow-amber-400/30'
                    }`}
                  >
                    {activeBreak ? <><Play size={20} fill="currentColor" /> Resume Work</> : <><Coffee size={20} fill="currentColor" /> Take Lunch Break</>}
                  </button>
                )}

                {!activeBreak && (
                  <button
                    onClick={() => isCheckedIn ? setIsCheckOutModalOpen(true) : handleCheckIn()}
                    disabled={checkInDisabled}
                    title={checkInDisabled ? "Office hours are over" : ""}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full font-bold text-xl transition-all shadow-xl ${
                      checkInDisabled 
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : isCheckedIn 
                          ? 'bg-red-500 hover:bg-red-600 hover:scale-105 text-white shadow-red-500/30' 
                          : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white shadow-blue-600/30'
                    }`}
                  >
                    {isCheckedIn ? (
                      <><Square size={24} fill="currentColor" /> Check Out</>
                    ) : (
                      <><Play size={24} fill="currentColor" /> Check In</>
                    )}
                  </button>
                )}
              </div>
            ) : (
               <div className="z-10 flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg bg-green-100 text-green-700">
                  <CheckCircle2 size={24} /> Shift Completed
               </div>
            )}
            {isCheckedIn && !activeBreak && (
              <p className="mt-6 text-blue-600 font-medium z-10 bg-blue-50 px-4 py-2 rounded-full text-sm">
                You are currently clocked in.
              </p>
            )}
            {activeBreak && (
              <p className="mt-6 text-amber-700 font-medium z-10 bg-amber-50 px-4 py-2 rounded-full text-sm border border-amber-200">
                Activity tracking is paused.
              </p>
            )}
          </motion.div>

        {/* Recent History */}
        <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-6 backdrop-blur-md flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Your Attendance Logs
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Filter:</span>
              <input 
                type="date" 
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              {filterDate && (
                <button onClick={() => setFilterDate('')} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2">
            {attendanceRecords.filter(r => r.userId === user?.id && (!filterDate || new Date(r.date).toISOString().split('T')[0] === filterDate)).length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4">No attendance records found.</p>
            ) : (
              attendanceRecords
                .filter(r => r.userId === user?.id)
                .filter(r => !filterDate || new Date(r.date).toISOString().split('T')[0] === filterDate)
                .slice(0, 50)
                .map((record) => (
                <div key={record.id} className="flex flex-col p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.checkOutAt ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {record.checkOutAt ? <CheckCircle2 size={20} /> : <Play size={20} />}
                      </div>
                      <div>
                        {isAdmin ? (
                          <p className="font-semibold text-slate-900 dark:text-white">{record.user?.firstName} {record.user?.lastName}</p>
                        ) : (
                          <p className="font-semibold text-slate-900 dark:text-white">{new Date(record.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        )}
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {isAdmin && (
                            <span className="mr-2 font-medium">{new Date(record.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}:</span>
                          )}
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
                  
                  {record.breaks && record.breaks.length > 0 && (
                    <div className="mt-2 text-sm text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-lg flex flex-col gap-1 border border-amber-100 dark:border-amber-900/50">
                      <span className="font-semibold flex items-center gap-1.5"><Coffee size={14} /> Breaks Taken:</span>
                      {record.breaks.map((b: any, i: number) => (
                        <div key={b.id || i} className="flex justify-between pl-5">
                          <span>
                            {new Date(b.breakStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {b.breakEnd ? new Date(b.breakEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                          </span>
                          {b.breakEnd && (
                            <span className="font-medium text-amber-600 dark:text-amber-400">
                              {Math.floor((new Date(b.breakEnd).getTime() - new Date(b.breakStart).getTime()) / 60000)}m
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {record.notes && (
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
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
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <ClipboardList className="text-blue-500" size={24} /> 
                  Submit Work Log
                </h3>
                <button onClick={() => setIsCheckOutModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleCheckOutSubmit} className="p-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Before you check out, please log the work you completed during this session. This will be saved to your attendance record.
                </p>
                <div>
                  <textarea 
                    required 
                    rows={5} 
                    placeholder="e.g., Finished the landing page design, fixed 2 bugs in the backend API, and had a sync with the marketing team."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                    value={workNotes} onChange={e => setWorkNotes(e.target.value)} 
                  />
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Attach Work (Optional)
                  </label>
                  <input 
                    type="file" 
                    onChange={e => setWorklogFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 transition-colors"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => setIsCheckOutModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 transition-colors"
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
