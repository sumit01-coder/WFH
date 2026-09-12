import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Search, RefreshCw, Award } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';

const Performance = () => {
  const { hasRole } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API_URL}/performance`);
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
    if (hasRole('MANAGER', 'HR', 'COMPANY_ADMIN', 'SUPER_ADMIN')) {
      fetchEmployees();
    }
  }, []);

  const handleGenerate = async () => {
    if (!selectedEmployee) return alert('Please select an employee');
    setIsGenerating(true);
    try {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      
      await axios.post(`${API_URL}/performance/generate`, {
        employeeId: selectedEmployee,
        period: 'MONTHLY',
        periodStart: firstDay.toISOString(),
        periodEnd: today.toISOString()
      });
      fetchRecords();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to generate record');
    } finally {
      setIsGenerating(false);
    }
  };

  const canManage = hasRole('HR', 'MANAGER', 'COMPANY_ADMIN', 'SUPER_ADMIN');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <TrendingUp className="text-blue-500" size={32} />
            Performance Reviews
          </h2>
          <p className="text-slate-500 mt-1">Track and compute employee metrics</p>
        </div>
      </header>

      {canManage && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8 flex items-end gap-4 shadow-sm">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Employee to Evaluate</label>
            <select 
              value={selectedEmployee} 
              onChange={e => setSelectedEmployee(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select an employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.email})</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white disabled:opacity-50"
          >
            <RefreshCw size={18} className={isGenerating ? "animate-spin" : ""} /> 
            {isGenerating ? "Computing..." : "Compute Monthly Score"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No performance records found.
          </div>
        ) : (
          records.map(record => (
            <div key={record.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Award size={100} className="text-blue-500 -mr-6 -mt-6" />
              </div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
                  {record.computedScore}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    {record.user?.firstName} {record.user?.lastName}
                  </h3>
                  <p className="text-xs text-slate-500">{record.period} - {new Date(record.periodStart).toLocaleString('default', { month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Tasks Completed</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{record.tasksCompleted}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Attendance Days</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{record.attendanceDays}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">WFH Days</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{record.wfhDays}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Performance;
