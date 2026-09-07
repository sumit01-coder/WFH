import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Goals = () => {
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    setGoals([
      { id: '1', title: 'Q3 Revenue Target', current: 75, target: 100, unit: 'k', color: 'from-green-500 to-emerald-700' },
      { id: '2', title: 'New User Signups', current: 450, target: 500, unit: '', color: 'from-blue-500 to-purple-600' },
      { id: '3', title: 'System Uptime', current: 99.1, target: 99.9, unit: '%', color: 'from-orange-400 to-red-500' },
    ]);
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Target className="text-red-500" size={32} />
            Goals & OKRs
          </h2>
          <p className="text-slate-500 mt-1">Track company and individual objectives.</p>
        </div>
        <button className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-red-500/20 text-white">
          Create Goal
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal, i) => {
          const progress = (goal.current / goal.target) * 100;
          
          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              key={goal.id} 
              className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden"
            >
              {/* Subtle background gradient */}
              <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${goal.color} rounded-full blur-[50px] opacity-20`} />
              
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-slate-900 w-2/3">{goal.title}</h3>
                <Award className="text-slate-400" size={24} />
              </div>
              
              <div className="mb-2 flex justify-between items-end">
                <span className="text-4xl font-black text-slate-900">{goal.current}{goal.unit}</span>
                <span className="text-sm text-slate-400 font-medium mb-1">/ {goal.target}{goal.unit}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-white shadow-sm rounded-full overflow-hidden mt-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full bg-gradient-to-r ${goal.color} rounded-full`}
                />
              </div>
              <div className="mt-2 text-right text-xs text-slate-500 font-bold">
                {progress.toFixed(1)}% Completed
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
};

export default Goals;
