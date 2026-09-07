import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface ActivityContextType {
  activeSeconds: number;
  idleSeconds: number;
  resetTracker: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

const IDLE_THRESHOLD = 60 * 1000; // 60 seconds of no activity = idle

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [idleSeconds, setIdleSeconds] = useState(0);
  
  const lastActivityRef = useRef<number>(Date.now());
  
  // Load from local storage on mount
  useEffect(() => {
    const storedActive = localStorage.getItem('activeSeconds');
    const storedIdle = localStorage.getItem('idleSeconds');
    if (storedActive) setActiveSeconds(parseInt(storedActive, 10));
    if (storedIdle) setIdleSeconds(parseInt(storedIdle, 10));
  }, []);

  // Track activity events
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, handleActivity));
    
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, []);

  // Timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      
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
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const resetTracker = () => {
    setActiveSeconds(0);
    setIdleSeconds(0);
    localStorage.removeItem('activeSeconds');
    localStorage.removeItem('idleSeconds');
    lastActivityRef.current = Date.now();
  };

  return (
    <ActivityContext.Provider value={{ activeSeconds, idleSeconds, resetTracker }}>
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
