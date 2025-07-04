import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Check, Timer } from 'lucide-react';
import { WorkoutSession, Exercise, Set } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';
import { calculateProgressionWeight } from '../utils/calculations';
import Toast from './common/Toast';

const Workout: React.FC = () => {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    loadCurrentWorkout();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && startTime) {
      interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  const loadCurrentWorkout = () => {
    const workouts = getStorageItem<WorkoutSession[]>(STORAGE_KEYS.WORKOUTS) || [];
    const today = new Date().toISOString().split('T')[0];
    
    let todayWorkout = workouts.find(w => w.date === today);
    
    if (!todayWorkout) {
      todayWorkout = createNewWorkout();
      workouts.push(todayWorkout);
      setStorageItem(STORAGE_KEYS.WORKOUTS, workouts);
    }
    
    setCurrentWorkout(todayWorkout);
  };

  const createNewWorkout = (): WorkoutSession => {
    const demoExercises: Exercise[] = [
      {
        id: '1',
        name: 'Supino Reto',
        muscle: 'Peito',
        sets: [
          { reps: 10, weight: 60, completed: false },
          { reps: 10, weight: 60, completed: false },
          { reps: 10, weight: 60, completed: false }
        ],
        restTime: 90
      },
      {
        id: '2',
        name: 'Desenvolvimento',
        muscle: 'Ombro',
        sets: [
          { reps: 12, weight: 40, completed: false },
          { reps: 12, weight: 40, completed: false },
          { reps: 12, weight: 40, completed: false }
        ],
        restTime: 60
      },
      {
        id: '3',
        name: 'Tríceps Pulley',
        muscle: 'Tríceps',
        sets: [
          { reps: 15, weight: 30, completed: false },
          { reps: 15, weight: 30, completed: false },
          { reps: 15, weight: 30, completed: false }
        ],
        restTime: 45
      }
    ];

    return {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      exercises: demoExercises,
      duration: 0,
      completed: false
    };
  };

  const startWorkout = () => {
    setIsActive(true);
    setStartTime(Date.now());
    showNotification('💪 Treino iniciado! Foco e determinação!', 'success');
  };

  const pauseWorkout = () => {
    setIsActive(false);
    showNotification('⏸️ Treino pausado. Descanse e volte mais forte!', 'info');
  };

  const completeSet = (exerciseId: string, setIndex: number) => {
    if (!currentWorkout) return;

    const updatedWorkout = { ...currentWorkout };
    const exercise = updatedWorkout.exercises.find(ex => ex.id === exerciseId);
    
    if (exercise) {
      exercise.sets[setIndex].completed = true;
      
      // Check if all sets are completed
      const allSetsCompleted = exercise.sets.every(set => set.completed);
      if (allSetsCompleted) {
        const newWeight = calculateProgressionWeight(
          exercise.sets[0].weight,
          exercise.sets.length,
          exercise.sets.length
        );
        
        if (newWeight > exercise.sets[0].weight) {
          showNotification(
            `🎉 Parabéns! Próximo treino: tente ${newWeight}kg no ${exercise.name}!`,
            'success'
          );
        }
      }
    }

    setCurrentWorkout(updatedWorkout);
    
    // Save to storage
    const workouts = getStorageItem<WorkoutSession[]>(STORAGE_KEYS.WORKOUTS) || [];
    const workoutIndex = workouts.findIndex(w => w.id === updatedWorkout.id);
    if (workoutIndex >= 0) {
      workouts[workoutIndex] = updatedWorkout;
      setStorageItem(STORAGE_KEYS.WORKOUTS, workouts);
    }
  };

  const completeWorkout = () => {
    if (!currentWorkout) return;

    const updatedWorkout = { ...currentWorkout };
    updatedWorkout.completed = true;
    updatedWorkout.duration = duration;

    setCurrentWorkout(updatedWorkout);
    setIsActive(false);

    // Save to storage
    const workouts = getStorageItem<WorkoutSession[]>(STORAGE_KEYS.WORKOUTS) || [];
    const workoutIndex = workouts.findIndex(w => w.id === updatedWorkout.id);
    if (workoutIndex >= 0) {
      workouts[workoutIndex] = updatedWorkout;
      setStorageItem(STORAGE_KEYS.WORKOUTS, workouts);
    }

    showNotification('🎉 Treino concluído! Excelente trabalho!', 'success');
    
    // Post-workout notification
    setTimeout(() => {
      showNotification('🍖 Janela anabólica: faça uma refeição em 30 minutos!', 'info');
    }, 2000);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentWorkout) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">Treino A</h1>
        <p className="text-blue-100">Peito, Ombro e Tríceps</p>
        
        {/* Timer */}
        <div className="flex items-center justify-between mt-4 p-4 bg-white bg-opacity-20 rounded-xl">
          <div className="flex items-center space-x-2">
            <Timer className="h-5 w-5" />
            <span className="text-lg font-mono">{formatTime(duration)}</span>
          </div>
          <div className="flex space-x-2">
            {!isActive ? (
              <button
                onClick={startWorkout}
                className="flex items-center space-x-2 bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Iniciar</span>
              </button>
            ) : (
              <button
                onClick={pauseWorkout}
                className="flex items-center space-x-2 bg-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Pause className="h-4 w-4" />
                <span>Pausar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="p-6 space-y-6">
        {currentWorkout.exercises.map((exercise) => (
          <div key={exercise.id} className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
                <p className="text-sm text-gray-600">{exercise.muscle}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Descanso</p>
                <p className="text-lg font-semibold text-blue-600">{exercise.restTime}s</p>
              </div>
            </div>

            {/* Sets */}
            <div className="space-y-3">
              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {setIndex + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{set.reps} reps</p>
                      <p className="text-sm text-gray-600">{set.weight}kg</p>
                    </div>
                  </div>
                  <button
                    onClick={() => completeSet(exercise.id, setIndex)}
                    disabled={set.completed}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      set.completed 
                        ? 'bg-green-500 text-white' 
                        : 'border-2 border-gray-300 hover:border-green-500 hover:bg-green-50'
                    }`}
                  >
                    {set.completed && <Check className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Complete Workout Button */}
        {currentWorkout.exercises.every(ex => ex.sets.every(set => set.completed)) && (
          <button
            onClick={completeWorkout}
            className="w-full bg-green-500 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-green-600 transition-colors"
          >
            Finalizar Treino 🎉
          </button>
        )}
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

export default Workout;