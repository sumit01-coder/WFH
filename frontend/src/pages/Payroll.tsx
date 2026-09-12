import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, X, CheckCircle, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';

const Payroll = () => {
  const { hasRole } = useAuth();
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [basicSalary, setBasicSalary] = useState<number | ''>('');
  const [bonuses, setBonuses] = useState<number | ''>('');
  const [deductions, setDeductions] = useState<number | ''>('');

  const fetchPayrolls = async () => {
    try {
      const res = await axios.get(`${API_URL}/payrolls`);
      setPayrolls(res.data);
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
    fetchPayrolls();
    if (hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN')) {
      fetchEmployees();
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/payrolls/generate`, { employeeId, month, year, basicSalary, bonuses, deductions });
      setIsModalOpen(false);
      setEmployeeId(''); setBasicSalary(''); setBonuses(''); setDeductions('');
      fetchPayrolls();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to generate payroll');
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await axios.put(`${API_URL}/payrolls/${id}/pay`);
      fetchPayrolls();
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
            <DollarSign className="text-blue-500" size={32} />
            Payroll Management
          </h2>
          <p className="text-slate-500 mt-1">Generate payslips and track employee compensation</p>
        </div>
        {canManage && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white"
          >
            <Plus size={20} /> Generate Payroll
          </button>
        )}
      </header>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Employee</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Period</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Net Pay</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No payroll records found.</td></tr>
              ) : (
                payrolls.map(pr => (
                  <tr key={pr.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white">{pr.user?.firstName} {pr.user?.lastName}</div>
                      <div className="text-xs text-slate-500">{pr.user?.email}</div>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{pr.month}/{pr.year}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">${pr.netPay.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td className="p-4">
                      {pr.status === 'PAID' ? 
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-max"><CheckCircle size={14}/> Paid</span> : 
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 w-max inline-block">Generated</span>
                      }
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-slate-500 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium">
                          <Download size={14} /> PDF
                        </button>
                        {canManage && pr.status === 'GENERATED' && (
                          <button 
                            onClick={() => handleMarkPaid(pr.id)}
                            className="text-white bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
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
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Generate Payroll</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <form onSubmit={handleGenerate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Employee</label>
                  <select required value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select an Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Month (1-12)</label>
                    <input type="number" min="1" max="12" required value={month} onChange={e => setMonth(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Year</label>
                    <input type="number" required value={year} onChange={e => setYear(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Basic Salary ($)</label>
                  <input type="number" required value={basicSalary} onChange={e => setBasicSalary(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 5000"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Bonuses ($)</label>
                    <input type="number" value={bonuses} onChange={e => setBonuses(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Deductions ($)</label>
                    <input type="number" value={deductions} onChange={e => setDeductions(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 100"/>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-500">Generate</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payroll;
