import React, { useState, useEffect } from 'react';
import { Building2, Plus, Globe, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SuperAdminPanel = () => {
  const [companies, setCompanies] = useState<any[]>([]);

  // We could fetch companies from the backend here later

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
            <Globe className="text-purple-600" size={32} />
            Platform Administration
          </h2>
          <p className="text-slate-500 mt-1">Manage all companies and global settings.</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-purple-500/20 text-white flex items-center gap-2">
          <Plus size={18} /> New Company
        </button>
      </header>

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden backdrop-blur-sm p-8 text-center">
        <Globe className="text-slate-200 mx-auto mb-4" size={48} />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Company Management Module</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          This panel is restricted to SUPER_ADMINs. In the full implementation, you'll be able to view all tenant companies, pause their subscriptions, and create new company accounts here.
        </p>
      </div>
    </div>
  );
};

export default SuperAdminPanel;
