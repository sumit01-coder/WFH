import React, { useState, useEffect } from 'react';
import { FolderKanban, Plus, MoreHorizontal, Calendar, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Projects = () => {
  const { hasRole, user: currentUser } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'PLANNING',
    priority: 'MEDIUM',
    managerId: currentUser?.id,
    teamId: '',
    startDate: '',
    endDate: ''
  });

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchUsersAndTeams = async () => {
    if (hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER')) {
      try {
        const [usersRes, teamsRes] = await Promise.all([
          axios.get(`${API_URL}/users`),
          axios.get(`${API_URL}/teams`)
        ]);
        setEmployees(usersRes.data);
        setTeams(teamsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsersAndTeams();
  }, [currentUser]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/projects`, formData);
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        description: '',
        status: 'PLANNING',
        priority: 'MEDIUM',
        managerId: currentUser?.id,
        teamId: '',
        startDate: '',
        endDate: ''
      });
      fetchProjects();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error creating project');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      await axios.put(`${API_URL}/projects/${selectedProject.id}`, formData);
      setIsEditMode(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error updating project');
    }
  };

  const openEditMode = () => {
    setFormData({
      name: selectedProject.name || '',
      description: selectedProject.description || '',
      status: selectedProject.status || 'PLANNING',
      priority: selectedProject.priority || 'MEDIUM',
      managerId: selectedProject.manager?.id || '',
      teamId: selectedProject.teamId || '',
      startDate: selectedProject.startDate ? new Date(selectedProject.startDate).toISOString().split('T')[0] : '',
      endDate: selectedProject.endDate ? new Date(selectedProject.endDate).toISOString().split('T')[0] : ''
    });
    setIsEditMode(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'PLANNING': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'COMPLETED': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-500 bg-gray-500/10 border-gray-500/20';
    }
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

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <FolderKanban className="text-blue-500" size={32} />
            Projects
          </h2>
          <p className="text-slate-500 mt-1">Manage all active and planned projects.</p>
        </div>
        {hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER') && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white cursor-pointer"
          >
            <Plus size={18} />
            New Project
          </button>
        )}
      </header>

      {/* Kanban Board Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column: Planning */}
        <div className="bg-white shadow-sm rounded-2xl p-4 border border-slate-200 flex flex-col h-[calc(100vh-220px)]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-semibold text-lg text-purple-300">Planning</h3>
            <span className="bg-purple-500/20 text-purple-300 text-xs py-1 px-2 rounded-full font-bold">
              {projects.filter(p => p.status === 'PLANNING').length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {projects.filter(p => p.status === 'PLANNING').map((project, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={project.id} 
                onClick={() => setSelectedProject(project)}
                className="bg-white shadow-sm border border-slate-200 rounded-xl p-4 hover:border-purple-500/30 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900 group-hover:text-purple-300 transition-colors">{project.name}</h4>
                  <button className="text-slate-400 hover:text-slate-900"><MoreHorizontal size={18} /></button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 rounded-md border ${getStatusColor(project.status)}`}>{project.status}</span>
                  <span className="text-xs text-slate-500 bg-white shadow-sm px-2 py-1 rounded-md">{project.priority}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-sm">
                  <div className="flex items-center gap-1">
                    <Users size={14} /> 
                    {project.manager ? `${project.manager?.firstName} ${project.manager?.lastName}` : 'Unassigned'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} /> 
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No date'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Column: In Progress */}
        <div className="bg-white shadow-sm rounded-2xl p-4 border border-slate-200 flex flex-col h-[calc(100vh-220px)]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-semibold text-lg text-blue-300">In Progress</h3>
            <span className="bg-blue-500/20 text-blue-300 text-xs py-1 px-2 rounded-full font-bold">
              {projects.filter(p => p.status === 'IN_PROGRESS').length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {projects.filter(p => p.status === 'IN_PROGRESS').map((project, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={project.id} 
                onClick={() => setSelectedProject(project)}
                className="bg-white shadow-sm border border-slate-200 rounded-xl p-4 hover:border-blue-500/30 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900 group-hover:text-blue-300 transition-colors">{project.name}</h4>
                  <button className="text-slate-400 hover:text-slate-900"><MoreHorizontal size={18} /></button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 rounded-md border ${getStatusColor(project.status)}`}>{project.status}</span>
                  <span className="text-xs text-slate-500 bg-white shadow-sm px-2 py-1 rounded-md">{project.priority}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-sm">
                  <div className="flex items-center gap-1">
                    <Users size={14} /> 
                    {project.manager ? `${project.manager?.firstName} ${project.manager?.lastName}` : 'Unassigned'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} /> 
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No date'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Column: Completed */}
        <div className="bg-white shadow-sm rounded-2xl p-4 border border-slate-200 flex flex-col h-[calc(100vh-220px)]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-semibold text-lg text-green-300">Completed</h3>
            <span className="bg-green-500/20 text-green-300 text-xs py-1 px-2 rounded-full font-bold">
              {projects.filter(p => p.status === 'COMPLETED').length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {projects.filter(p => p.status === 'COMPLETED').map((project, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={project.id} 
                onClick={() => setSelectedProject(project)}
                className="bg-white shadow-sm border border-slate-200 rounded-xl p-4 hover:border-green-500/30 transition-colors cursor-pointer group opacity-60 hover:opacity-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900 group-hover:text-green-300 transition-colors">{project.name}</h4>
                  <button className="text-slate-400 hover:text-slate-900"><MoreHorizontal size={18} /></button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 rounded-md border ${getStatusColor(project.status)}`}>{project.status}</span>
                  <span className="text-xs text-slate-500 bg-white shadow-sm px-2 py-1 rounded-md">{project.priority}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-sm">
                  <div className="flex items-center gap-1">
                    <Users size={14} /> 
                    {project.manager ? `${project.manager?.firstName} ${project.manager?.lastName}` : 'Unassigned'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} /> 
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No date'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200/60"
          >
            {/* Modal Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
              <div className="absolute top-0 right-0 p-4 z-20">
                <button 
                  onClick={() => setSelectedProject(null)} 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-full transition-all cursor-pointer"
                >
                  <X size={20}/>
                </button>
              </div>
              <div className="relative z-10 flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                  <FolderKanban size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold tracking-tight mb-2">{selectedProject.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider backdrop-blur-md">
                      {selectedProject.status.replace('_', ' ')}
                    </span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider backdrop-blur-md">
                      {selectedProject.priority} PRIORITY
                    </span>
                  </div>
                </div>
              </div>
              {/* Decorative shapes */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute top-0 left-1/2 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
            </div>
            
            {/* Modal Body */}
            {isEditMode ? (
              <form onSubmit={handleUpdate} className="p-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Name *</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Manager</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.managerId} onChange={e => setFormData({...formData, managerId: e.target.value})}
                    >
                      <option value="">-- Select Manager --</option>
                      <option value={currentUser?.id}>Myself ({currentUser?.firstName})</option>
                      {employees
                        .filter(e => e.id !== currentUser?.id && getRoleRank(e.role) >= getRoleRank(currentUser?.role || ''))
                        .map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.role})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Team</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.teamId} onChange={e => setFormData({...formData, teamId: e.target.value})}
                    >
                      <option value="">-- No Team Assigned --</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="PLANNING">Planning</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target End Date</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                  </div>
                </div>

                <div className="pt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsEditMode(false)} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 cursor-pointer">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-bold shadow-inner uppercase">
                      {selectedProject.manager ? selectedProject.manager?.firstName?.charAt(0) : '?'}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Project Manager</p>
                      <p className="font-bold text-slate-900 text-lg">
                        {selectedProject.manager ? `${selectedProject.manager?.firstName} ${selectedProject.manager?.lastName}` : 'Unassigned'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shadow-inner">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Assigned Team</p>
                      <p className="font-bold text-slate-900 text-lg">{selectedProject.team?.name || 'No Team Assigned'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Project Description</h4>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {selectedProject.description || "No detailed description has been provided for this project yet. Please contact the project manager for more information."}
                  </p>
                </div>
                
                <div className="pt-6 flex justify-end gap-3">
                  {hasRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'HR', 'MANAGER') && (
                    <button 
                      onClick={openEditMode}
                      className="px-6 py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      Edit Project
                    </button>
                  )}
                  <button 
                    onClick={() => { setSelectedProject(null); setIsEditMode(false); }}
                    className="px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">Create New Project</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Name *</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Manager</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.managerId} onChange={e => setFormData({...formData, managerId: e.target.value})}
                    >
                      <option value="">-- Select Manager --</option>
                      <option value={currentUser?.id}>Myself ({currentUser?.firstName})</option>
                      {employees
                        .filter(e => e.id !== currentUser?.id && getRoleRank(e.role) >= getRoleRank(currentUser?.role || ''))
                        .map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.role})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Team</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.teamId} onChange={e => setFormData({...formData, teamId: e.target.value})}
                    >
                      <option value="">-- No Team Assigned --</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="PLANNING">Planning</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target End Date</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 mt-6 cursor-pointer"
                >
                  Create Project
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
