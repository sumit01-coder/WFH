import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save, Upload, Building, CreditCard, Users, CheckCircle2, DownloadCloud, Laptop, Pin, Rocket, Mail, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useDesktop } from '../contexts/DesktopContext';
import axios from 'axios';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { theme, setTheme } = useTheme();
  const { hasRole, user } = useAuth();
  const { isElectron, alwaysOnTop, setAlwaysOnTop, autoLaunch, setAutoLaunch, showNotification } = useDesktop();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [companyData, setCompanyData] = useState<any>(null);
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState<string | null>(null);
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    workingDays: [] as string[],
    workingHoursStart: '',
    workingHoursEnd: '',
    breakStart: '',
    breakEnd: '',
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
      axios.get(`https://api-worknexus.virtuallabsimulator.com/api/company/${user.companyId}`)
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
            breakStart: formatTimeForInput(res.data.breakStart),
            breakEnd: formatTimeForInput(res.data.breakEnd),
            timezone: res.data.timezone || 'UTC'
          });
        })
        .catch(err => console.error('Failed to fetch company data:', err));
    }

    // Fetch Gmail connection status
    axios.get('https://api-worknexus.virtuallabsimulator.com/api/integrations/google/status', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setIsGmailConnected(res.data.connected);
        setGmailEmail(res.data.email);
      })
      .catch(err => console.error('Failed to fetch Gmail status:', err));
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
    { id: 'integrations', label: 'Integrations', icon: Rocket },
  ];

  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('github_pat') || '');
  
  const handleSaveGithubToken = () => {
    localStorage.setItem('github_pat', githubToken);
    setUploadStatus('GitHub Token saved successfully!');
    setTimeout(() => setUploadStatus(''), 3000);
  };

  const handleLogoUpload = async () => {
    if (!logoFile || !user) return;
    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      setUploadStatus('Uploading...');
      await axios.post(`https://api-worknexus.virtuallabsimulator.com/api/company/${user.companyId}/logo`, formData, {
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
      await axios.put(`https://api-worknexus.virtuallabsimulator.com/api/company/${user.companyId}`, profileForm);
      setUploadStatus('Profile updated successfully!');
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setUploadStatus('Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleConnectGmail = async () => {
    try {
      const res = await axios.get('https://api-worknexus.virtuallabsimulator.com/api/integrations/google/auth', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error('Failed to initiate Gmail connection:', error);
    }
  };

  const handleDisconnectGmail = async () => {
    try {
      await axios.post('https://api-worknexus.virtuallabsimulator.com/api/integrations/google/disconnect', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsGmailConnected(false);
      setGmailEmail(null);
    } catch (error) {
      console.error('Failed to disconnect Gmail:', error);
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
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>

                {/* Desktop App Updates Section */}
                {!!(window as any).desktopUpdater && (
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <DownloadCloud size={18} className="text-blue-500" />
                      Desktop Application Updates
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Keep your WorkNexus desktop app up to date to get the latest features and security fixes.
                    </p>
                    <button
                      onClick={() => (window as any).desktopUpdater.checkForUpdates()}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors text-sm"
                    >
                      Check for Updates Now
                    </button>
                  </div>
                )}

                {/* Desktop Native Integrations Section */}
                {isElectron && (
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Laptop size={18} className="text-purple-500" />
                      Desktop Integrations
                    </h4>
                    <div className="space-y-4">

                      {/* Auto-Launch Toggle */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Rocket size={18} className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">Launch on System Startup</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Automatically open WorkNexus when Windows starts</p>
                          </div>
                        </div>
                        <button
                          id="toggle-auto-launch"
                          onClick={() => setAutoLaunch(!autoLaunch)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            autoLaunch ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            autoLaunch ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      {/* Always-on-Top Toggle */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Pin size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">Focus Mode (Always on Top)</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Keep WorkNexus window above all other applications</p>
                          </div>
                        </div>
                        <button
                          id="toggle-always-on-top"
                          onClick={() => setAlwaysOnTop(!alwaysOnTop)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            alwaysOnTop ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            alwaysOnTop ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      {/* Test Notification */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Bell size={18} className="text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">Native OS Notifications</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Get Windows Action Center alerts for tasks and messages</p>
                          </div>
                        </div>
                        <button
                          id="test-notification"
                          onClick={() => showNotification('WorkNexus', 'âœ… Native notifications are working!')}
                          className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                        >
                          Test
                        </button>
                      </div>

                      <p className="text-xs text-slate-400 dark:text-slate-600 flex items-center gap-1">
                        <span>Ã¢Å’Â¨Ã¯Â¸Â</span> <strong>Tip:</strong> Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300 font-mono">Ctrl+Shift+W</kbd> from anywhere to instantly show/hide the app.
                      </p>
                    </div>
                  </div>
                )}
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
                            <img src={`https://api-worknexus.virtuallabsimulator.com${companyData.logoUrl}`} alt="Logo" className="w-full h-full object-contain" />
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
                  {/* Working Hours */}
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

                  {/* Lunch Break Time */}
                  <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-3">
                      <Coffee size={18} className="text-slate-500" />
                      <h5 className="text-sm font-bold text-slate-800 dark:text-white">Lunch Break</h5>
                      <span className="ml-auto text-xs text-slate-400">optional</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        id="lunch-break-start"
                        type="time"
                        value={profileForm.breakStart}
                        onChange={e => setProfileForm({...profileForm, breakStart: e.target.value})}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 text-slate-900 dark:text-white"
                      />
                      <span className="text-slate-400 font-medium">to</span>
                      <input
                        id="lunch-break-end"
                        type="time"
                        value={profileForm.breakEnd}
                        onChange={e => setProfileForm({...profileForm, breakEnd: e.target.value})}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 text-slate-900 dark:text-white"
                      />
                      {(profileForm.breakStart || profileForm.breakEnd) && (
                        <button
                          onClick={() => setProfileForm({...profileForm, breakStart: '', breakEnd: ''})}
                          className="ml-auto text-xs text-red-400 hover:text-red-500 font-medium transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Lunch break is automatically excluded from total working hours calculation.
                    </p>
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

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b dark:border-slate-800 pb-4">Integrations</h3>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">GH</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">GitHub API Access</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Add a Personal Access Token to fetch commits and issues from private repositories.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Personal Access Token (PAT)</label>
                      <input 
                        type="password" 
                        placeholder="ghp_xxxxxxxxxxxxxxxxx" 
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        This token is securely stored in your local browser and is never sent to our backend.
                      </p>
                    </div>
                    
                    <button 
                      onClick={handleSaveGithubToken}
                      className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors shadow-sm"
                    >
                      Save GitHub Token
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                      <Mail className="text-red-500" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">Gmail Integration</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Connect your Gmail account to enable deeper email integrations directly from WorkNexus.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      {isGmailConnected ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                          <CheckCircle2 size={18} /> Connected as {gmailEmail}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-500 dark:text-slate-400">Not connected</div>
                      )}
                    </div>
                    <button
                      onClick={isGmailConnected ? handleDisconnectGmail : handleConnectGmail}
                      className={`px-4 py-2 font-semibold rounded-xl transition-colors shadow-sm ${
                        isGmailConnected 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50' 
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {isGmailConnected ? 'Disconnect' : 'Connect Gmail'}
                    </button>
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
