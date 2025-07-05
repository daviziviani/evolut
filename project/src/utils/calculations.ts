import { WeightEntry, RecoveryEntry } from '../types';

export const calculateWeeklyWeightGain = (entries: WeightEntry[]): number => {
  if (entries.length < 2) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestEntry = sortedEntries[sortedEntries.length - 1];
  const weekAgoEntry = sortedEntries.find(entry => {
    const entryDate = new Date(entry.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  });
  
  if (!weekAgoEntry) return 0;
  
  return latestEntry.weight - weekAgoEntry.weight;
};

export const calculateRecoveryScore = (entry: RecoveryEntry): number => {
  const sleepScore = Math.min(entry.sleepHours / 8, 1) * 40;
  const fatigueScore = ((10 - entry.fatigueLevel) / 10) * 40;
  const moodScore = (entry.mood / 10) * 20;
  
  return Math.round(sleepScore + fatigueScore + moodScore);
};

export const calculateProgressionWeight = (currentWeight: number, completedSets: number, targetSets: number): number => {
  if (completedSets >= targetSets) {
    return currentWeight + 2.5;
  }
  return currentWeight;
};

export const isUnrealisticGain = (weeklyGain: number): boolean => {
  return weeklyGain > 2; // More than 2kg per week is unrealistic
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatWeight = (weight: number | null | undefined): string => {
  if (weight == null || isNaN(weight)) {
    return '0.0kg';
  }
  return `${weight.toFixed(1)}kg`;
};

export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidade';
};