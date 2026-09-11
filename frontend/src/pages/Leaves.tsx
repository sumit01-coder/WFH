import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Clock, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Leaves = () => {
  const { user, hasRole } = useAuth();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  const [leaveType, setLeaveType] = useState('VACATION');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [reviewRemarks, setReviewRemarks] = useState('');

  const [employees, setEmployees] = useState<any[]>([]);
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [isEditBalanceModalOpen, setIsEditBalanceModalOpen] = useState(false);
  const [editBalance, setEditBalance] = useState<{leaveType: string, totalDays: number, usedDays: number} | null>(null);

  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [bulkEditBalance, setBulkEditBalance] = useState({ leaveType: 'VACATION', totalDays: 15, resetUsedDays: false });

  const canReview = hasRole('HR', 'MANAGER', 'COMPANY_ADMIN', 'SUPER_ADMIN');

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${API_URL}/leaves`);
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBalances = async (uid?: string) => {
    try {
      const query = uid ? `?userId=${uid}` : '';
      const res = await axios.get(`${API_URL}/leaves/balances${query}`);
      setBalances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees`);
      setEmployees(res.data.employees || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchBalances();
    if (canReview) {
      fetchEmployees();
    }
  }, [canReview]);

  useEffect(() => {
    if (targetUserId) {
      fetchBalances(targetUserId);
    } else {
      fetchBalances();
    }
  }, [targetUserId]);

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/leaves`, { leaveType, startDate, endDate, reason });
      setIsModalOpen(false);
      setLeaveType('VACATION'); setStartDate(''); setEndDate(''); setReason('');
      fetchLeaves();
      fetchBalances();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit leave request');
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await axios.put(`${API_URL}/leaves/${selectedLeave.id}/status`, { status, reviewRemarks });
      setIsReviewModalOpen(false);
      setSelectedLeave(null);
      setReviewRemarks('');
      fetchLeaves();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update leave status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle size={14}/> Approved</span>;
      case 'REJECTED': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 flex items-center gap-1"><XCircle size={14}/> Rejected</span>;
      default: return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1"><Clock size={14}/> Pending</span>;
    }
  };

  const handleUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBalance || !targetUserId) return;
    try {
      await axios.put(`${API_URL}/leaves/balances`, {
        userId: targetUserId,
        leaveType: editBalance.leaveType,
        totalDays: editBalance.totalDays,
        usedDays: editBalance.usedDays
      });
      setIsEditBalanceModalOpen(false);
      setEditBalance(null);
      fetchBalances(targetUserId);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update balance');
    }
  };

  const handleBulkUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm(`Are you sure you want to set ${bulkEditBalance.leaveType} to ${bulkEditBalance.totalDays} days for ALL employees?`)) return;
    
    try {
      await axios.put(`${API_URL}/leaves/balances/bulk`, {
        leaveType: bulkEditBalance.leaveType,
        totalDays: bulkEditBalance.totalDays,
        resetUsedDays: bulkEditBalance.resetUsedDays
      });
      setIsBulkEditModalOpen(false);
      fetchBalances(targetUserId);
      alert('Successfully updated balances for all employees.');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to bulk update balances');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="text-blue-500" size={32} />
            Leave Management
          </h2>
          <p className="text-slate-500 mt-1">Manage your time off requests</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white"
        >
          <Plus size={20} /> Request Leave
        </button>
      </header>

      {/* Balances Section */}
      {canReview && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-3">Viewing Balances For:</label>
            <select
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="">Myself</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setIsBulkEditModalOpen(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-sm"
          >
            Bulk Edit Balances
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {balances.map(b => {
          const remaining = b.totalDays - b.usedDays;
          const percentage = Math.min((remaining / b.totalDays) * 100, 100);
          return (
            <div key={b.leaveType} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative">
              {canReview && targetUserId && (
                <button 
                  onClick={() => { setEditBalance(b); setIsEditBalanceModalOpen(true); }}
                  className="absolute top-4 right-4 text-slate-400 hover:text-blue-500 text-sm font-medium"
                >
                  Edit
                </button>
              )}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 dark:text-slate-300">{b.leaveType}</h3>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{remaining} Days Left</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{b.usedDays} Used</span>
                <span>{b.totalDays} Total</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Employee</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Dates</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                {canReview && <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Action</th>}
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No leave requests found.</td>
                </tr>
              ) : (
                leaves.map(leave => (
                  <tr key={leave.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white">{leave.user?.firstName} {leave.user?.lastName}</div>
                      <div className="text-xs text-slate-500">{leave.user?.email}</div>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{leave.leaveType}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">{getStatusBadge(leave.status)}</td>
                    {canReview && (
                      <td className="p-4 text-right">
                        {leave.status === 'PENDING' && leave.userId !== user?.id && (
                          <button 
                            onClick={() => { setSelectedLeave(leave); setIsReviewModalOpen(true); }}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Review
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Request Leave</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <form onSubmit={handleSubmitLeave} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Leave Type</label>
                    <select value={leaveType} onChange={e => setLeaveType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="VACATION">Vacation</option>
                      <option value="SICK">Sick Leave</option>
                      <option value="PERSONAL">Personal</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
                      <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">End Date</label>
                      <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Reason</label>
                    <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Optional context..."/>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-500">Submit Request</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isReviewModalOpen && selectedLeave && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Review Leave Request</h3>
                <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2">
                  <p className="text-sm"><span className="font-semibold text-slate-700 dark:text-slate-300">Employee:</span> {selectedLeave.user?.firstName} {selectedLeave.user?.lastName}</p>
                  <p className="text-sm"><span className="font-semibold text-slate-700 dark:text-slate-300">Type:</span> {selectedLeave.leaveType}</p>
                  <p className="text-sm"><span className="font-semibold text-slate-700 dark:text-slate-300">Dates:</span> {new Date(selectedLeave.startDate).toLocaleDateString()} - {new Date(selectedLeave.endDate).toLocaleDateString()}</p>
                  <p className="text-sm"><span className="font-semibold text-slate-700 dark:text-slate-300">Reason:</span> {selectedLeave.reason || 'None provided'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Review Remarks (Optional)</label>
                  <textarea rows={2} value={reviewRemarks} onChange={e => setReviewRemarks(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Notes..."/>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => handleUpdateStatus('REJECTED')} className="flex-1 py-3 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 rounded-xl font-medium">Reject</button>
                  <button onClick={() => handleUpdateStatus('APPROVED')} className="flex-1 py-3 bg-green-600 text-white shadow-lg shadow-green-500/20 hover:bg-green-500 rounded-xl font-medium">Approve</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isEditBalanceModalOpen && editBalance && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit {editBalance.leaveType} Balance</h3>
                <button onClick={() => {setIsEditBalanceModalOpen(false); setEditBalance(null);}} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <form onSubmit={handleUpdateBalance} className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Total Days</label>
                      <input type="number" required min="0" value={editBalance.totalDays} onChange={e => setEditBalance({...editBalance, totalDays: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Used Days</label>
                      <input type="number" required min="0" value={editBalance.usedDays} onChange={e => setEditBalance({...editBalance, usedDays: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button type="button" onClick={() => {setIsEditBalanceModalOpen(false); setEditBalance(null);}} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-500">Save Balance</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {isBulkEditModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Bulk Edit Balances</h3>
                <button onClick={() => setIsBulkEditModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <form onSubmit={handleBulkUpdateBalance} className="p-6">
                <p className="text-sm text-slate-500 mb-6">
                  Update the leave balance for <strong>ALL employees</strong> in the company.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Leave Type</label>
                    <select 
                      value={bulkEditBalance.leaveType} 
                      onChange={e => setBulkEditBalance({...bulkEditBalance, leaveType: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="VACATION">Vacation</option>
                      <option value="SICK">Sick Leave</option>
                      <option value="PERSONAL">Personal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Total Days</label>
                    <input type="number" required min="0" value={bulkEditBalance.totalDays} onChange={e => setBulkEditBalance({...bulkEditBalance, totalDays: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/50">
                    <input 
                      type="checkbox" 
                      id="resetUsedDays" 
                      checked={bulkEditBalance.resetUsedDays}
                      onChange={e => setBulkEditBalance({...bulkEditBalance, resetUsedDays: e.target.checked})}
                      className="w-4 h-4 text-red-600 rounded border-red-300 focus:ring-red-500"
                    />
                    <label htmlFor="resetUsedDays" className="text-sm text-red-800 dark:text-red-300 font-medium cursor-pointer">
                      Reset "Used Days" to 0 for everyone
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button type="button" onClick={() => setIsBulkEditModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-500">Apply to All</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaves;
