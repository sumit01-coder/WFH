import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Monitor, FileText, ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// Replace with actual repository owner/name if different
const GITHUB_REPO = 'sumit01-coder/WFH'; 

const DownloadPage = () => {
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await axios.get(`https://api.github.com/repos/${GITHUB_REPO}/releases`);
        setReleases(response.data);
      } catch (err: any) {
        console.error('Failed to fetch releases from GitHub', err);
        setError('Could not load releases at this time. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-blue-500/30">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 group">
            <ArrowLeft className="text-slate-400 group-hover:text-blue-600 transition-colors" size={24} />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              WorkNexus
            </span>
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full mb-6 shadow-sm border border-blue-200 dark:border-blue-800">
            <Monitor size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Download Desktop App
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Get the latest versions of WorkNexus for Windows. Stay updated with our newest features and improvements.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-500">Fetching latest releases...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center border border-red-200 dark:border-red-800">
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {releases.map((release, index) => {
              // Find a Windows asset (e.g., .exe)
              const winAsset = release.assets?.find((a: any) => a.name.endsWith('.exe') || a.name.endsWith('-setup.zip'));
              const downloadUrl = winAsset ? winAsset.browser_download_url : release.html_url;

              return (
                <motion.div 
                  key={release.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden"
                >
                  {index === 0 && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-sm">
                      LATEST
                    </div>
                  )}
                  
                  <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {release.name || release.tag_name}
                        </h2>
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-600">
                          {release.tag_name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                        <span className="flex items-center gap-1.5"><Clock size={16} /> {formatDate(release.published_at)}</span>
                      </div>

                      {release.body && (
                        <div className="prose dark:prose-invert prose-sm max-w-none text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                          <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-500 flex items-center gap-2">
                            <FileText size={14} /> Release Notes
                          </h4>
                          <div className="text-sm leading-relaxed prose dark:prose-invert prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-li:my-0">
                            <ReactMarkdown>{release.body}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex flex-col gap-3">
                      <a 
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 transform hover:-translate-y-1 flex items-center justify-center gap-2 w-full md:w-auto"
                      >
                        <Download size={20} />
                        Download for Windows
                      </a>
                      
                      {winAsset && (
                        <div className="text-center text-xs text-slate-500 flex flex-col items-center justify-center">
                          <span className="font-mono">{winAsset.name}</span>
                          <span className="opacity-70 mt-0.5">{(winAsset.size / (1024 * 1024)).toFixed(1)} MB</span>
                        </div>
                      )}
                      
                      <a href={release.html_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 text-center flex items-center justify-center gap-1 mt-2">
                        View on GitHub
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {releases.length === 0 && !loading && !error && (
              <div className="text-center py-20 text-slate-500">
                No releases found for this repository.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DownloadPage;
