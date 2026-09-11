import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Briefcase, Coffee, Clock } from 'lucide-react';

interface LunchBreakModalProps {
  mode: 'start' | 'end'; // 'start' = break time arrived, 'end' = break is over
  breakEndTime?: string;  // e.g. "14:00" — shown in the start prompt countdown
  onTakeBreak: () => void;
  onContinueWorking: () => void;
  onImBack: () => void;
  onSnooze: () => void;
}

const LunchBreakModal: React.FC<LunchBreakModalProps> = ({
  mode,
  breakEndTime,
  onTakeBreak,
  onContinueWorking,
  onImBack,
  onSnooze,
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700"
        >
          {mode === 'start' ? (
            <>
              {/* Header */}
              <div className="bg-gradient-to-br from-orange-400 to-amber-500 px-6 pt-8 pb-10 text-center relative">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-lg">
                  🍽️
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Lunch Break Time!</h2>
                <p className="text-orange-100 text-sm">
                  It's your scheduled lunch break
                  {breakEndTime ? ` until ${breakEndTime}` : ''}.
                </p>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                  Are you taking your lunch break or continuing to work?
                </p>

                {/* Take Break */}
                <button
                  id="btn-take-lunch-break"
                  onClick={onTakeBreak}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all group"
                >
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow">
                    <UtensilsCrossed size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Take Lunch Break</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pause activity tracking — enjoy your break! 🎉
                    </p>
                  </div>
                </button>

                {/* Continue Working */}
                <button
                  id="btn-continue-working"
                  onClick={onContinueWorking}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                >
                  <div className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow">
                    <Briefcase size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Continue Working</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Skip break — keep activity tracking running
                    </p>
                  </div>
                </button>

                <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                  <Clock size={12} />
                  This prompt has been open for {elapsed}s
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Return from break header */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 pt-8 pb-10 text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl shadow-lg">
                  ☕
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Lunch Break Over!</h2>
                <p className="text-blue-100 text-sm">
                  Your scheduled break has ended. Ready to get back to work?
                </p>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                  Resume activity tracking to keep your work log accurate.
                </p>

                {/* I'm Back */}
                <button
                  id="btn-im-back"
                  onClick={onImBack}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all group"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow">
                    <Briefcase size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">I'm Back — Resume Work</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      End break and resume activity tracking
                    </p>
                  </div>
                </button>

                {/* Still on break */}
                <button
                  id="btn-snooze-break"
                  onClick={onSnooze}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                >
                  <div className="w-10 h-10 bg-slate-500 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow">
                    <Coffee size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Still on Break</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Remind me again in 10 minutes
                    </p>
                  </div>
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LunchBreakModal;
