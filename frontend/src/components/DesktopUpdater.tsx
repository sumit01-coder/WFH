import React, { useState, useEffect } from 'react';
import { DownloadCloud, RefreshCw, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DesktopUpdater = () => {
  const isDesktop = !!(window as any).desktopUpdater;
  
  const [status, setStatus] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isDesktop) return;

    const updater = (window as any).desktopUpdater;
    
    updater.onUpdaterMessage((data: any) => {
      console.log('Updater message:', data);
      
      switch (data.status) {
        case 'checking':
          setStatus('Checking for updates...');
          setVisible(true);
          break;
        case 'update-available':
          setStatus(`Update available: ${data.info.version}`);
          setVisible(true);
          break;
        case 'update-not-available':
          setStatus('You are on the latest version.');
          // Auto-hide after 3s if no update
          setTimeout(() => setVisible(false), 3000);
          break;
        case 'downloading':
          setStatus('Downloading update...');
          setProgress(data.percent || 0);
          setVisible(true);
          break;
        case 'update-downloaded':
          setStatus('Update ready to install!');
          setProgress(100);
          setVisible(true);
          break;
        case 'error':
          setError(data.error);
          setStatus('Update failed');
          setVisible(true);
          break;
      }
    });

    return () => {
      updater.removeListeners();
    };
  }, [isDesktop]);

  if (!isDesktop || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-4 w-80"
      >
        <button onClick={() => setVisible(false)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X size={16} />
        </button>
        
        <div className="flex items-start gap-3">
          {status === 'Update ready to install!' ? (
            <CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
          ) : error ? (
            <AlertCircle className="text-red-500 shrink-0 mt-1" size={20} />
          ) : status === 'Checking for updates...' || status.startsWith('Downloading') ? (
            <RefreshCw className="text-blue-500 shrink-0 mt-1 animate-spin" size={20} />
          ) : (
            <DownloadCloud className="text-blue-500 shrink-0 mt-1" size={20} />
          )}
          
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{status}</h4>
            
            {status.startsWith('Downloading') && (
              <div className="mt-2 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            
            {error && <p className="text-xs text-red-500 mt-1 line-clamp-2">{error}</p>}
            
            {status === 'Update ready to install!' && (
              <button 
                onClick={() => (window as any).desktopUpdater.installUpdate()}
                className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Restart & Install
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
