import React, { useState, useEffect } from 'react';
import { Laptop, Plus, X, Package, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Assets = () => {
  const { hasRole } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('LAPTOP');
  const [serialNumber, setSerialNumber] = useState('');
  const [assignedToId, setAssignedToId] = useState('');

  const fetchAssets = async () => {
    try {
      const res = await axios.get(`${API_URL}/assets`);
      setAssets(res.data);
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
    fetchAssets();
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/assets`, { name, category, serialNumber, assignedToId });
      setIsModalOpen(false);
      setName(''); setCategory('LAPTOP'); setSerialNumber(''); setAssignedToId('');
      fetchAssets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create asset');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${API_URL}/assets/${id}/status`, { status, assignedToId: status === 'AVAILABLE' ? null : undefined });
      fetchAssets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update asset');
    }
  };

  if (!hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN')) {
    return <div className="p-8 text-center text-slate-500">Access Denied. You do not have permission to view this page.</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Laptop className="text-blue-500" size={32} />
            Asset Management
          </h2>
          <p className="text-slate-500 mt-1">Track company hardware and software licenses</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white"
        >
          <Plus size={20} /> Add Asset
        </button>
      </header>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Asset Name</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Category</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Serial Number</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Assigned To</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No assets found.</td></tr>
              ) : (
                assets.map(asset => (
                  <tr key={asset.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{asset.name}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{asset.category}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-sm">{asset.serialNumber || '-'}</td>
                    <td className="p-4">
                      {asset.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                            {asset.assignedTo.firstName[0]}{asset.assignedTo.lastName[0]}
                          </div>
                          <span className="text-slate-700 dark:text-slate-300 text-sm">{asset.assignedTo.firstName} {asset.assignedTo.lastName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-sm">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      {asset.status === 'AVAILABLE' ? 
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-max"><ShieldCheck size={14}/> Available</span> : 
                       asset.status === 'ASSIGNED' ? 
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 flex items-center gap-1 w-max"><Package size={14}/> Assigned</span> : 
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 w-max inline-block">Maintenance</span>
                      }
                    </td>
                    <td className="p-4 text-right">
                      {asset.status === 'ASSIGNED' && (
                        <button onClick={() => handleUpdateStatus(asset.id, 'AVAILABLE')} className="text-white bg-slate-600 hover:bg-slate-500 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Revoke</button>
                      )}
                      {asset.status === 'AVAILABLE' && (
                        <button onClick={() => handleUpdateStatus(asset.id, 'MAINTENANCE')} className="text-yellow-700 bg-yellow-100 hover:bg-yellow-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Set Maintenance</button>
                      )}
                      {asset.status === 'MAINTENANCE' && (
                        <button onClick={() => handleUpdateStatus(asset.id, 'AVAILABLE')} className="text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Mark Fixed</button>
                      )}
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
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add New Asset</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Asset Name / Model</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. MacBook Pro M3"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="LAPTOP">Laptop / PC</option>
                      <option value="MONITOR">Monitor / Display</option>
                      <option value="PERIPHERAL">Keyboard / Mouse</option>
                      <option value="SOFTWARE">Software License</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Serial Number</label>
                    <input type="text" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Optional"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Assign To (Optional)</label>
                  <select value={assignedToId} onChange={e => setAssignedToId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Leave Unassigned</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-500">Add Asset</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Assets;
