import React, { useState, useEffect } from 'react';
import { Building2, Plus, Globe, CheckCircle2, XCircle, Users, Mail, Loader2, Calendar, CreditCard, X, Check, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';

const SuperAdminPanel = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Plan Modal State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', price: '', billingCycle: 'monthly', features: '' });

  // Company Details Modal State
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/company`);
        setCompanies(response.data);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to load companies.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleStartChat = async (targetUserId: string) => {
    try {
      const response = await axios.post(`${API_URL}/chat/direct`, { targetUserId });
      if (response.data && response.data.id) {
        navigate(`/chat?roomId=${response.data.id}`);
      }
    } catch (err) {
      console.error('Error creating direct chat:', err);
      alert('Failed to start chat. Please try again.');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <Globe className="text-purple-600" size={32} />
            Platform Administration
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all registered companies and their subscriptions.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlanModalOpen(true)}
            className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl font-medium transition-colors text-slate-700 dark:text-white flex items-center gap-2"
          >
            <CreditCard size={18} className="text-purple-600" /> Add Plan
          </button>
          <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-purple-500/20 text-white flex items-center gap-2">
            <Plus size={18} /> New Company
          </button>
        </div>
      </header>

      {/* Subscription Plans Section */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <CreditCard className="text-purple-600" size={24} />
          Active Subscription Plans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Starter Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col relative overflow-hidden"
          >
            <div className="mb-4">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Starter</h4>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">â‚¹499</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/mo</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Users size={16} className="text-blue-500" />
                10 to 50 Employees
              </div>
            </div>
            <div className="flex-1">
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 mb-6">
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5"/> Basic HR Features</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5"/> Standard Support</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5"/> 5GB Storage</li>
              </ul>
            </div>
          </motion.div>

          {/* Professional Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-purple-600 shadow-md border border-purple-500 rounded-2xl p-6 flex flex-col relative overflow-hidden text-white"
          >
            <div className="absolute top-0 right-0 bg-white/20 px-3 py-1 rounded-bl-xl text-xs font-bold tracking-wider">POPULAR</div>
            <div className="mb-4">
              <h4 className="text-lg font-bold text-white">Professional</h4>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">â‚¹999</span>
                <span className="text-sm font-medium text-purple-200">/mo</span>
              </div>
            </div>
            <div className="bg-purple-500/50 rounded-xl p-4 mb-4 border border-purple-400/30">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Users size={16} className="text-purple-200" />
                10 to 199 Employees
              </div>
            </div>
            <div className="flex-1">
              <ul className="space-y-3 text-sm text-purple-100 mb-6">
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-white shrink-0 mt-0.5"/> Advanced HR & Payroll</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-white shrink-0 mt-0.5"/> Priority Support</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-white shrink-0 mt-0.5"/> 50GB Storage</li>
              </ul>
            </div>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col relative overflow-hidden"
          >
            <div className="mb-4">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise</h4>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">â‚¹1599</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/mo</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Users size={16} className="text-blue-500" />
                10 to 499 Employees
              </div>
            </div>
            <div className="flex-1">
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 mb-6">
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5"/> Custom Integrations</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5"/> 24/7 Dedicated Manager</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5"/> Unlimited Storage</li>
              </ul>
            </div>
          </motion.div>

        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Building2 className="text-purple-600" size={24} />
        Registered Companies
      </h3>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-purple-600" size={48} />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-200">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={company.id}
              onClick={() => setSelectedCompany(company)}
              className="bg-white dark:bg-slate-900 shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all flex flex-col cursor-pointer hover:border-purple-300 dark:hover:border-purple-500/50"
            >
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {company.logoUrl ? (
                      <img src={`https://api-worknexus.virtuallabsimulator.com${company.logoUrl}`} alt="Logo" className="w-12 h-12 rounded-xl object-contain bg-slate-50 dark:bg-slate-800" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                        <Building2 size={24} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{company.name}</h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        {company.subscriptionPlan} Plan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1 flex items-center gap-1"><Users size={14}/> Employees</div>
                    <div className="font-bold text-slate-900 dark:text-white text-lg">{company.employeeCount}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1 flex items-center gap-1"><Calendar size={14}/> Registered</div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {company.admin && (
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase font-semibold tracking-wider">Company Admin</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {company.admin.firstName[0]}{company.admin.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{company.admin.firstName} {company.admin.lastName}</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStartChat(company.admin.id); }}
                        className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 rounded-lg transition-colors"
                        title="Direct Message Admin"
                      >
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      <AnimatePresence>
        {isPlanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="text-purple-600" size={24} />
                  Create Subscription Plan
                </h3>
                <button 
                  onClick={() => setIsPlanModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Plan Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Enterprise Pro"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 dark:text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={newPlan.price}
                        onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Billing Cycle</label>
                    <select 
                      value={newPlan.billingCycle}
                      onChange={(e) => setNewPlan({...newPlan, billingCycle: e.target.value})}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 dark:text-white"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="annually">Annually</option>
                      <option value="lifetime">Lifetime</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Features (comma separated)</label>
                  <textarea 
                    placeholder="Unlimited Users, API Access, Premium Support..."
                    rows={3}
                    value={newPlan.features}
                    onChange={(e) => setNewPlan({...newPlan, features: e.target.value})}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 dark:text-white resize-none"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert('Plan creation would be sent to the backend API here.');
                    setIsPlanModalOpen(false);
                  }}
                  className="px-5 py-2.5 rounded-xl font-medium bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20 transition-colors flex items-center gap-2"
                >
                  <Check size={18} /> Create Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Company Details Modal */}
      <AnimatePresence>
        {selectedCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-4">
                  {selectedCompany.logoUrl ? (
                    <img src={`https://api-worknexus.virtuallabsimulator.com${selectedCompany.logoUrl}`} alt="Logo" className="w-16 h-16 rounded-xl object-contain bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center shadow-sm">
                      <Building2 size={32} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {selectedCompany.name}
                      {selectedCompany.isActive ? (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 tracking-wide uppercase">Active</span>
                      ) : (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 tracking-wide uppercase">Inactive</span>
                      )}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{selectedCompany.website || 'No website provided'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCompany(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <Mail className="text-slate-400" size={18} />
                        <span className="font-medium">{selectedCompany.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <Globe className="text-slate-400" size={18} />
                        <span className="font-medium">{selectedCompany.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                        <Building2 className="text-slate-400 mt-1 shrink-0" size={18} />
                        <span className="font-medium leading-relaxed">{selectedCompany.address || 'Address not provided'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Company Admin</h4>
                    {selectedCompany.admin ? (
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {selectedCompany.admin.firstName} {selectedCompany.admin.lastName}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {selectedCompany.admin.email}
                          </div>
                        </div>
                        <button 
                          onClick={() => { setSelectedCompany(null); handleStartChat(selectedCompany.admin.id); }}
                          className="p-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                          title="Message Admin"
                        >
                          <MessageSquare size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500 italic">No admin assigned</div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Platform Details</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="text-slate-500 text-xs font-medium mb-1">Plan</div>
                        <div className="font-bold text-slate-900 dark:text-white capitalize">{selectedCompany.subscriptionPlan}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="text-slate-500 text-xs font-medium mb-1">Employees</div>
                        <div className="font-bold text-slate-900 dark:text-white">{selectedCompany.employeeCount} Total</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="text-slate-500 text-xs font-medium mb-1">Timezone</div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{selectedCompany.timezone}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="text-slate-500 text-xs font-medium mb-1">Registered</div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {new Date(selectedCompany.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Working Hours</h4>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => {
                          const isWorking = selectedCompany.workingDays?.includes(day);
                          return (
                            <span 
                              key={day} 
                              className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                                isWorking 
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                                  : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                              }`}
                            >
                              {day}
                            </span>
                          );
                        })}
                      </div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span>{selectedCompany.workingHoursStart ? new Date(selectedCompany.workingHoursStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', timeZone: 'UTC'}) : '09:00 AM'}</span>
                        <span className="text-slate-400">-</span>
                        <span>{selectedCompany.workingHoursEnd ? new Date(selectedCompany.workingHoursEnd).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', timeZone: 'UTC'}) : '06:00 PM'}</span>
                        <span className="ml-2 text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">{selectedCompany.timezone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedCompany(null)}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SuperAdminPanel;
