import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const { login } = useAuth();
  const navigate = useNavigate();
  const isDesktop = !!(window as any).ipcRenderer;

  // Check server connectivity on mount (and only for desktop app)
  React.useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get(`${API_URL}/health`, { timeout: 4000 });
        setServerStatus('online');
      } catch {
        setServerStatus('offline');
      }
    };
    checkServer();
    // Re-check every 10 seconds if offline
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // First, check connectivity before even trying to log in
    if (serverStatus === 'offline') {
      setError('Cannot connect to the server. Please ensure the backend is running and try again.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      login(response.data.tokens.accessToken, response.data.user);
      navigate('/');
    } catch (err: any) {
      // Distinguish between network errors and auth errors
      if (!err.response) {
        // No response = server is unreachable (network error / CORS / server down)
        setServerStatus('offline');
        setError('Cannot connect to the server. Please check your network connection or ensure the WorkNexus server is running.');
      } else if (err.response.status === 401 || err.response.status === 403) {
        setError(err.response.data?.error || 'Invalid email or password. Please try again.');
      } else {
        setError(err.response.data?.error || 'Something went wrong. Please try again.');
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white overflow-hidden relative">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-sm backdrop-blur-xl border border-slate-200 dark:border-slate-800 z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <img src="./logo.png" alt="Logo" className="w-16 h-16 object-contain mb-4 mx-auto" />
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your WorkNexus account</p>
        </div>

        {/* Server Status Indicator */}
        <div className={`mb-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-500 ${
          serverStatus === 'online'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
            : serverStatus === 'offline'
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500 dark:text-red-400'
            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
        }`}>
          {serverStatus === 'online' && <Wifi size={14} className="shrink-0" />}
          {serverStatus === 'offline' && <WifiOff size={14} className="shrink-0" />}
          {serverStatus === 'checking' && <Loader2 size={14} className="shrink-0 animate-spin" />}
          <span className="flex-1">
            {serverStatus === 'online' && 'Server Connected'}
            {serverStatus === 'offline' && 'Server Unreachable â€” Please start the backend and try again'}
            {serverStatus === 'checking' && 'Checking server connection...'}
          </span>
          {serverStatus === 'offline' && (
            <button
              type="button"
              onClick={async () => {
                setServerStatus('checking');
                try {
                  await axios.get(`${API_URL}/health`, { timeout: 4000 });
                  setServerStatus('online');
                  setError('');
                } catch {
                  setServerStatus('offline');
                }
              }}
              className="ml-auto underline text-red-500 hover:text-red-400 transition-colors whitespace-nowrap"
            >
              Retry
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder-gray-500"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder-gray-500"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={serverStatus === 'offline' || serverStatus === 'checking'}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600"
          >
            {serverStatus === 'checking' ? (
              <><Loader2 size={18} className="mr-2 animate-spin" /> Connecting...</>
            ) : serverStatus === 'offline' ? (
              <><WifiOff size={18} className="mr-2" /> Server Offline</>
            ) : (
              <>Sign In <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        {isDesktop ? (
          <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs text-center space-y-2 shadow-inner">
            <p className="font-semibold text-slate-800 dark:text-slate-200">Desktop Application License</p>
            <p>By logging in, you agree to the WorkNexus End User License Agreement and our privacy policy.</p>
            <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700/50">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Required Permissions:</p>
              <ul className="text-left list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400 pl-2">
                <li>Read Active Window Title (for Activity Monitor)</li>
                <li>Capture Screen (for periodic Screenshots)</li>
                <li>Background Execution (for precise time tracking)</li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-center text-slate-500 dark:text-slate-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium transition-colors">
              Register your company
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
