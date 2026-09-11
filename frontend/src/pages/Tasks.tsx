import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Clock, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Tasks = () => {
  const { hasRole, user: currentUser } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM', assigneeId: currentUser?.id, teamId: '', dueDate: '' });

  const isEmployeeOnly = !hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN', 'MANAGER');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsersAndTeams = async () => {
    if (!isEmployeeOnly) {
      try {
        const resUsers = await axios.get(`${API_URL}/users`);
        setEmployees(resUsers.data);
        const resTeams = await axios.get(`${API_URL}/teams`);
        setTeams(resTeams.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsersAndTeams();
  }, [currentUser]);

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setSelectedTask(null);
    setFormData({ title: '', description: '', priority: 'MEDIUM', assigneeId: currentUser?.id, teamId: '', dueDate: '' });
    setIsModalOpen(true);
  };

  const handleOpenTask = (task: any) => {
    setSelectedTask(task);
    setIsEditMode(!isEmployeeOnly);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      assigneeId: task.assigneeId || '',
      teamId: '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error deleting task');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmployeeOnly) return; 

    try {
      const payload: any = { ...formData, status: 'TODO' };
      // If teamId is selected, assigneeId should be empty
      if (formData.teamId) {
        payload.assigneeId = null;
      } else {
        payload.teamId = null;
      }

      if (selectedTask && isEditMode) {
        await axios.put(`${API_URL}/tasks/${selectedTask.id}`, { ...payload, status: selectedTask.status });
      } else {
        await axios.post(`${API_URL}/tasks`, payload);
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error saving task');
    }
  };

  const toggleStatus = async (task: any, e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div className="p-8 max-w-6xl mx-auto relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <CheckSquare className="text-blue-500" size={32} />
            {hasRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN') ? 'Company Tasks' : 'My Tasks'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage tasks and assignments.</p>
        </div>
        {!isEmployeeOnly && (
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white"
          >
            <Plus size={18} /> Add Task
          </button>
        )}
      </header>

      <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm font-medium bg-white dark:bg-slate-900">
          <div className="col-span-4 md:col-span-4">Task Name</div>
          <div className="col-span-2 hidden md:block">Assigned By</div>
          <div className="col-span-2 hidden md:block">Assigned To</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Due</div>
        </div>

        <div className="divide-y divide-slate-100">
          {tasks.map((task, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              key={task.id} 
              onClick={() => handleOpenTask(task)}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div onClick={(e) => toggleStatus(task, e)}>
                  <input 
                    type="checkbox" 
                    checked={task.status === 'DONE'} 
                    readOnly
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-500 focus:ring-blue-500/50 cursor-pointer pointer-events-none" 
                  />
                </div>
                <div className="truncate flex-1">
                  <span className={`font-medium ${task.status === 'DONE' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors'}`}>
                    {task.title}
                  </span>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {getPriorityIcon(task.priority)}
                  {(hasRole('HR') || (hasRole('MANAGER') && task.createdById === currentUser?.id)) && (
                    <button 
                      onClick={(e) => handleDelete(task.id, e)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Delete Task"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
              <div className="col-span-2 hidden md:block text-slate-500 dark:text-slate-400 text-sm truncate">
                {task.createdBy ? `${task.createdBy.firstName} ${task.createdBy.lastName}` : 'System'}
              </div>
              <div className="col-span-2 hidden md:block text-slate-500 dark:text-slate-400 text-sm truncate">
                {task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unassigned'}
              </div>
              <div className="col-span-2">
                <span className={`text-xs px-2 py-1 rounded-md border font-medium ${
                  task.status === 'TODO' ? 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800' :
                  task.status === 'IN_PROGRESS' ? 'text-blue-600 border-blue-200 bg-blue-50' :
                  'text-green-600 border-green-200 bg-green-50'
                }`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              <div className="col-span-2 text-right text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
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
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  {selectedTask ? (isEmployeeOnly ? 'View Task' : 'Edit Task') : 'Create Task'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input required type="text" 
                    readOnly={isEmployeeOnly}
                    className={`w-full border rounded-xl px-4 py-2 transition-all ${isEmployeeOnly ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`}
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description / Instructions</label>
                  <textarea 
                    rows={3}
                    readOnly={isEmployeeOnly}
                    placeholder={isEmployeeOnly ? "No description provided." : "Enter detailed instructions for this task..."}
                    className={`w-full border rounded-xl px-4 py-2 transition-all resize-none ${isEmployeeOnly ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`}
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                
                {!isEmployeeOnly && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign To</label>
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={formData.teamId ? `team_${formData.teamId}` : formData.assigneeId} 
                      onChange={e => {
                        const val = e.target.value;
                        if (val.startsWith('team_')) {
                          setFormData({...formData, teamId: val.replace('team_', ''), assigneeId: ''});
                        } else {
                          setFormData({...formData, assigneeId: val, teamId: ''});
                        }
                      }}
                    >
                      <optgroup label="Individuals">
                        <option value={currentUser?.id}>Myself ({currentUser?.firstName})</option>
                        {employees
                          .filter(emp => emp.id !== currentUser?.id)
                          .filter(emp => {
                            const roleRanks: Record<string, number> = { 'EMPLOYEE': 1, 'MANAGER': 2, 'HR': 3, 'COMPANY_ADMIN': 4, 'SUPER_ADMIN': 5 };
                            const myRank = roleRanks[currentUser?.role || ''] || 0;
                            const empRank = roleRanks[emp.role || emp.userRoles?.[0]?.role?.name || ''] || 0;
                            return empRank <= myRank;
                          })
                          .map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.role || emp.userRoles?.[0]?.role?.name})</option>
                          ))}
                      </optgroup>
                      {!isEditMode && teams.length > 0 && (
                        <optgroup label="Teams (Creates individual tasks)">
                          {teams.map(team => (
                            <option key={team.id} value={`team_${team.id}`}>{team.name}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>
                )}
                
                {isEmployeeOnly && selectedTask?.assignee && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assigned To</label>
                    <input type="text" readOnly className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-700 dark:text-slate-300" 
                      value={`${selectedTask.assignee.firstName} ${selectedTask.assignee.lastName}`} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                    <select 
                      disabled={isEmployeeOnly}
                      className={`w-full border rounded-xl px-4 py-2 transition-all ${isEmployeeOnly ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 appearance-none cursor-default' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`}
                      value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} 
                      readOnly={isEmployeeOnly}
                      className={`w-full border rounded-xl px-4 py-2 transition-all ${isEmployeeOnly ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`}
                      value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                  </div>
                </div>

                {!isEmployeeOnly && (
                  <button 
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 mt-6"
                  >
                    {selectedTask ? 'Save Changes' : 'Create Task'}
                  </button>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
