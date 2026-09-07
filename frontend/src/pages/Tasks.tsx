import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Clock, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Tasks = () => {
  const { hasRole, user: currentUser } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM', assigneeId: currentUser?.id, dueDate: '' });

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    if (hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER')) {
      try {
        const res = await axios.get(`${API_URL}/users`);
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [currentUser]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/tasks`, { ...formData, status: 'TODO' });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', priority: 'MEDIUM', assigneeId: currentUser?.id, dueDate: '' });
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error creating task');
    }
  };

  const toggleStatus = async (task: any) => {
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    try {
      await axios.patch(`${API_URL}/tasks/${task.id}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'HIGH') return <AlertCircle size={16} className="text-red-400" />;
    return <Clock size={16} className="text-blue-400" />;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <CheckSquare className="text-blue-500" size={32} />
            {hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN') ? 'Company Tasks' : 'My Tasks'}
          </h2>
          <p className="text-slate-500 mt-1">Manage tasks and assignments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white"
        >
          <Plus size={18} /> Add Task
        </button>
      </header>

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 text-slate-500 text-sm font-medium bg-white">
          <div className="col-span-5 md:col-span-5">Task Name</div>
          <div className="col-span-3 hidden md:block">Assignee</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Due</div>
        </div>

        <div className="divide-y divide-slate-100">
          {tasks.map((task, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              key={task.id} 
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors group"
            >
              <div className="col-span-5 md:col-span-5 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={task.status === 'DONE'} 
                  onChange={() => toggleStatus(task)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500/50 cursor-pointer" 
                />
                <div className="truncate">
                  <span className={`font-medium ${task.status === 'DONE' ? 'text-slate-400 line-through' : 'text-slate-900 group-hover:text-blue-600 transition-colors'}`}>
                    {task.title}
                  </span>
                </div>
                <div className="shrink-0">{getPriorityIcon(task.priority)}</div>
              </div>
              <div className="col-span-3 hidden md:block text-slate-500 text-sm truncate">
                {task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned'}
              </div>
              <div className="col-span-2">
                <span className={`text-xs px-2 py-1 rounded-md border font-medium ${
                  task.status === 'TODO' ? 'text-slate-500 border-slate-200 bg-slate-50' :
                  task.status === 'IN_PROGRESS' ? 'text-blue-600 border-blue-200 bg-blue-50' :
                  'text-green-600 border-green-200 bg-green-50'
                }`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              <div className="col-span-2 text-right text-sm text-slate-500 whitespace-nowrap">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">Create Task</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                
                {hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.assigneeId} onChange={e => setFormData({...formData, assigneeId: e.target.value})}
                    >
                      <option value={currentUser?.id}>Myself ({currentUser?.firstName})</option>
                      {employees.filter(e => e.id !== currentUser?.id).map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.role})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 mt-6"
                >
                  Create Task
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
