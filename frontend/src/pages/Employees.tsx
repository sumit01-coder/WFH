import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Shield, MoreHorizontal, X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Employees = () => {
  const { hasRole, user: currentUser } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ firstName: '', lastName: '', email: '', role: 'EMPLOYEE' });
  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/users/invite`, inviteData);
      setTempPassword(res.data.tempPassword);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to invite user');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleAccess = async (userId: string, currentStatus: string) => {
    if (!hasRole('COMPANY_ADMIN', 'HR', 'SUPER_ADMIN')) return;
    
    const action = currentStatus === 'ACTIVE' ? 'suspend' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this user's login access?`)) return;

    try {
      await axios.put(`${API_URL}/users/${userId}/access`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update access');
    }
  };

  const roleColors: any = {
    SUPER_ADMIN: 'bg-purple-100 text-purple-700',
    COMPANY_ADMIN: 'bg-blue-100 text-blue-700',
    HR: 'bg-pink-100 text-pink-700',
    MANAGER: 'bg-orange-100 text-orange-700',
    EMPLOYEE: 'bg-green-100 text-green-700'
  };

  const canEditRole = (targetRole: string) => {
    if (!currentUser) return false;
    if (currentUser.role === 'SUPER_ADMIN') return targetRole !== 'SUPER_ADMIN';
    if (currentUser.role === 'COMPANY_ADMIN') return targetRole !== 'SUPER_ADMIN' && targetRole !== 'COMPANY_ADMIN';
    if (currentUser.role === 'HR') return targetRole !== 'SUPER_ADMIN' && targetRole !== 'COMPANY_ADMIN' && targetRole !== 'HR';
    return false;
  };

  const getAvailableRoles = () => {
    if (currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'COMPANY_ADMIN') {
      return ['HR', 'MANAGER', 'EMPLOYEE'];
    }
    if (currentUser?.role === 'HR') {
      return ['MANAGER', 'EMPLOYEE'];
    }
    return [];
  };

  const canInvite = hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN');
  const availableRoles = getAvailableRoles();

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <Users className="text-blue-500" size={32} />
            Company Directory
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage your organization's members.</p>
        </div>
        {canInvite && (
          <button 
            onClick={() => { setIsInviteModalOpen(true); setTempPassword(''); }}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white flex items-center gap-2"
          >
            <UserPlus size={18} /> Invite User
          </button>
        )}
      </header>

      <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Name</th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Role</th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Contact</th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp, i) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                key={emp.id} 
                className="hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:bg-slate-800 transition-colors"
              >
                <td className="p-4">
                  <div className="font-bold text-slate-900 dark:text-white">{emp.firstName} {emp.lastName}</div>
                  <div className="text-sm text-slate-400">{emp.department || 'No Dept'}</div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${roleColors[emp.role]}`}>
                    {emp.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                    <Mail size={14} /> {emp.email}
                  </div>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleToggleAccess(emp.id, emp.status)}
                    disabled={!canEditRole(emp.role) || emp.id === currentUser?.id}
                    title={emp.id === currentUser?.id ? "You cannot suspend yourself" : (!canEditRole(emp.role) ? "You do not have permission to edit this role" : (emp.status === 'ACTIVE' ? 'Click to Suspend Access' : 'Click to Reactivate Access'))}
                    className={`px-3 py-1 border rounded-full text-xs font-bold transition-colors ${
                      emp.status === 'ACTIVE' 
                        ? 'bg-green-50 text-green-600 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-green-50 hover:text-green-600 hover:border-green-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {emp.status}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <h3 className="text-xl font-bold flex items-center gap-2"><UserPlus size={20} className="text-blue-500" /> Invite New User</h3>
                <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
              </div>
              
              <div className="p-6">
                {tempPassword ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="text-green-600" size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">User Invited!</h4>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Share this temporary password with the user securely. They must change it upon their first login.</p>
                    
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl flex justify-between items-center border border-slate-200 dark:border-slate-800 mb-6 group cursor-pointer hover:bg-slate-200 transition-colors" onClick={copyToClipboard}>
                      <code className="text-lg font-mono text-slate-800 dark:text-slate-100 tracking-wider font-bold">{tempPassword}</code>
                      <button className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700">
                        {copied ? <Check size={20} className="text-green-500"/> : <Copy size={20}/>}
                      </button>
                    </div>

                    <button 
                      onClick={() => setIsInviteModalOpen(false)}
                      className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInvite} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                        <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={inviteData.firstName} onChange={e => setInviteData({...inviteData, firstName: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                        <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={inviteData.lastName} onChange={e => setInviteData({...inviteData, lastName: e.target.value})} />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                      <input required type="email" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={inviteData.email} onChange={e => setInviteData({...inviteData, email: e.target.value})} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role assignment</label>
                      <select 
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                        value={inviteData.role} onChange={e => setInviteData({...inviteData, role: e.target.value})}
                      >
                        {availableRoles.map(role => (
                          <option key={role} value={role}>{role.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 mt-6"
                    >
                      Generate Invite
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Employees;
