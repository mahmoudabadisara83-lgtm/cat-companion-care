import { useState, useEffect, useCallback } from 'react';
import { PetData, InjectionLog, GlucoseLog, TimerData, CAT_LEVELS, QUESTS } from '@/types';

const STORAGE_KEYS = {
  PET_DATA: 'diabuddy_pet_data',
  INJECTION_LOGS: 'diabuddy_injection_logs',
  GLUCOSE_LOGS: 'diabuddy_glucose_logs',
  TIMER_DATA: 'diabuddy_timer_data',
};

const DEFAULT_PET_DATA: PetData = {
  level: 0,
  totalInjections: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastInjectionDate: null,
  isHungry: false,
  glucoseLogs: 0,
  badges: {
    bronze: false,
    silver: false,
    gold: false,
  },
  createdAt: new Date().toISOString(),
};

function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function usePetData() {
  const [petData, setPetData] = useState<PetData>(() => 
    getStoredData(STORAGE_KEYS.PET_DATA, DEFAULT_PET_DATA)
  );
  const [injectionLogs, setInjectionLogs] = useState<InjectionLog[]>(() => 
    getStoredData(STORAGE_KEYS.INJECTION_LOGS, [])
  );
  const [glucoseLogs, setGlucoseLogs] = useState<GlucoseLog[]>(() => 
    getStoredData(STORAGE_KEYS.GLUCOSE_LOGS, [])
  );
  const [timerData, setTimerData] = useState<TimerData>(() => 
    getStoredData(STORAGE_KEYS.TIMER_DATA, { nextDueTime: null })
  );

  // Persist data on changes
  useEffect(() => {
    setStoredData(STORAGE_KEYS.PET_DATA, petData);
  }, [petData]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.INJECTION_LOGS, injectionLogs);
  }, [injectionLogs]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.GLUCOSE_LOGS, glucoseLogs);
  }, [glucoseLogs]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.TIMER_DATA, timerData);
  }, [timerData]);

  // Check if cat is hungry (missed injection today)
  useEffect(() => {
    const checkHungryStatus = () => {
      if (!petData.lastInjectionDate) return;
      
      const lastDate = new Date(petData.lastInjectionDate);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0 && !petData.isHungry) {
        setPetData(prev => ({ ...prev, isHungry: true, currentStreak: 0 }));
      }
    };

    checkHungryStatus();
    const interval = setInterval(checkHungryStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [petData.lastInjectionDate, petData.isHungry]);

  const calculateLevel = useCallback((totalInjections: number): number => {
    for (let i = CAT_LEVELS.length - 1; i >= 0; i--) {
      if (totalInjections >= CAT_LEVELS[i].injectionsNeeded) {
        return CAT_LEVELS[i].level;
      }
    }
    return 0;
  }, []);

  const logInjection = useCallback((doseAmount?: number): { leveledUp: boolean; newLevel: number } => {
    const now = new Date();
    const today = now.toDateString();
    const lastDate = petData.lastInjectionDate ? new Date(petData.lastInjectionDate).toDateString() : null;
    
    const newLog: InjectionLog = {
      id: crypto.randomUUID(),
      timestamp: now.toISOString(),
      doseAmount,
    };
    
    setInjectionLogs(prev => [...prev, newLog]);

    // Calculate streak
    let newStreak = petData.currentStreak;
    if (lastDate !== today) {
      newStreak = petData.currentStreak + 1;
    }

    const newTotal = petData.totalInjections + 1;
    const newLevel = calculateLevel(newTotal);
    const leveledUp = newLevel > petData.level;

    setPetData(prev => ({
      ...prev,
      totalInjections: newTotal,
      level: newLevel,
      currentStreak: newStreak,
      longestStreak: Math.max(prev.longestStreak, newStreak),
      lastInjectionDate: now.toISOString(),
      isHungry: false,
    }));

    // Set timer for next dose (default 5 hours for prototype)
    const nextDue = new Date(now.getTime() + (doseAmount ? doseAmount * 30 * 60000 : 5 * 60 * 60000));
    setTimerData({
      nextDueTime: nextDue.toISOString(),
      lastDoseAmount: doseAmount,
    });

    return { leveledUp, newLevel };
  }, [petData, calculateLevel]);

  const logGlucose = useCallback((value: number): { newBadge: 'bronze' | 'silver' | 'gold' | null } => {
    const newLog: GlucoseLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      value,
    };
    
    setGlucoseLogs(prev => [...prev, newLog]);

    const newCount = petData.glucoseLogs + 1;
    let newBadge: 'bronze' | 'silver' | 'gold' | null = null;

    const newBadges = { ...petData.badges };
    
    if (newCount >= QUESTS.gold.count && !petData.badges.gold) {
      newBadges.gold = true;
      newBadge = 'gold';
    } else if (newCount >= QUESTS.silver.count && !petData.badges.silver) {
      newBadges.silver = true;
      newBadge = 'silver';
    } else if (newCount >= QUESTS.bronze.count && !petData.badges.bronze) {
      newBadges.bronze = true;
      newBadge = 'bronze';
    }

    setPetData(prev => ({
      ...prev,
      glucoseLogs: newCount,
      badges: newBadges,
    }));

    return { newBadge };
  }, [petData]);

  const getStreakDates = useCallback((): Set<string> => {
    const dates = new Set<string>();
    injectionLogs.forEach(log => {
      dates.add(new Date(log.timestamp).toDateString());
    });
    return dates;
  }, [injectionLogs]);

  const resetData = useCallback(() => {
    setPetData(DEFAULT_PET_DATA);
    setInjectionLogs([]);
    setGlucoseLogs([]);
    setTimerData({ nextDueTime: null });
  }, []);

  return {
    petData,
    injectionLogs,
    glucoseLogs,
    timerData,
    logInjection,
    logGlucose,
    getStreakDates,
    resetData,
  };
}
