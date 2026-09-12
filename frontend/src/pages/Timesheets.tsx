import React, { useState, useEffect } from 'react';
import { Clock, Plus, X, Calendar as CalendarIcon, Briefcase } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';

const Timesheets = () => {
  const { user } = useAuth();
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState<number | ''>('');
  const [description, setDescription] = useState('');

  const fetchTimesheets = async () => {
    try {
      const res = await axios.get(`${API_URL}/timesheets`);
      setTimesheets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTimesheets();
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !date || !hours) return alert("Please fill all required fields");
    
    try {
      await axios.post(`${API_URL}/timesheets`, { projectId, date, hours, description });
      setIsModalOpen(false);
      setProjectId(''); setDate(''); setHours(''); setDescription('');
      fetchTimesheets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit timesheet');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Clock className="text-blue-500" size={32} />
            Timesheets
          </h2>
          <p className="text-slate-500 mt-1">Log hours worked on specific projects</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white"
        >
          <Plus size={20} /> Log Hours
        </button>
      </header>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Employee</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Project</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Hours</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Description</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No timesheets logged yet.</td></tr>
              ) : (
                timesheets.map(ts => (
                  <tr key={ts.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white">{ts.user?.firstName} {ts.user?.lastName}</div>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-blue-500" />
                        {ts.project?.name || 'Unknown Project'}
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={16} className="text-slate-400" />
                        {new Date(ts.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900 dark:text-white">{ts.hours}</span> <span className="text-slate-500">hrs</span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-sm max-w-xs truncate">
                      {ts.description || '-'}
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
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Log Hours</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Project</label>
                  <select required value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date</label>
                    <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hours</label>
                    <input type="number" step="0.5" required value={hours} onChange={e => setHours(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 4.5"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description (Optional)</label>
                  <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="What did you work on?"/>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-500">Log Time</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timesheets;
