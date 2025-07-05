import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Play, Pause, Timer, Check, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkoutSession, Exercise, Set } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';
import Toast from './common/Toast';

interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
}

interface ExerciseProgress {
  exerciseName: string;
  data: { date: string; weight: number }[];
}

const Workout: React.FC = () => {
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newExercise, setNewExercise] = useState({
    name: '',
    muscle: '',
    sets: 3,
    reps: 12,
    weight: 20,
    restTime: 60
  });
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([]);
  const [selectedExerciseProgress, setSelectedExerciseProgress] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    loadData();
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

  const loadData = () => {
    const templates = getStorageItem<WorkoutTemplate[]>(STORAGE_KEYS.WORKOUT_PLANS) || [];
    const workouts = getStorageItem<WorkoutSession[]>(STORAGE_KEYS.WORKOUTS) || [];
    
    setWorkoutTemplates(templates);
    
    // Check for today's workout
    const today = new Date().toISOString().split('T')[0];
    const todayWorkout = workouts.find(w => w.date === today && !w.completed);
    setCurrentWorkout(todayWorkout || null);

    // Calculate exercise progress
    calculateExerciseProgress(workouts);
  };

  const calculateExerciseProgress = (workouts: WorkoutSession[]) => {
    const progressMap: { [key: string]: { date: string; weight: number }[] } = {};

    workouts.forEach(workout => {
      if (workout.completed) {
        workout.exercises.forEach(exercise => {
          if (!progressMap[exercise.name]) {
            progressMap[exercise.name] = [];
          }
          
          const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
          progressMap[exercise.name].push({
            date: workout.date,
            weight: maxWeight
          });
        });
      }
    });

    const progress = Object.keys(progressMap).map(exerciseName => ({
      exerciseName,
      data: progressMap[exerciseName].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }));

    setExerciseProgress(progress);
  };

  const createWorkoutTemplate = () => {
    if (!newTemplateName.trim()) return;

    const newTemplate: WorkoutTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      exercises: []
    };

    const updatedTemplates = [...workoutTemplates, newTemplate];
    setWorkoutTemplates(updatedTemplates);
    setStorageItem(STORAGE_KEYS.WORKOUT_PLANS, updatedTemplates);
    
    setNewTemplateName('');
    setShowTemplateModal(false);
    showNotification('✅ Treino criado com sucesso!', 'success');
  };

  const addExerciseToTemplate = () => {
    if (!selectedTemplate || !newExercise.name.trim()) return;

    const exercise: Exercise = {
      id: Date.now().toString(),
      name: newExercise.name,
      muscle: newExercise.muscle,
      restTime: newExercise.restTime,
      sets: Array.from({ length: newExercise.sets }, () => ({
        reps: newExercise.reps,
        weight: newExercise.weight,
        completed: false
      }))
    };

    const updatedTemplates = workoutTemplates.map(template => {
      if (template.id === selectedTemplate) {
        return { ...template, exercises: [...template.exercises, exercise] };
      }
      return template;
    });

    setWorkoutTemplates(updatedTemplates);
    setStorageItem(STORAGE_KEYS.WORKOUT_PLANS, updatedTemplates);

    setNewExercise({
      name: '',
      muscle: '',
      sets: 3,
      reps: 12,
      weight: 20,
      restTime: 60
    });
    setShowExerciseModal(false);
    showNotification('✅ Exercício adicionado!', 'success');
  };

  const startWorkoutFromTemplate = (templateId: string) => {
    const template = workoutTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newWorkout: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      exercises: template.exercises.map(ex => ({
        ...ex,
        id: Date.now().toString() + Math.random(),
        sets: ex.sets.map(set => ({ ...set, completed: false }))
      })),
      duration: 0,
      completed: false
    };

    setCurrentWorkout(newWorkout);
    setIsActive(true);
    setStartTime(Date.now());
    showNotification('💪 Treino iniciado! Foco e determinação!', 'success');
  };

  const completeSet = (exerciseId: string, setIndex: number) => {
    if (!currentWorkout) return;

    const updatedWorkout = { ...currentWorkout };
    const exercise = updatedWorkout.exercises.find(ex => ex.id === exerciseId);
    
    if (exercise) {
      exercise.sets[setIndex].completed = true;
    }

    setCurrentWorkout(updatedWorkout);
  };

  const completeWorkout = () => {
    if (!currentWorkout) return;

    const updatedWorkout = { ...currentWorkout };
    updatedWorkout.completed = true;
    updatedWorkout.duration = duration;

    // Save to storage
    const workouts = getStorageItem<WorkoutSession[]>(STORAGE_KEYS.WORKOUTS) || [];
    workouts.push(updatedWorkout);
    setStorageItem(STORAGE_KEYS.WORKOUTS, workouts);

    setCurrentWorkout(null);
    setIsActive(false);
    setDuration(0);
    setStartTime(null);

    // Recalculate progress
    calculateExerciseProgress(workouts);

    showNotification('🎉 Treino concluído! Excelente trabalho!', 'success');
  };

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = workoutTemplates.filter(t => t.id !== templateId);
    setWorkoutTemplates(updatedTemplates);
    setStorageItem(STORAGE_KEYS.WORKOUT_PLANS, updatedTemplates);
    showNotification('🗑️ Treino removido!', 'info');
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

  if (currentWorkout) {
    return (
      <div className="min-h-screen bg-black pb-20 pt-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-b-3xl mx-4">
          <h1 className="text-2xl font-bold mb-2">Treino em Andamento</h1>
          <p className="text-red-100">Foco na evolução constante</p>
          
          {/* Timer */}
          <div className="flex items-center justify-between mt-4 p-4 bg-white bg-opacity-20 rounded-xl">
            <div className="flex items-center space-x-2">
              <Timer className="h-5 w-5" />
              <span className="text-lg font-mono">{formatTime(duration)}</span>
            </div>
            <div className="flex space-x-2">
              {!isActive ? (
                <button
                  onClick={() => {
                    setIsActive(true);
                    setStartTime(Date.now() - duration * 1000);
                  }}
                  className="flex items-center space-x-2 bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Play className="h-4 w-4" />
                  <span>Continuar</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsActive(false)}
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
            <div key={exercise.id} className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
                  <p className="text-sm text-gray-400">{exercise.muscle}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Descanso</p>
                  <p className="text-lg font-semibold text-red-500">{exercise.restTime}s</p>
                </div>
              </div>

              {/* Sets */}
              <div className="space-y-3">
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {setIndex + 1}
                      </span>
                      <div>
                        <p className="font-medium text-white">{set.reps} reps</p>
                        <p className="text-sm text-gray-400">{set.weight}kg</p>
                      </div>
                    </div>
                    <button
                      onClick={() => completeSet(exercise.id, setIndex)}
                      disabled={set.completed}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        set.completed 
                          ? 'bg-green-500 text-white' 
                          : 'border-2 border-gray-600 hover:border-green-500 hover:bg-green-500 hover:bg-opacity-20'
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
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-2xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all"
            >
              Finalizar Treino 🎉
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20 pt-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-b-3xl mx-4">
        <h1 className="text-2xl font-bold mb-2">Meus Treinos</h1>
        <p className="text-red-100">Crie e gerencie seus treinos personalizados</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Treino</span>
          </button>
          <button
            onClick={() => setShowProgressModal(true)}
            className="bg-gray-800 border border-gray-700 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all flex items-center justify-center space-x-2"
          >
            <TrendingUp className="h-5 w-5" />
            <span>Ver Progresso</span>
          </button>
        </div>

        {/* Workout Templates */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Seus Treinos</h2>
          
          {workoutTemplates.length > 0 ? (
            <div className="space-y-4">
              {workoutTemplates.map((template) => (
                <div key={template.id} className="bg-gray-800 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setShowExerciseModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {template.exercises.map((exercise) => (
                      <div key={exercise.id} className="text-sm text-gray-400">
                        {exercise.name} - {exercise.sets.length} séries
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => startWorkoutFromTemplate(template.id)}
                    disabled={template.exercises.length === 0}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Iniciar Treino
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum treino criado ainda</p>
              <p className="text-sm mt-2">Crie seu primeiro treino personalizado</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Criar Novo Treino</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Treino
                </label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                  placeholder="Ex: Treino A - Peito e Tríceps"
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={createWorkoutTemplate}
                  disabled={!newTemplateName.trim()}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Exercise Modal */}
      {showExerciseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Adicionar Exercício</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Exercício
                </label>
                <input
                  type="text"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                  placeholder="Ex: Supino Reto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Músculo
                </label>
                <input
                  type="text"
                  value={newExercise.muscle}
                  onChange={(e) => setNewExercise({ ...newExercise, muscle: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                  placeholder="Ex: Peito"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Séries
                  </label>
                  <input
                    type="number"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Repetições
                  </label>
                  <input
                    type="number"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise({ ...newExercise, weight: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                    step="0.5"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descanso (s)
                  </label>
                  <input
                    type="number"
                    value={newExercise.restTime}
                    onChange={(e) => setNewExercise({ ...newExercise, restTime: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                    step="15"
                    min="15"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowExerciseModal(false)}
                  className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={addExerciseToTemplate}
                  disabled={!newExercise.name.trim()}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Progresso dos Exercícios</h3>
            
            {exerciseProgress.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Selecionar Exercício
                  </label>
                  <select
                    value={selectedExerciseProgress}
                    onChange={(e) => setSelectedExerciseProgress(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                  >
                    <option value="">Selecione um exercício</option>
                    {exerciseProgress.map((progress) => (
                      <option key={progress.exerciseName} value={progress.exerciseName}>
                        {progress.exerciseName}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedExerciseProgress && (
                  <div>
                    <h4 className="text-white font-semibold mb-4">
                      Evolução - {selectedExerciseProgress}
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={exerciseProgress.find(p => p.exerciseName === selectedExerciseProgress)?.data || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9CA3AF"
                          tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                          labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#DC2626" 
                          strokeWidth={2}
                          dot={{ fill: '#DC2626' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum dado de progresso ainda</p>
                <p className="text-sm mt-2">Complete alguns treinos para ver sua evolução</p>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowProgressModal(false)}
                className="bg-gray-700 text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

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