import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface ActivityContextType {
  activeSeconds: number;
  idleSeconds: number;
  productivityScore: number;
  resetTracker: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const IDLE_THRESHOLD = 60 * 1000; // 60 seconds of no activity = idle

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [idleSeconds, setIdleSeconds] = useState(0);
  const [productivityScore, setProductivityScore] = useState(100);
  
  const lastActivityRef = useRef<number>(Date.now());
  const eventCountsRef = useRef<number[]>([]); // To track events over time window
  
  // Load from local storage on mount
  useEffect(() => {
    const storedActive = localStorage.getItem('activeSeconds');
    const storedIdle = localStorage.getItem('idleSeconds');
    if (storedActive) setActiveSeconds(parseInt(storedActive, 10));
    if (storedIdle) setIdleSeconds(parseInt(storedIdle, 10));
  }, []);

  // Track activity events
  useEffect(() => {
    const handleActivity = (e: Event) => {
      lastActivityRef.current = Date.now();
      
      // Weight typing higher than mouse moves
      const weight = e.type === 'keydown' ? 3 : 1;
      for (let i = 0; i < weight; i++) {
        eventCountsRef.current.push(Date.now());
      }
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, handleActivity));
    
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, []);

  // Timer loop for active/idle and productivity score
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      
      // 1. Update Active/Idle Seconds
      if (timeSinceLastActivity > IDLE_THRESHOLD) {
        setIdleSeconds(prev => {
          const updated = prev + 1;
          localStorage.setItem('idleSeconds', updated.toString());
          return updated;
        });
      } else {
        setActiveSeconds(prev => {
          const updated = prev + 1;
          localStorage.setItem('activeSeconds', updated.toString());
          return updated;
        });
      }

      // 2. Calculate Productivity Score (rolling 60s window)
      // Keep only events from the last 60 seconds
      eventCountsRef.current = eventCountsRef.current.filter(timestamp => now - timestamp < 60000);
      
      let newScore = 0;
      if (timeSinceLastActivity > IDLE_THRESHOLD) {
        newScore = 0; // Completely idle
      } else {
        // Assume 60 weighted events per minute is "100% productive" (e.g. 20 keystrokes or 60 mouse movements)
        const recentEvents = eventCountsRef.current.length;
        newScore = Math.min(100, Math.max(0, Math.round((recentEvents / 60) * 100)));
        // Baseline 10% if active at all
        if (newScore < 10) newScore = 10;
      }
      setProductivityScore(newScore);
      localStorage.setItem('productivityScore', newScore.toString());

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const resetTracker = () => {
    setActiveSeconds(0);
    setIdleSeconds(0);
    setProductivityScore(100);
    eventCountsRef.current = [];
    localStorage.removeItem('activeSeconds');
    localStorage.removeItem('idleSeconds');
    lastActivityRef.current = Date.now();
  };

  return (
    <ActivityContext.Provider value={{ activeSeconds, idleSeconds, productivityScore, resetTracker }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};
