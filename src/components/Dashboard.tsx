import React, { useState, useEffect } from 'react';
import { Calendar, Target, TrendingUp, Clock, Droplets, Brain } from 'lucide-react';
import { User, WeightEntry, RecoveryEntry, WorkoutSession } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';
import { calculateRecoveryScore, calculateWeeklyWeightGain, formatWeight } from '../utils/calculations';
import Toast from './common/Toast';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [recoveryEntries, setRecoveryEntries] = useState<RecoveryEntry[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    loadData();
    setupNotifications();
  }, []);

  const loadData = () => {
    const userData = getStorageItem<User>(STORAGE_KEYS.USER);
    const weightData = getStorageItem<WeightEntry[]>(STORAGE_KEYS.WEIGHT_ENTRIES) || [];
    const recoveryData = getStorageItem<RecoveryEntry[]>(STORAGE_KEYS.RECOVERY_ENTRIES) || [];
    const workoutData = getStorageItem<WorkoutSession[]>(STORAGE_KEYS.WORKOUTS) || [];

    setUser(userData);
    setWeightEntries(weightData);
    setRecoveryEntries(recoveryData);
    setWorkouts(workoutData);

    // Initialize demo data if user doesn't exist
    if (!userData) {
      initializeDemoData();
    }
  };

  const initializeDemoData = () => {
    const demoUser: User = {
      id: '1',
      name: 'João Silva',
      startWeight: 70,
      currentWeight: 72.5,
      height: 175,
      startDate: '2024-01-01',
      goals: {
        targetWeight: 80,
        weeklyGoal: 0.5
      }
    };

    const demoWeightEntries: WeightEntry[] = [
      { date: '2024-01-01', weight: 70 },
      { date: '2024-01-08', weight: 70.3 },
      { date: '2024-01-15', weight: 70.8 },
      { date: '2024-01-22', weight: 71.2 },
      { date: '2024-01-29', weight: 71.8 },
      { date: '2024-02-05', weight: 72.5 }
    ];

    const demoRecoveryEntries: RecoveryEntry[] = [
      { date: '2024-02-05', sleepHours: 7.5, fatigueLevel: 3, mood: 8 },
      { date: '2024-02-04', sleepHours: 6.5, fatigueLevel: 5, mood: 6 },
      { date: '2024-02-03', sleepHours: 8, fatigueLevel: 2, mood: 9 }
    ];

    setStorageItem(STORAGE_KEYS.USER, demoUser);
    setStorageItem(STORAGE_KEYS.WEIGHT_ENTRIES, demoWeightEntries);
    setStorageItem(STORAGE_KEYS.RECOVERY_ENTRIES, demoRecoveryEntries);

    setUser(demoUser);
    setWeightEntries(demoWeightEntries);
    setRecoveryEntries(demoRecoveryEntries);
  };

  const setupNotifications = () => {
    // Hydration reminder every 2 hours
    const hydrationInterval = setInterval(() => {
      showNotification('💧 Hora de hidratar! Beba água para otimizar seu treino.', 'info');
    }, 2 * 60 * 60 * 1000); // 2 hours

    // Post-workout notification (simulated)
    const postWorkoutTimeout = setTimeout(() => {
      showNotification('🍖 Janela anabólica: faça uma refeição em 30 minutos!', 'info');
    }, 30 * 60 * 1000); // 30 minutes

    return () => {
      clearInterval(hydrationInterval);
      clearTimeout(postWorkoutTimeout);
    };
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const getLatestRecoveryScore = (): number => {
    if (recoveryEntries.length === 0) return 0;
    const latest = recoveryEntries[recoveryEntries.length - 1];
    return calculateRecoveryScore(latest);
  };

  const getWeeklyProgress = (): number => {
    return calculateWeeklyWeightGain(weightEntries);
  };

  const getNextWorkoutDate = (): string => {
    const lastWorkout = workouts[workouts.length - 1];
    if (!lastWorkout) return 'Hoje';
    
    const lastDate = new Date(lastWorkout.date);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 2); // Rest day between workouts
    
    return nextDate.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const recoveryScore = getLatestRecoveryScore();
  const weeklyProgress = getWeeklyProgress();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">Olá, {user?.name || 'Usuário'}! 👋</h1>
        <p className="text-blue-100">Vamos evoluir juntos hoje!</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Peso Atual</p>
                <p className="text-xl font-bold text-gray-900">
                  {user ? formatWeight(user.currentWeight) : '0kg'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Meta Semanal</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatWeight(weeklyProgress)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recovery Score */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Score de Recuperação</h2>
            <Brain className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  recoveryScore >= 70 ? 'bg-green-500' : 
                  recoveryScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${recoveryScore}%` }}
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">{recoveryScore}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {recoveryScore >= 70 ? 'Excelente! Você está pronto para treinar.' :
             recoveryScore >= 50 ? 'Bom. Considere reduzir a intensidade.' :
             'Descanse mais. Seu corpo precisa de recuperação.'}
          </p>
        </div>

        {/* Next Workout */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Próximo Treino</h2>
            <Calendar className="h-5 w-5 text-gray-600" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-blue-600">{getNextWorkoutDate()}</p>
            <p className="text-sm text-gray-600">Treino A - Peito, Ombro e Tríceps</p>
            <div className="flex items-center space-x-2 mt-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Duração estimada: 45-60 min</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lembretes</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Droplets className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Hidratação</p>
                <p className="text-xs text-blue-700">Próximo lembrete em 1h 30min</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default Dashboard;