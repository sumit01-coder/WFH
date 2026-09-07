import React, { useState, useEffect } from 'react';
import { Home, Plus, Calendar, User, X, Check, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const WFH = () => {
  const { hasRole } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ date: '', reason: '' });

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/wfh`);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/wfh`, formData);
      setIsModalOpen(false);
      setFormData({ date: '', reason: '' });
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error creating request');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`${API_URL}/wfh/${id}/status`, { status });
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error updating status');
    }
  };

  const isReviewer = hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER');

  return (
    <div className="p-8 max-w-5xl mx-auto relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
            <Home className="text-purple-500" size={32} />
            {isReviewer ? 'Team WFH Requests' : 'My WFH Requests'}
          </h2>
          <p className="text-slate-500 mt-1">Manage Work From Home requests.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-purple-500/20 text-white"
        >
          <Plus size={18} /> New Request
        </button>
      </header>

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 text-slate-500 text-sm font-medium bg-slate-50">
          <div className="col-span-3">Date</div>
          <div className={`col-span-${isReviewer ? '4' : '6'}`}>Reason</div>
          {isReviewer && <div className="col-span-2">Employee</div>}
          <div className="col-span-3 text-right">Status</div>
        </div>

        <div className="divide-y divide-slate-100">
          {requests.map((req, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              key={req.id} 
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors group"
            >
              <div className="col-span-3 flex items-center gap-2 font-medium text-slate-900">
                <Calendar size={16} className="text-slate-400 group-hover:text-purple-500 transition-colors" />
                {new Date(req.date).toLocaleDateString()}
              </div>
              <div className={`col-span-${isReviewer ? '4' : '6'} text-slate-500 text-sm truncate`}>
                {req.reason}
              </div>
              {isReviewer && (
                <div className="col-span-2 text-slate-700 text-sm font-medium truncate flex items-center gap-2">
                  <User size={14} className="text-slate-400" />
                  {req.user?.firstName} {req.user?.lastName}
                </div>
              )}
              <div className="col-span-3 flex justify-end items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full border font-bold ${
                  req.status === 'PENDING' ? 'text-orange-600 border-orange-200 bg-orange-50' :
                  req.status === 'APPROVED' ? 'text-green-600 border-green-200 bg-green-50' :
                  'text-red-600 border-red-200 bg-red-50'
                }`}>
                  {req.status}
                </span>

                {isReviewer && req.status === 'PENDING' && (
                  <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => updateStatus(req.id, 'APPROVED')} className="p-1 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Approve">
                      <Check size={18} />
                    </button>
                    <button onClick={() => updateStatus(req.id, 'REJECTED')} className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject">
                      <XCircle size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {requests.length === 0 && (
             <div className="p-8 text-center text-slate-500">No WFH requests found.</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">Request WFH</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                  <textarea required rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                    value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20 mt-6"
                >
                  Submit Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WFH;
