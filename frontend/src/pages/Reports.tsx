import React, { useState, useEffect } from 'react';
import { FileText, Plus, X, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';

const Reports = () => {
  const { user, hasRole } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [completedWork, setCompletedWork] = useState('');
  const [wip, setWip] = useState('');
  const [blockers, setBlockers] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [hoursWorked, setHoursWorked] = useState<number | ''>('');
  
  const [reviewComments, setReviewComments] = useState('');

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_URL}/reports`);
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/reports`, { date, completedWork, wip, blockers, tomorrowPlan, hoursWorked: Number(hoursWorked) });
      setIsModalOpen(false);
      setCompletedWork(''); setWip(''); setBlockers(''); setTomorrowPlan(''); setHoursWorked('');
      fetchReports();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit report');
    }
  };

  const handleReview = async () => {
    try {
      await axios.put(`${API_URL}/reports/${selectedReport.id}/review`, { status: 'REVIEWED', reviewComments });
      setIsReviewModalOpen(false);
      setSelectedReport(null);
      setReviewComments('');
      fetchReports();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to review report');
    }
  };

  const canReview = hasRole('HR', 'MANAGER', 'COMPANY_ADMIN', 'SUPER_ADMIN');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="text-blue-500" size={32} />
            Daily Work Reports
          </h2>
          <p className="text-slate-500 mt-1">Submit and track daily progress</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white"
        >
          <Plus size={20} /> Submit Report
        </button>
      </header>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Employee</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Hours</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                {canReview && <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Action</th>}
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No reports found.</td></tr>
              ) : (
                reports.map(report => (
                  <tr key={report.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white">{report.user?.firstName} {report.user?.lastName}</div>
                      <div className="text-xs text-slate-500">{report.user?.email}</div>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{new Date(report.date).toLocaleDateString()}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{report.hoursWorked} hrs</td>
                    <td className="p-4">
                      {report.status === 'REVIEWED' ? 
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-max"><CheckCircle size={14}/> Reviewed</span> : 
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1 w-max"><Clock size={14}/> Submitted</span>
                      }
                    </td>
                    {canReview && (
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => { setSelectedReport(report); setIsReviewModalOpen(true); }}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View / Review
                        </button>
                      </td>
                    )}
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
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Submit Work Report</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <form onSubmit={handleSubmitReport} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Date</label>
                    <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hours Worked</label>
                    <input type="number" step="0.5" required value={hoursWorked} onChange={e => setHoursWorked(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 8"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Completed Work</label>
                  <textarea required rows={3} value={completedWork} onChange={e => setCompletedWork(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="What did you finish today?"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Work in Progress (Optional)</label>
                  <textarea rows={2} value={wip} onChange={e => setWip(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="What is still ongoing?"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Blockers (Optional)</label>
                  <textarea rows={2} value={blockers} onChange={e => setBlockers(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Any issues or blockers?"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Plan for Tomorrow (Optional)</label>
                  <textarea rows={2} value={tomorrowPlan} onChange={e => setTomorrowPlan(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="What are your goals for tomorrow?"/>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-500">Submit</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isReviewModalOpen && selectedReport && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Review Report</h3>
                <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
                  <div><span className="font-semibold text-slate-700 dark:text-slate-300">Completed:</span> <p className="text-sm mt-1 whitespace-pre-wrap">{selectedReport.completedWork}</p></div>
                  {selectedReport.wip && <div><span className="font-semibold text-slate-700 dark:text-slate-300">WIP:</span> <p className="text-sm mt-1 whitespace-pre-wrap">{selectedReport.wip}</p></div>}
                  {selectedReport.blockers && <div><span className="font-semibold text-red-600 dark:text-red-400">Blockers:</span> <p className="text-sm mt-1 whitespace-pre-wrap">{selectedReport.blockers}</p></div>}
                  {selectedReport.tomorrowPlan && <div><span className="font-semibold text-slate-700 dark:text-slate-300">Tomorrow's Plan:</span> <p className="text-sm mt-1 whitespace-pre-wrap">{selectedReport.tomorrowPlan}</p></div>}
                </div>
                
                {selectedReport.status === 'REVIEWED' ? (
                   <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800/30">
                     <p className="text-sm font-semibold text-green-700 dark:text-green-400">Reviewed by {selectedReport.reviewedBy?.firstName}</p>
                     {selectedReport.reviewComments && <p className="text-sm text-green-600 dark:text-green-500 mt-1">"{selectedReport.reviewComments}"</p>}
                   </div>
                ) : canReview && selectedReport.userId !== user?.id && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Manager Comments (Optional)</label>
                    <textarea rows={2} value={reviewComments} onChange={e => setReviewComments(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Feedback..."/>
                    <button onClick={handleReview} className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-500">Mark as Reviewed</button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;
