import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, X, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Expenses = () => {
  const { hasRole } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState('TRAVEL');
  const [description, setDescription] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_URL}/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/expenses`, { amount, category, description, receiptUrl });
      setIsModalOpen(false);
      setAmount(''); setCategory('TRAVEL'); setDescription(''); setReceiptUrl('');
      fetchExpenses();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit expense');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${API_URL}/expenses/${id}/status`, { status });
      fetchExpenses();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const canManage = hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <CreditCard className="text-blue-500" size={32} />
            Expenses
          </h2>
          <p className="text-slate-500 mt-1">Submit and track reimbursement claims</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white"
        >
          <Plus size={20} /> Claim Expense
        </button>
      </header>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Employee</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Amount</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Category</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Description</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                {canManage && <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Action</th>}
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No expenses found.</td></tr>
              ) : (
                expenses.map(ex => (
                  <tr key={ex.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white">{ex.user?.firstName} {ex.user?.lastName}</div>
                      <div className="text-xs text-slate-500">{new Date(ex.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">${ex.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{ex.category}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-sm max-w-xs truncate">{ex.description}</td>
                    <td className="p-4">
                      {ex.status === 'APPROVED' ? 
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-max"><CheckCircle size={14}/> Approved</span> : 
                       ex.status === 'REJECTED' ? 
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 flex items-center gap-1 w-max"><XCircle size={14}/> Rejected</span> : 
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1 w-max"><Clock size={14}/> Pending</span>
                      }
                    </td>
                    {canManage && (
                      <td className="p-4 text-right">
                        {ex.status === 'PENDING' && (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleUpdateStatus(ex.id, 'APPROVED')} className="text-white bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Approve</button>
                            <button onClick={() => handleUpdateStatus(ex.id, 'REJECTED')} className="text-white bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Reject</button>
                          </div>
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
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Submit Expense Claim</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Amount ($)</label>
                    <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 150.00"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="TRAVEL">Travel</option>
                      <option value="EQUIPMENT">Equipment</option>
                      <option value="MEALS">Meals / Client</option>
                      <option value="SOFTWARE">Software License</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                  <textarea required rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="What is this expense for?"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Receipt URL (Optional)</label>
                  <input type="url" value={receiptUrl} onChange={e => setReceiptUrl(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://link-to-receipt.pdf"/>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-500">Submit Claim</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Expenses;
