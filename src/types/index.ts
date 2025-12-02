export interface PetData {
  level: number; // 0-4
  totalInjections: number;
  currentStreak: number;
  longestStreak: number;
  lastInjectionDate: string | null;
  isHungry: boolean;
  glucoseLogs: number;
  badges: {
    bronze: boolean;
    silver: boolean;
    gold: boolean;
  };
  createdAt: string;
}

export interface InjectionLog {
  id: string;
  timestamp: string;
  doseAmount?: number;
}

export interface GlucoseLog {
  id: string;
  timestamp: string;
  value: number;
}

export interface TimerData {
  nextDueTime: string | null;
  lastDoseAmount?: number;
}

export type CatMood = 'happy' | 'hungry' | 'sleeping' | 'celebrating';

export const CAT_LEVELS = [
  { level: 0, name: 'Mystery Box', injectionsNeeded: 0, description: 'A cozy box... something is inside!' },
  { level: 1, name: 'Tiny Kitten', injectionsNeeded: 1, description: 'A curious kitten emerges!' },
  { level: 2, name: 'Playful Kit', injectionsNeeded: 8, description: 'Getting bigger and more playful!' },
  { level: 3, name: 'Young Cat', injectionsNeeded: 20, description: 'Almost grown up!' },
  { level: 4, name: 'Majestic Cat', injectionsNeeded: 40, description: 'A beautiful, healthy companion!' },
] as const;

export const QUESTS = {
  bronze: { count: 1, name: 'First Check', description: 'Log your first blood glucose' },
  silver: { count: 10, name: 'Glucose Guardian', description: 'Log 10 blood glucose readings' },
  gold: { count: 50, name: 'Health Hero', description: 'Log 50 blood glucose readings' },
} as const;

export const GLUCOSE_RANGES = {
  low: { min: 0, max: 70, label: 'Low', color: 'destructive' },
  target: { min: 70, max: 180, label: 'In Range', color: 'happy' },
  high: { min: 180, max: 500, label: 'High', color: 'hungry' },
} as const;
