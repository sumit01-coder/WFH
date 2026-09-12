import React, { useState, useEffect } from 'react';
import { UserPlus, Plus, X, CheckSquare, Square } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';

const Onboarding = () => {
  const { hasRole } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [employeeId, setEmployeeId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/onboarding`);
      setTasks(res.data);
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
    fetchTasks();
    if (hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN')) {
      fetchEmployees();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/onboarding`, { employeeId, title, description });
      setIsModalOpen(false);
      setEmployeeId(''); setTitle(''); setDescription('');
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create task');
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(`${API_URL}/onboarding/${id}`, { isCompleted: !currentStatus });
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update task');
    }
  };

  const canManage = hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <UserPlus className="text-blue-500" size={32} />
            Onboarding Checklist
          </h2>
          <p className="text-slate-500 mt-1">Track setup tasks for new employees</p>
        </div>
        {canManage && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white"
          >
            <Plus size={20} /> Assign Task
          </button>
        )}
      </header>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        {tasks.length === 0 ? (
          <div className="text-center text-slate-500 py-8">No onboarding tasks found.</div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className={`flex items-start gap-4 p-4 rounded-xl border ${task.isCompleted ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900/50' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'} transition-colors`}>
                <button onClick={() => toggleTask(task.id, task.isCompleted)} className="mt-1 flex-shrink-0 text-slate-400 hover:text-blue-600 transition-colors">
                  {task.isCompleted ? <CheckSquare size={24} className="text-green-500" /> : <Square size={24} />}
                </button>
                <div className="flex-1">
                  <h4 className={`font-semibold text-lg ${task.isCompleted ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>{task.title}</h4>
                  {task.description && <p className={`text-sm mt-1 ${task.isCompleted ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>{task.description}</p>}
                  {canManage && (
                    <div className="mt-3 text-xs font-medium text-slate-500 flex items-center gap-2">
                      <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md">Assigned to: {task.user?.firstName} {task.user?.lastName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Assign Onboarding Task</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Hire</label>
                  <select required value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select an Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Task Title</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Set up email account"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description (Optional)</label>
                  <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Task details..."/>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-500">Assign Task</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
