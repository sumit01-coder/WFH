import React, { useState, useEffect } from 'react';
import { FolderKanban, Plus, MoreHorizontal, Calendar, Users, X, GitBranch, GitCommit, Copy, Star, GitFork, AlertCircle, GitPullRequest, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';

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
    endDate: '',
    githubRepo: ''
  });

  const [githubCommits, setGithubCommits] = useState<any[]>([]);
  const [githubIssues, setGithubIssues] = useState<any[]>([]);
  const [repoStats, setRepoStats] = useState<any>(null);
  const [isLoadingCommits, setIsLoadingCommits] = useState(false);
  const [githubError, setGithubError] = useState('');

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

  useEffect(() => {
    if (selectedProject?.githubRepo) {
      const fetchGithubData = async () => {
        setIsLoadingCommits(true);
        setGithubError('');
        try {
          // Parse githubRepo URL: https://github.com/owner/repo
          let url = selectedProject.githubRepo;
          if (url.endsWith('/')) url = url.slice(0, -1);
          if (url.endsWith('.git')) url = url.slice(0, -4);
          const parts = url.split('/');
          if (parts.length >= 2) {
            const repo = parts[parts.length - 1];
            const owner = parts[parts.length - 2];
            
            const token = localStorage.getItem('github_pat');
            const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

            const [commitsRes, issuesRes, statsRes] = await Promise.all([
              fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, { headers }),
              fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=5`, { headers }),
              fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers })
            ]);

            if (!commitsRes.ok && commitsRes.status === 404) {
              throw new Error('Repository not found or requires Personal Access Token (PAT). Configure it in Settings -> Integrations.');
            }
            if (!commitsRes.ok && commitsRes.status === 401) {
              throw new Error('Invalid GitHub Personal Access Token (PAT). Please update it in Settings.');
            }
            if (!commitsRes.ok) throw new Error('GitHub API Error');

            const [commitsData, issuesData, statsData] = await Promise.all([
              commitsRes.json(),
              issuesRes.ok ? issuesRes.json() : Promise.resolve([]),
              statsRes.ok ? statsRes.json() : Promise.resolve(null)
            ]);

            setGithubCommits(commitsData);
            setGithubIssues(issuesData);
            setRepoStats(statsData);
          } else {
            setGithubError('Invalid GitHub URL format');
          }
        } catch (err: any) {
          setGithubError(err.message || 'Failed to load GitHub data. The repo may be private or invalid.');
        } finally {
          setIsLoadingCommits(false);
        }
      };
      fetchGithubData();
    } else {
      setGithubCommits([]);
      setGithubIssues([]);
      setRepoStats(null);
      setGithubError('');
    }
  }, [selectedProject]);

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
        endDate: '',
        githubRepo: ''
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
      endDate: selectedProject.endDate ? new Date(selectedProject.endDate).toISOString().split('T')[0] : '',
      githubRepo: selectedProject.githubRepo || ''
    });
    setIsEditMode(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'PLANNING': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'COMPLETED': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-500 dark:text-slate-400 bg-gray-500/10 border-gray-500/20';
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
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all active and planned projects.</p>
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
        <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-220px)]">
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
                className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-purple-500/30 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-300 transition-colors">{project.name}</h4>
                  <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:text-white"><MoreHorizontal size={18} /></button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 rounded-md border ${getStatusColor(project.status)}`}>{project.status}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm px-2 py-1 rounded-md">{project.priority}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm">
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
        <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-220px)]">
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
                className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-blue-500/30 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-300 transition-colors">{project.name}</h4>
                  <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:text-white"><MoreHorizontal size={18} /></button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 rounded-md border ${getStatusColor(project.status)}`}>{project.status}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm px-2 py-1 rounded-md">{project.priority}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm">
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
        <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-220px)]">
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
                className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-green-500/30 transition-colors cursor-pointer group opacity-60 hover:opacity-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-green-300 transition-colors">{project.name}</h4>
                  <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:text-white"><MoreHorizontal size={18} /></button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 rounded-md border ${getStatusColor(project.status)}`}>{project.status}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm px-2 py-1 rounded-md">{project.priority}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm">
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
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800/60 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
                <div className="absolute top-0 right-0 p-4 z-20">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="bg-white/20 dark:bg-slate-900/20 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-full transition-all cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="relative z-10 flex items-start gap-4">
                  <div className="bg-white/20 dark:bg-slate-900/20 p-3 rounded-2xl backdrop-blur-md shadow-inner border border-white/10">
                    <FolderKanban size={32} className="text-white drop-shadow-md" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold tracking-tight mb-2 text-white drop-shadow-sm">{selectedProject.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/20 dark:bg-slate-900/20 text-white text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-sm">
                        {selectedProject.status.replace('_', ' ')}
                      </span>
                      <span className="bg-white/20 dark:bg-slate-900/20 text-white text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-sm">
                        {selectedProject.priority} PRIORITY
                      </span>
                    </div>
                  </div>
                </div>
                {/* Decorative shapes */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 dark:bg-slate-900/10 rounded-full blur-3xl"></div>
                <div className="absolute top-0 left-1/2 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto flex-1 custom-scrollbar p-6 sm:p-8">
                {isEditMode ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name *</label>
                    <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub Repository URL (Optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <GitBranch size={18} />
                      </div>
                      <input type="url" placeholder="https://github.com/username/repo" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={formData.githubRepo} onChange={e => setFormData({ ...formData, githubRepo: e.target.value })} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                    <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Manager</label>
                      <select
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={formData.managerId} onChange={e => setFormData({ ...formData, managerId: e.target.value })}
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
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assigned Team</label>
                      <select
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={formData.teamId} onChange={e => setFormData({ ...formData, teamId: e.target.value })}
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
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                      <select
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="PLANNING">Planning</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                      <select
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                      <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target End Date</label>
                      <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsEditMode(false)} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                      Cancel
                    </button>
                    <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 cursor-pointer">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-lg font-bold shadow-inner uppercase">
                        {selectedProject.manager ? selectedProject.manager?.firstName?.charAt(0) : '?'}
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Project Manager</p>
                        <p className="font-bold text-slate-900 dark:text-white text-lg">
                          {selectedProject.manager ? `${selectedProject.manager?.firstName} ${selectedProject.manager?.lastName}` : 'Unassigned'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shadow-inner">
                        <Users size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Assigned Team</p>
                        <p className="font-bold text-slate-900 dark:text-white text-lg">{selectedProject.team?.name || 'No Team Assigned'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Project Description</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-6">
                      {selectedProject.description || "No detailed description has been provided for this project yet. Please contact the project manager for more information."}
                    </p>
                  </div>

                  {selectedProject.githubRepo && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl shadow-inner border border-white/50 dark:border-slate-600/30">
                            <GitBranch size={20} className="text-slate-800 dark:text-slate-200" />
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">GitHub Dashboard</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Live from repository</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              navigator.clipboard.writeText(`git clone ${selectedProject.githubRepo}.git`);
                              const btn = e.currentTarget;
                              const originalText = btn.innerHTML;
                              btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
                              setTimeout(() => btn.innerHTML = originalText, 2000);
                            }}
                            className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl transition-all flex items-center gap-2"
                          >
                            <Terminal size={14} /> Clone
                          </button>
                          <a href={selectedProject.githubRepo} target="_blank" rel="noopener noreferrer" className="text-xs text-white font-bold bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 shadow-sm border border-slate-800 dark:border-blue-500 px-4 py-2 rounded-xl transition-all hover:scale-105 flex items-center gap-2">
                            View Repository
                          </a>
                        </div>
                      </div>
                      
                      {repoStats && (
                        <div className="flex flex-wrap gap-3 mb-4">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 rounded-lg text-xs font-bold border border-yellow-200/50 dark:border-yellow-800/30">
                            <Star size={14} /> {repoStats.stargazers_count} Stars
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700">
                            <GitFork size={14} /> {repoStats.forks_count} Forks
                          </div>
                          {repoStats.language && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-bold border border-blue-200/50 dark:border-blue-800/30">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span> {repoStats.language}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-xs font-bold border border-green-200/50 dark:border-green-800/30">
                            <AlertCircle size={14} /> {repoStats.open_issues_count} Open Issues
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Commits Section */}
                        <div className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-800/80 dark:to-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-lg shadow-slate-200/20 dark:shadow-black/20 backdrop-blur-xl">
                          <div className="bg-slate-50/80 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/50 flex items-center gap-2">
                            <GitCommit size={16} className="text-slate-500 dark:text-slate-400" />
                            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Latest Commits</h5>
                          </div>
                          {isLoadingCommits ? (
                            <div className="p-8 flex flex-col items-center justify-center">
                              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                              <div className="text-slate-500 dark:text-slate-400 text-xs font-medium animate-pulse">Syncing...</div>
                            </div>
                          ) : githubError ? (
                            <div className="p-4 text-center">
                              <p className="text-red-500 dark:text-red-400 text-xs font-semibold">{githubError}</p>
                            </div>
                          ) : githubCommits.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 text-xs font-medium">No commits found.</div>
                          ) : (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-56 overflow-y-auto custom-scrollbar">
                              {githubCommits.map((commit: any, idx: number) => (
                                <li key={idx} className="group p-3 hover:bg-white dark:hover:bg-slate-800/80 transition-all">
                                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mb-1" title={commit.commit.message}>
                                    {commit.commit.message}
                                  </p>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                                      {commit.commit.author.name}
                                    </span>
                                    <span>â€¢</span>
                                    <a href={commit.html_url} target="_blank" rel="noopener noreferrer" className="font-mono hover:text-blue-500 transition-colors bg-slate-100 dark:bg-slate-700 px-1 rounded">
                                      {commit.sha.substring(0, 7)}
                                    </a>
                                    <span>â€¢</span>
                                    <span>{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Issues & PRs Section */}
                        <div className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-800/80 dark:to-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-lg shadow-slate-200/20 dark:shadow-black/20 backdrop-blur-xl">
                          <div className="bg-slate-50/80 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/50 flex items-center gap-2">
                            <AlertCircle size={16} className="text-slate-500 dark:text-slate-400" />
                            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Open Issues & PRs</h5>
                          </div>
                          {isLoadingCommits ? (
                            <div className="p-8 flex flex-col items-center justify-center">
                              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                            </div>
                          ) : githubError ? (
                            <div className="p-4 text-center">
                              <p className="text-red-500 text-xs font-semibold">Failed to load</p>
                            </div>
                          ) : githubIssues.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 text-xs font-medium">No open issues or PRs. ðŸŽ‰</div>
                          ) : (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-56 overflow-y-auto custom-scrollbar">
                              {githubIssues.map((issue: any, idx: number) => {
                                const isPR = !!issue.pull_request;
                                return (
                                  <li key={idx} className="group p-3 hover:bg-white dark:hover:bg-slate-800/80 transition-all flex gap-3 items-start">
                                    <div className={`mt-0.5 shrink-0 ${isPR ? 'text-purple-500' : 'text-green-500'}`}>
                                      {isPR ? <GitPullRequest size={14} /> : <AlertCircle size={14} />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate hover:text-blue-500 dark:hover:text-blue-400 transition-colors block mb-1">
                                        {issue.title}
                                      </a>
                                      <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                                        <span className="font-medium">#{issue.number}</span>
                                        <span>â€¢</span>
                                        <span>by {issue.user.login}</span>
                                        {issue.comments > 0 && (
                                          <>
                                            <span>â€¢</span>
                                            <span>{issue.comments} comments</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

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
                          className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          Close Details
                        </button>
                      </div>
                    </div>
                  )}
              </div>
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
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">Create New Project</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><X size={20} /></button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Name *</label>
                  <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub Repository URL (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <GitBranch size={18} />
                    </div>
                    <input type="url" placeholder="https://github.com/username/repo" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.githubRepo} onChange={e => setFormData({ ...formData, githubRepo: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Manager</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.managerId} onChange={e => setFormData({ ...formData, managerId: e.target.value })}
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assigned Team</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.teamId} onChange={e => setFormData({ ...formData, teamId: e.target.value })}
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="PLANNING">Planning</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target End Date</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
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
