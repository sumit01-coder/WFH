import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, Play, ChevronLeft, ChevronRight, Users, Briefcase, Home, Coffee, AlertCircle, FileText, Activity, MoreVertical, Monitor } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';

import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';

const AdminAttendanceDashboard = () => {
  const { token } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [wfhRequests, setWfhRequests] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'Overview' | 'Timeline' | 'Tasks' | 'Live Screen'>('Overview');
  const [liveMonitors, setLiveMonitors] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!token) return;
    const socket = io(API_URL.replace('/api', ''), {
      auth: { token }
    });
    
    socket.emit('join_admin_monitoring');

    socket.on('monitoring_update', (data) => {
      setLiveMonitors(prev => ({
        ...prev,
        [data.userId]: data
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchDashboardData = async (date: Date) => {
    setIsLoading(true);
    try {
      const dateString = date.toISOString().split('T')[0];
      const headers = { Authorization: `Bearer ${token}` };
      
      const results = await Promise.allSettled([
        axios.get(`${API_URL}/employees`, { headers }),
        axios.get(`${API_URL}/attendance?date=${dateString}`, { headers }),
        axios.get(`${API_URL}/wfh?date=${dateString}&status=APPROVED`, { headers }),
        axios.get(`${API_URL}/leaves?date=${dateString}&status=APPROVED`, { headers }),
        axios.get(`${API_URL}/departments`, { headers }),
        axios.get(`${API_URL}/teams`, { headers })
      ]);

      const [empRes, attRes, wfhRes, leaveRes, deptRes, teamRes] = results;

      if (empRes.status === 'rejected') console.error('Failed to fetch employees', empRes.reason);
      if (attRes.status === 'rejected') console.error('Failed to fetch attendance', attRes.reason);
      if (wfhRes.status === 'rejected') console.error('Failed to fetch wfh', wfhRes.reason);
      if (leaveRes.status === 'rejected') console.error('Failed to fetch leaves', leaveRes.reason);
      if (deptRes.status === 'rejected') console.error('Failed to fetch departments', deptRes.reason);
      if (teamRes.status === 'rejected') console.error('Failed to fetch teams', teamRes.reason);

      setEmployees(empRes.status === 'fulfilled' ? (empRes.value.data.employees || []) : []);
      setAttendanceRecords(attRes.status === 'fulfilled' ? (attRes.value.data || []) : []);
      setWfhRequests(wfhRes.status === 'fulfilled' ? (wfhRes.value.data || []) : []);
      setLeaveRequests(leaveRes.status === 'fulfilled' ? (leaveRes.value.data || []) : []);
      setDepartments(deptRes.status === 'fulfilled' ? (deptRes.value.data || []) : []);
      setTeams(teamRes.status === 'fulfilled' ? (teamRes.value.data || []) : []);
    } catch (err) {
      console.error('Unexpected error fetching dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(currentDate);
  }, [currentDate]);

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // Compute Stats
  const totalEmployees = employees.length;
  
  // A map for fast lookup of today's attendance per user
  const attMap = new Map();
  attendanceRecords.forEach(r => attMap.set(r.userId, r));

  const wfhUserIds = new Set(wfhRequests.map(w => w.userId));
  const leaveUserIds = new Set(leaveRequests.map(l => l.userId));

  let workingCount = 0;
  let absentCount = 0;
  let checkedOutCount = 0;

  const enrichedEmployees = employees.map(emp => {
    const record = attMap.get(emp.id);
    let status = 'Leave';
    let statusColor = 'bg-amber-100 text-amber-700';

    if (record) {
      if (record.status === 'ABSENT') {
        status = 'Absent';
        statusColor = 'bg-red-100 text-red-700';
        absentCount++;
      } else if (record.checkOutAt) {
        status = 'Checked Out';
        statusColor = 'bg-slate-100 text-slate-700';
        checkedOutCount++;
      } else {
        status = 'Working';
        statusColor = 'bg-green-100 text-green-700';
        workingCount++;
      }
    } else if (wfhUserIds.has(emp.id)) {
      status = 'WFH';
      statusColor = 'bg-blue-100 text-blue-700';
    } else if (leaveUserIds.has(emp.id)) {
      status = 'Leave';
      statusColor = 'bg-amber-100 text-amber-700';
    }

    return {
      ...emp,
      attendanceStatus: status,
      statusColor,
      record
    };
  });

  const wfhCount = wfhUserIds.size;
  const leaveCount = leaveUserIds.size;

  // Filter Data
  let filteredData = enrichedEmployees;
  if (filterStatus !== 'All') {
    filteredData = filteredData.filter(e => e.attendanceStatus === filterStatus);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredData = filteredData.filter(e => 
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
      (e.designation || '').toLowerCase().includes(q)
    );
  }

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const selectedEmployee = enrichedEmployees.find(e => e.id === selectedEmployeeId);

  const formatDuration = (minutes: number) => {
    if (!minutes) return '-';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const getBreakDuration = (record: any) => {
    if (!record || !record.breaks) return 0;
    return record.breaks.reduce((acc: number, b: any) => acc + (b.durationMinutes || 0), 0);
  };

  if (isLoading && employees.length === 0) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <Clock className="text-blue-500" size={32} />
            Attendance
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track your team's working hours, WFH status and daily activity.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-sm">
            <button onClick={handlePrevDay} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"><ChevronLeft size={18} /></button>
            <div className="flex items-center gap-2 px-4 font-medium text-slate-700 dark:text-slate-300">
              <Calendar size={16} />
              {currentDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <button onClick={handleNextDay} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Employees</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalEmployees}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Play size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Working Now</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{workingCount}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Checked Out</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{checkedOutCount}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Home size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">WFH Today</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{wfhCount}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">On Leave</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{leaveCount}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Absent</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{absentCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-6 items-start">
        
        {/* Left Panel: Team Attendance Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[750px]">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Team Attendance</h3>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search employee..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="px-6 py-4 flex gap-2 overflow-x-auto border-b border-slate-100 dark:border-slate-800">
            {['All', 'Working', 'WFH', 'Leave', 'Absent'].map(f => (
              <button
                key={f}
                onClick={() => { setFilterStatus(f); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === f 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Check-in</th>
                  <th className="px-6 py-4">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedData.map(emp => (
                  <tr 
                    key={emp.id} 
                    onClick={() => setSelectedEmployeeId(emp.id)}
                    className={`cursor-pointer transition-colors ${selectedEmployeeId === emp.id ? 'bg-blue-50 dark:bg-blue-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {emp.photoUrl ? (
                          <img src={emp.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-slate-500">{emp.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{emp.department?.name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{emp.team?.name || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${emp.statusColor}`}>
                        {emp.attendanceStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                      {emp.record?.checkInAt ? new Date(emp.record.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                      {formatDuration(emp.record?.totalMinutes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <span className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} employees
            </span>
            <div className="flex gap-1">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1 rounded hover:bg-slate-200 disabled:opacity-50"><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded text-sm font-medium ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 text-slate-700'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1 rounded hover:bg-slate-200 disabled:opacity-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Right Panel: Selected Employee Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6 sticky top-6">
          {!selectedEmployee ? (
            <div className="h-[700px] flex flex-col items-center justify-center text-slate-400">
              <Users size={48} className="mb-4 opacity-20" />
              <p>Select an employee from the table to view details</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                {selectedEmployee.photoUrl ? (
                  <img src={selectedEmployee.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold shadow-sm">
                    {selectedEmployee.firstName.charAt(0)}{selectedEmployee.lastName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${selectedEmployee.statusColor}`}>
                      {selectedEmployee.attendanceStatus}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">{selectedEmployee.designation} â€¢ {selectedEmployee.department?.name || 'No Department'}</p>
                  <p className="text-xs text-slate-400">Team: {selectedEmployee.team?.name || '-'} | Manager: {selectedEmployee.manager ? `${selectedEmployee.manager.firstName} ${selectedEmployee.manager.lastName}` : 'None'}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-slate-100 dark:border-slate-800">
                {['Overview', 'Timeline', 'Tasks', 'Live Screen'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setSelectedTab(tab as any)}
                    className={`pb-3 border-b-2 font-medium text-sm transition-colors ${selectedTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {selectedTab === 'Overview' && (
                <>
                  {/* Overview Content */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                      <Clock className="text-blue-500 mb-2" size={20} />
                      <p className="text-xs text-slate-500">Check-in</p>
                      <p className="font-bold text-slate-900 dark:text-white text-lg">
                        {selectedEmployee.record?.checkInAt ? new Date(selectedEmployee.record.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                      <Activity className="text-indigo-500 mb-2" size={20} />
                      <p className="text-xs text-slate-500">Working Hours</p>
                      <p className="font-bold text-slate-900 dark:text-white text-lg">
                        {formatDuration(selectedEmployee.record?.totalMinutes)}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                      <Coffee className="text-amber-500 mb-2" size={20} />
                      <p className="text-xs text-slate-500">Break Time</p>
                      <p className="font-bold text-slate-900 dark:text-white text-lg">
                        {formatDuration(getBreakDuration(selectedEmployee.record))}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center text-center">
                      <Home className="text-blue-500 mb-2" size={20} />
                      <p className="text-xs text-slate-500">WFH Status</p>
                      <p className="font-bold text-slate-900 dark:text-white mt-1">
                        {wfhUserIds.has(selectedEmployee.id) ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center text-center">
                      <FileText className="text-emerald-500 mb-2" size={20} />
                      <p className="text-xs text-slate-500">Daily Report</p>
                      <p className="font-bold text-emerald-600 mt-1">Pending</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center text-center">
                      <CheckCircle2 className="text-green-500 mb-2" size={20} />
                      <p className="text-xs text-slate-500">Attendance</p>
                      <p className="font-bold text-green-600 mt-1">{selectedEmployee.record?.status === 'ABSENT' ? 'Absent' : selectedEmployee.record ? 'Present' : 'Leave'}</p>
                    </div>
                  </div>
                </>
              )}

              {selectedTab === 'Timeline' && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">Today's Timeline</h4>
                  {selectedEmployee.record ? (
                    <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-6">
                      <div className="relative pl-6">
                        <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1.5 border-2 border-white dark:border-slate-900"></div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(selectedEmployee.record.checkInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-sm text-slate-500">Checked In</p>
                      </div>
                      {selectedEmployee.record.breaks?.map((b: any, i: number) => (
                        <React.Fragment key={i}>
                          <div className="relative pl-6">
                            <div className="absolute w-3 h-3 bg-amber-500 rounded-full -left-[7px] top-1.5 border-2 border-white dark:border-slate-900"></div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(b.breakStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-sm text-slate-500">Break Started</p>
                          </div>
                          {b.breakEnd && (
                            <div className="relative pl-6">
                              <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-white dark:border-slate-900"></div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(b.breakEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              <p className="text-sm text-slate-500">Break Ended ({b.durationMinutes}m)</p>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                      {selectedEmployee.record.checkOutAt && (
                         <div className="relative pl-6">
                           <div className="absolute w-3 h-3 bg-slate-500 rounded-full -left-[7px] top-1.5 border-2 border-white dark:border-slate-900"></div>
                           <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(selectedEmployee.record.checkOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                           <p className="text-sm text-slate-500">Checked Out</p>
                         </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No timeline data available for today.</p>
                  )}
                </div>
              )}

              {selectedTab === 'Tasks' && (
                <div className="text-center py-8 text-slate-500">
                  <p>Tasks module coming soon</p>
                </div>
              )}

              {selectedTab === 'Live Screen' && (
                <div className="flex flex-col gap-4">
                  {liveMonitors[selectedEmployee.id] ? (
                    <>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500">Productivity Score</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-emerald-600">{liveMonitors[selectedEmployee.id].productivityScore}%</span>
                            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Highly Active</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Last Updated</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {new Date(liveMonitors[selectedEmployee.id].timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm relative group bg-black">
                        <img 
                          src={liveMonitors[selectedEmployee.id].screenshot} 
                          alt="Live screen" 
                          className="w-full object-contain max-h-[300px]"
                        />
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 animate-pulse">
                          <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                      <Monitor className="mx-auto text-slate-400 mb-3" size={32} />
                      <p className="text-slate-500 font-medium">No Live Stream Available</p>
                      <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">This employee is either not checked in, has paused monitoring, or hasn't granted browser screen sharing permissions.</p>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceDashboard;
