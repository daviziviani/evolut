import React, { useState, useEffect } from 'react';
import { Calculator, Droplets, Target, Apple, Beef, Wheat } from 'lucide-react';
import { User } from '../types';
import { getStorageItem, STORAGE_KEYS } from '../utils/localStorage';
import Toast from './common/Toast';

const Diet: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [goal, setGoal] = useState<string>('gain');
  const [calculatedMacros, setCalculatedMacros] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const userData = getStorageItem<User>(STORAGE_KEYS.USER);
    if (userData) {
      setUser(userData);
    }
  };

  const calculateMacros = () => {
    if (!user) return;

    // Calculate BMR using Mifflin-St Jeor equation
    const bmr = 10 * user.currentWeight + 6.25 * user.height - 5 * 25 + 5; // Assuming age 25

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];

    // Goal adjustments
    let calories = tdee;
    if (goal === 'gain') {
      calories = tdee + 300; // Moderate surplus for lean gains
    } else if (goal === 'lose') {
      calories = tdee - 500; // Moderate deficit
    }

    // Macro calculations
    const protein = user.currentWeight * 2.2; // 2.2g per kg for muscle gain
    const fat = user.currentWeight * 1.0; // 1g per kg
    const carbs = (calories - (protein * 4) - (fat * 9)) / 4;

    // Water calculation (35ml per kg)
    const water = user.currentWeight * 35;

    const macros = {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      water: Math.round(water)
    };

    setCalculatedMacros(macros);
    showNotification('🎯 Macronutrientes calculados com sucesso!', 'success');
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const MacroCard = ({ icon: Icon, title, value, unit, color }: any) => (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-3 ${color} rounded-xl`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-red-500">{value}</p>
        <p className="text-gray-400 text-sm">{unit}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black pb-20 pt-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-b-3xl mx-4">
        <h1 className="text-2xl font-bold mb-2">Calculadora de Dieta</h1>
        <p className="text-red-100">Calcule seus macronutrientes personalizados</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Calculator Form */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-red-600 rounded-xl">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Calculadora de Macros</h2>
          </div>

          <div className="space-y-4">
            {/* Activity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Nível de Atividade
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: 'sedentary', label: 'Sedentário (sem exercício)' },
                  { value: 'light', label: 'Leve (1-3x por semana)' },
                  { value: 'moderate', label: 'Moderado (3-5x por semana)' },
                  { value: 'active', label: 'Ativo (6-7x por semana)' },
                  { value: 'very_active', label: 'Muito Ativo (2x por dia)' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="activity"
                      value={option.value}
                      checked={activityLevel === option.value}
                      onChange={(e) => setActivityLevel(e.target.value)}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Objetivo
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'lose', label: 'Perder Peso', icon: '📉' },
                  { value: 'maintain', label: 'Manter', icon: '⚖️' },
                  { value: 'gain', label: 'Ganhar Massa', icon: '📈' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGoal(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      goal === option.value
                        ? 'border-red-500 bg-red-500 bg-opacity-20 text-red-400'
                        : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="text-sm font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={calculateMacros}
              disabled={!user}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calcular Macronutrientes
            </button>
          </div>
        </div>

        {/* Results */}
        {calculatedMacros && (
          <>
            {/* Daily Targets */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-6">Metas Diárias</h3>
              <div className="grid grid-cols-2 gap-4">
                <MacroCard
                  icon={Target}
                  title="Calorias"
                  value={calculatedMacros.calories}
                  unit="kcal"
                  color="bg-red-600"
                />
                <MacroCard
                  icon={Droplets}
                  title="Água"
                  value={calculatedMacros.water}
                  unit="ml"
                  color="bg-blue-600"
                />
              </div>
            </div>

            {/* Macronutrients */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-6">Macronutrientes</h3>
              <div className="grid grid-cols-3 gap-4">
                <MacroCard
                  icon={Beef}
                  title="Proteína"
                  value={calculatedMacros.protein}
                  unit="g"
                  color="bg-green-600"
                />
                <MacroCard
                  icon={Wheat}
                  title="Carboidratos"
                  value={calculatedMacros.carbs}
                  unit="g"
                  color="bg-yellow-600"
                />
                <MacroCard
                  icon={Apple}
                  title="Gorduras"
                  value={calculatedMacros.fat}
                  unit="g"
                  color="bg-purple-600"
                />
              </div>
            </div>
          </>
        )}

        {/* User Info Display */}
        {user && (
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Seus Dados</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-800 rounded-xl">
                <p className="text-gray-400 text-sm">Peso Atual</p>
                <p className="text-2xl font-bold text-red-500">{user.currentWeight}kg</p>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-xl">
                <p className="text-gray-400 text-sm">Altura</p>
                <p className="text-2xl font-bold text-red-500">{user.height}cm</p>
              </div>
            </div>
          </div>
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

export default Diet;