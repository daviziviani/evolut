import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, Dumbbell } from 'lucide-react';
import { User, WeightEntry, WorkoutSession } from '../types';
import { getStorageItem, STORAGE_KEYS } from '../utils/localStorage';
import { calculateWeeklyWeightGain, formatWeight } from '../utils/calculations';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const userData = getStorageItem<User>(STORAGE_KEYS.USER);
    const weightData = getStorageItem<WeightEntry[]>(STORAGE_KEYS.WEIGHT_ENTRIES) || [];
    const workoutData = getStorageItem<WorkoutSession[]>(STORAGE_KEYS.WORKOUTS) || [];

    setUser(userData);
    setWeightEntries(weightData);
    setWorkouts(workoutData);
  };

  const getWeeklyProgress = (): number => {
    return calculateWeeklyWeightGain(weightEntries);
  };

  const getCompletedWorkouts = (): number => {
    return workouts.filter(w => w.completed).length;
  };

  const getLastWorkoutDate = (): string => {
    const lastWorkout = workouts
      .filter(w => w.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    if (!lastWorkout) return 'Nenhum treino realizado';
    
    const date = new Date(lastWorkout.date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ontem';
    if (diffDays === 0) return 'Hoje';
    return `${diffDays} dias atrás`;
  };

  const getTotalWeightGain = (): number => {
    if (weightEntries.length === 0) return 0;
    const firstEntry = weightEntries[0];
    const lastEntry = weightEntries[weightEntries.length - 1];
    return lastEntry.weight - firstEntry.weight;
  };

  const weeklyProgress = getWeeklyProgress();

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">Olá, {user?.name || 'Usuário'}! 👋</h1>
        <p className="text-red-100">Vamos evoluir juntos hoje!</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Peso Atual</p>
                <p className="text-xl font-bold text-white">
                  {user ? formatWeight(user.currentWeight) : '0kg'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Meta</p>
                <p className="text-xl font-bold text-white">
                  {user ? formatWeight(user.goals.targetWeight) : '0kg'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Resumo do Progresso</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ganho total de peso</span>
              <span className="font-semibold text-red-500">
                +{formatWeight(getTotalWeightGain())}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ganho semanal</span>
              <span className="font-semibold text-white">
                +{formatWeight(weeklyProgress)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Treinos completos</span>
              <span className="font-semibold text-white">{getCompletedWorkouts()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Último treino</span>
              <span className="font-semibold text-white">{getLastWorkoutDate()}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-xl text-center">
              <Dumbbell className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Ir para</p>
              <p className="font-semibold text-white">Treinos</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl text-center">
              <Calendar className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Registrar</p>
              <p className="font-semibold text-white">Progresso</p>
            </div>
          </div>
        </div>

        {/* Goals */}
        {user && (
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4">Suas Metas</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Peso meta</span>
                <span className="font-semibold text-red-500">
                  {formatWeight(user.goals.targetWeight)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Meta semanal</span>
                <span className="font-semibold text-white">
                  +{formatWeight(user.goals.weeklyGoal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Dias de treino</span>
                <span className="font-semibold text-white">
                  {user.trainingDays}x por semana
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;