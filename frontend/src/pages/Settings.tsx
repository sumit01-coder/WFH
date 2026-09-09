import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save, Upload, Building, CreditCard, Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { theme, setTheme } = useTheme();
  const { hasRole, user } = useAuth();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [companyData, setCompanyData] = useState<any>(null);
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    workingDays: [] as string[],
    workingHoursStart: '',
    workingHoursEnd: '',
    timezone: 'UTC'
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);

  const formatTimeForInput = (isoString: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    const h = String(d.getUTCHours()).padStart(2, '0');
    const m = String(d.getUTCMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  useEffect(() => {
    if (hasRole('COMPANY_ADMIN', 'HR') && user?.companyId) {
      axios.get(`http://localhost:5000/api/company/${user.companyId}`)
        .then(res => {
          setCompanyData(res.data);
          setProfileForm({
            name: res.data.name || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
            website: res.data.website || '',
            address: res.data.address || '',
            workingDays: res.data.workingDays || [],
            workingHoursStart: formatTimeForInput(res.data.workingHoursStart),
            workingHoursEnd: formatTimeForInput(res.data.workingHoursEnd),
            timezone: res.data.timezone || 'UTC'
          });
        })
        .catch(err => console.error('Failed to fetch company data:', err));
    }
  }, [hasRole, user?.companyId]);

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    ...(hasRole('COMPANY_ADMIN', 'HR') ? [
      { id: 'company', label: 'Company Profile', icon: Building },
      { id: 'plan', label: 'Subscription Plan', icon: CreditCard }
    ] : []),
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleLogoUpload = async () => {
    if (!logoFile || !user) return;
    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      setUploadStatus('Uploading...');
      await axios.post(`http://localhost:5000/api/company/${user.companyId}/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus('Upload successful! Please log out and log back in to see changes.');
    } catch (err) {
      console.error(err);
      setUploadStatus('Failed to upload logo.');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setIsSavingProfile(true);
      await axios.put(`http://localhost:5000/api/company/${user.companyId}`, profileForm);
      setUploadStatus('Profile updated successfully!');
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setUploadStatus('Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto relative">
      <header className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white dark:text-white">
          <SettingsIcon className="text-blue-500" size={32} />
          Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-400 mt-1">Manage your account preferences and application settings.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:bg-slate-700 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 dark:border-slate-800 p-6 md:p-8"
          >
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white dark:text-white border-b dark:border-slate-800 pb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-1">Timezone</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white dark:text-white">
                      <option>UTC (Coordinated Universal Time)</option>
                      <option>PST (Pacific Standard Time)</option>
                      <option>EST (Eastern Standard Time)</option>
                      <option>IST (Indian Standard Time)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-1">Language</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white dark:text-white">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'company' && hasRole('COMPANY_ADMIN', 'HR') && companyData && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Company Profile</h3>
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={16} /> {isSavingProfile ? 'Saving...' : 'Save Details'}
                  </button>
                </div>
                
                {uploadStatus && (
                  <div className={`p-3 rounded-xl text-sm font-medium ${uploadStatus.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {uploadStatus}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Logo</label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                          {logoFile ? (
                            <img src={URL.createObjectURL(logoFile)} alt="Preview" className="w-full h-full object-contain" />
                          ) : companyData.logoUrl ? (
                            <img src={`http://localhost:5000${companyData.logoUrl}`} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <Building className="text-slate-400" size={32} />
                          )}
                        </div>
                        <div className="flex-1">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-800 dark:file:text-slate-300 cursor-pointer"
                          />
                          <button 
                            onClick={handleLogoUpload}
                            disabled={!logoFile}
                            className="mt-2 text-sm text-blue-600 font-medium hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <Upload size={14} /> Upload New Logo
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                      <input 
                        type="text" 
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
                      />
                      <p className="text-xs text-slate-400 mt-1">This is your primary company contact email.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Website</label>
                      <input 
                        type="url" 
                        value={profileForm.website}
                        onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Office Address</label>
                  <textarea 
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white resize-none"
                  />
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700 mt-6">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Configured Working Hours</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => {
                      const isWorking = profileForm.workingDays.includes(day);
                      return (
                        <button 
                          key={day}
                          onClick={() => {
                            setProfileForm(prev => ({
                              ...prev,
                              workingDays: isWorking 
                                ? prev.workingDays.filter(d => d !== day) 
                                : [...prev.workingDays, day]
                            }));
                          }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                            isWorking 
                              ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-400' 
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="time"
                      value={profileForm.workingHoursStart}
                      onChange={e => setProfileForm({...profileForm, workingHoursStart: e.target.value})}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
                    />
                    <span className="text-slate-400 font-medium">to</span>
                    <input 
                      type="time"
                      value={profileForm.workingHoursEnd}
                      onChange={e => setProfileForm({...profileForm, workingHoursEnd: e.target.value})}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
                    />
                    <select
                      value={profileForm.timezone}
                      onChange={e => setProfileForm({...profileForm, timezone: e.target.value})}
                      className="ml-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white max-w-[120px]"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">EST</option>
                      <option value="PST">PST</option>
                      <option value="IST">IST</option>
                      <option value="CET">CET</option>
                    </select>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'plan' && hasRole('COMPANY_ADMIN', 'HR') && companyData && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b dark:border-slate-800 pb-4">Subscription & Billing</h3>
                
                <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/50 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-1">Current Plan</h4>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white capitalize flex items-baseline gap-2">
                    {companyData.subscriptionPlan}
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 mb-2">
                        <Users className="text-blue-500" size={20} />
                        <span className="font-semibold">Team Size</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Based on your {companyData.subscriptionPlan} plan limits.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 mb-2">
                        <CheckCircle2 className="text-green-500" size={20} />
                        <span className="font-semibold">Billing Cycle</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Next billing date is managed by Platform Administrator.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-purple-200/50 dark:border-purple-800/30">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Need to upgrade your plan or increase your employee limit? Please contact the platform administration team via the Chat module.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b dark:border-slate-800 pb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex-1 pr-4">
                      <div className="font-semibold text-slate-900 dark:text-white mb-1">Email Notifications</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Receive daily summaries and important alerts directly to your inbox.</div>
                    </div>
                    <button 
                      onClick={() => setEmailNotif(!emailNotif)}
                      className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 ease-in-out ${emailNotif ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`pointer-events-none absolute left-0.5 inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${emailNotif ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex-1 pr-4">
                      <div className="font-semibold text-slate-900 dark:text-white mb-1">Push Notifications</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Get real-time browser alerts for direct messages and critical task updates.</div>
                    </div>
                    <button 
                      onClick={() => setPushNotif(!pushNotif)}
                      className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 ease-in-out ${pushNotif ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <span className="sr-only">Use setting</span>
                      <span aria-hidden="true" className={`pointer-events-none absolute left-0.5 inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${pushNotif ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white dark:text-white border-b dark:border-slate-800 pb-4">Security</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-300 mb-1">Change Password</label>
                    <input type="password" placeholder="Current Password" className="w-full mb-3 bg-slate-50 dark:bg-slate-800 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white dark:text-white" />
                    <input type="password" placeholder="New Password" className="w-full bg-slate-50 dark:bg-slate-800 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white dark:text-white" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white dark:text-white border-b dark:border-slate-800 pb-4">Appearance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setTheme('light')}
                    className={`border-2 rounded-xl p-4 cursor-pointer text-center bg-white dark:bg-slate-900 shadow-sm transition-all ${theme === 'light' ? 'border-blue-500' : 'border-slate-200 dark:border-slate-800 hover:border-blue-300'}`}
                  >
                    <div className="w-full h-16 bg-slate-100 dark:bg-slate-800 rounded-lg mb-2 flex items-center justify-center text-slate-400">Light Mode</div>
                    <span className="font-medium text-slate-900 dark:text-white">Light</span>
                  </div>
                  <div 
                    onClick={() => setTheme('dark')}
                    className={`border-2 rounded-xl p-4 cursor-pointer text-center bg-slate-900 transition-all ${theme === 'dark' ? 'border-blue-500' : 'border-slate-800 hover:border-slate-600'}`}
                  >
                    <div className="w-full h-16 bg-slate-800 rounded-lg mb-2 flex items-center justify-center text-slate-500 dark:text-slate-400">Dark Mode</div>
                    <span className="font-medium text-white">Dark</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t dark:border-slate-800 flex justify-end items-center gap-4">
              {activeTab === 'company' && uploadStatus && <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{uploadStatus}</span>}
              <button 
                onClick={async () => {
                  if (activeTab === 'company') {
                    if (logoFile) await handleLogoUpload();
                    await handleSaveProfile();
                  }
                }}
                disabled={isSavingProfile}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 text-white disabled:opacity-50"
              >
                <Save size={18} /> {isSavingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
