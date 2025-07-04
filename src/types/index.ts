export interface User {
  id: string;
  name: string;
  startWeight: number;
  currentWeight: number;
  height: number;
  startDate: string;
  goals: {
    targetWeight: number;
    weeklyGoal: number;
  };
}

export interface WorkoutSession {
  id: string;
  date: string;
  exercises: Exercise[];
  duration: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  sets: Set[];
  restTime: number;
}

export interface Set {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WeightEntry {
  date: string;
  weight: number;
  bodyFat?: number;
}

export interface RecoveryEntry {
  date: string;
  sleepHours: number;
  fatigueLevel: number;
  mood: number;
}

export interface Measurement {
  date: string;
  chest: number;
  arms: number;
  waist: number;
  thighs: number;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  front: string;
  side: string;
  back: string;
}

export interface Notification {
  id: string;
  type: 'hydration' | 'post-workout' | 'sleep' | 'education';
  message: string;
  timestamp: string;
  read: boolean;
}