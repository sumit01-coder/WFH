import React, { useState, useEffect } from 'react';
import { Users, Plus, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Teams = () => {
  const { hasRole, user: currentUser } = useAuth();
  const [teams, setTeams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [leaderId, setLeaderId] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const [teamsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/teams`),
        axios.get(`${API_URL}/users`)
      ]);
      setTeams(teamsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await axios.post(`${API_URL}/teams`, {
        name,
        description,
        leaderId,
        members: selectedMembers
      });
      setIsModalOpen(false);
      setName(''); setDescription(''); setLeaderId(''); setSelectedMembers([]);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create team');
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const getRoleRank = (role: string) => {
    if (!role) return 99;
    switch (role.toUpperCase()) {
      case 'SUPER_ADMIN': return 1;
      case 'COMPANY_ADMIN': return 2;
      case 'HR': return 3;
      case 'MANAGER': return 4;
      case 'EMPLOYEE': return 5;
      default: return 99;
    }
  };

  // Filter users so current user can only assign roles of equal or lower rank (higher number)
  const assignableUsers = users.filter(u => {
    const userRole = u.role?.name || u.role;
    const currentUserRole = currentUser?.role || '';
    return getRoleRank(userRole) >= getRoleRank(currentUserRole);
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Users className="text-blue-500" size={32} />
            Teams
          </h2>
          <p className="text-slate-500 mt-1">Combine employees to create cross-functional teams.</p>
        </div>
        {hasRole('HR', 'MANAGER', 'COMPANY_ADMIN', 'SUPER_ADMIN') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white"
          >
            <Plus size={20} /> Create Team
          </button>
        )}
      </header>

      {teams.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No teams created yet</h3>
          <p className="text-slate-500">Group employees together to easily assign them to projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={team.id} 
              className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 hover:border-blue-500/30 transition-all hover:shadow-md group flex flex-col"
            >
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{team.name}</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4 line-clamp-2 min-h-[40px]">{team.description || 'No description provided.'}</p>
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg">
                  <span className="font-semibold text-slate-500 w-16">Leader:</span>
                  <span>{team.leader ? `${team.leader.firstName} ${team.leader.lastName}` : 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg">
                  <span className="font-semibold text-slate-500 w-16">Dept:</span>
                  <span>{team.department?.name || 'General'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg">
                  <span className="font-semibold text-slate-500 w-16">Members:</span>
                  <div className="flex -space-x-2">
                    {team.members?.slice(0, 5).map((m: any) => (
                      <div key={m.user.id} title={`${m.user.firstName} ${m.user.lastName}`} className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 text-xs font-bold shadow-sm">
                        {m.user.firstName.charAt(0)}{m.user.lastName.charAt(0)}
                      </div>
                    ))}
                    {team.members?.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-600 text-xs font-bold shadow-sm">
                        +{team.members.length - 5}
                      </div>
                    )}
                    {(!team.members || team.members.length === 0) && (
                      <span className="text-slate-400 pl-2">No members</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="text-blue-500" size={24} /> Create Team
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"><X size={24}/></button>
              </div>
              
              <form onSubmit={handleCreate} className="p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Team Name *</label>
                    <input 
                      type="text" required autoFocus
                      value={name} onChange={e => setName(e.target.value)}
                      placeholder="e.g. Frontend Development Team"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <textarea 
                      rows={2}
                      value={description} onChange={e => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Team Leader</label>
                    <select 
                      value={leaderId} onChange={e => setLeaderId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="">-- Select Team Leader --</option>
                      {assignableUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.role?.name || u.role})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
                      <span>Select Team Members</span>
                      <span className="text-xs font-normal text-slate-500">{selectedMembers.length} selected</span>
                    </label>
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 max-h-48 overflow-y-auto">
                      {assignableUsers.map(u => (
                        <label key={u.id} className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={selectedMembers.includes(u.id)}
                            onChange={() => toggleMember(u.id)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          />
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 text-xs font-bold">
                              <User size={14}/>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-700">{u.firstName} {u.lastName}</span>
                              <span className="text-xs text-slate-500">{u.role?.name || u.role}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">Create Team</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teams;
