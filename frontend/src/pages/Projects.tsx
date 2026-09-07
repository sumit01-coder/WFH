import React, { useState, useEffect } from 'react';
import { FolderKanban, Plus, MoreHorizontal, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);

  // Mock data for UI demonstration
  useEffect(() => {
    setProjects([
      { id: '1', name: 'Website Redesign', status: 'IN_PROGRESS', priority: 'HIGH', manager: 'John Doe', team: 'Design Team' },
      { id: '2', name: 'Mobile App Launch', status: 'PLANNING', priority: 'MEDIUM', manager: 'Jane Smith', team: 'Mobile Team' },
      { id: '3', name: 'Q4 Marketing', status: 'COMPLETED', priority: 'LOW', manager: 'Mike Ross', team: 'Marketing' }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'PLANNING': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'COMPLETED': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-500 bg-gray-500/10 border-gray-500/20';
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
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20">
          <Plus size={18} />
          New Project
        </button>
      </header>

      {/* Kanban Board Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column: Planning */}
        <div className="bg-white shadow-sm rounded-2xl p-4 border border-slate-200 flex flex-col h-[calc(100vh-220px)]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-semibold text-lg text-purple-300">Planning</h3>
            <span className="bg-purple-500/20 text-purple-300 text-xs py-1 px-2 rounded-full font-bold">1</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {projects.filter(p => p.status === 'PLANNING').map((project, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={project.id} 
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
                  <div className="flex items-center gap-1"><Users size={14} /> {project.team}</div>
                  <div className="flex items-center gap-1"><Calendar size={14} /> Sep 30</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Column: In Progress */}
        <div className="bg-white shadow-sm rounded-2xl p-4 border border-slate-200 flex flex-col h-[calc(100vh-220px)]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-semibold text-lg text-blue-300">In Progress</h3>
            <span className="bg-blue-500/20 text-blue-300 text-xs py-1 px-2 rounded-full font-bold">1</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {projects.filter(p => p.status === 'IN_PROGRESS').map((project, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={project.id} 
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
                  <div className="flex items-center gap-1"><Users size={14} /> {project.team}</div>
                  <div className="flex items-center gap-1"><Calendar size={14} /> Oct 15</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Column: Completed */}
        <div className="bg-white shadow-sm rounded-2xl p-4 border border-slate-200 flex flex-col h-[calc(100vh-220px)]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-semibold text-lg text-green-300">Completed</h3>
            <span className="bg-green-500/20 text-green-300 text-xs py-1 px-2 rounded-full font-bold">1</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {projects.filter(p => p.status === 'COMPLETED').map((project, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={project.id} 
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
                  <div className="flex items-center gap-1"><Users size={14} /> {project.team}</div>
                  <div className="flex items-center gap-1"><Calendar size={14} /> Aug 01</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Projects;
