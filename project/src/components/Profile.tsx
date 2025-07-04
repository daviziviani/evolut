import React, { useState, useEffect } from 'react';
import { User, Settings, Bell, Moon, Droplets, Target, Edit3 } from 'lucide-react';
import { User as UserType, RecoveryEntry } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';
import { calculateBMI, getBMICategory, formatWeight } from '../utils/calculations';
import Toast from './common/Toast';

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [sleepHours, setSleepHours] = useState('');
  const [fatigueLevel, setFatigueLevel] = useState(5);
  const [mood, setMood] = useState(7);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const userData = getStorageItem<UserType>(STORAGE_KEYS.USER);
    if (userData) {
      setUser(userData);
    }
  };

  const addRecoveryEntry = () => {
    const hours = parseFloat(sleepHours);
    if (!hours || hours <= 0) return;

    const newEntry: RecoveryEntry = {
      date: new Date().toISOString().split('T')[0],
      sleepHours: hours,
      fatigueLevel,
      mood
    };

    const recoveryEntries = getStorageItem<RecoveryEntry[]>(STORAGE_KEYS.RECOVERY_ENTRIES) || [];
    recoveryEntries.push(newEntry);
    setStorageItem(STORAGE_KEYS.RECOVERY_ENTRIES, recoveryEntries);

    setSleepHours('');
    setFatigueLevel(5);
    setMood(7);
    setShowSleepModal(false);

    if (hours < 7) {
      showNotification('⚠️ Reduza 20% da carga hoje devido ao sono insuficiente', 'info');
    } else {
      showNotification('✅ Dados de recuperação registrados!', 'success');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const bmi = user ? calculateBMI(user.currentWeight, user.height) : 0;
  const bmiCategory = getBMICategory(bmi);

  const settingsItems = [
    {
      icon: Bell,
      title: 'Notificações',
      description: 'Lembretes de hidratação e treino',
      action: () => showNotification('🔔 Configurações de notificação em breve!', 'info')
    },
    {
      icon: Moon,
      title: 'Registro de Sono',
      description: 'Monitore sua recuperação',
      action: () => setShowSleepModal(true)
    },
    {
      icon: Droplets,
      title: 'Hidratação',
      description: 'Lembretes a cada 2 horas',
      action: () => showNotification('💧 Configurar lembretes de hidratação!', 'info')
    },
    {
      icon: Target,
      title: 'Metas',
      description: 'Defina seus objetivos',
      action: () => showNotification('🎯 Configuração de metas em breve!', 'info')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">Perfil</h1>
        <p className="text-indigo-100">Gerencie sua conta e preferências</p>
      </div>

      <div className="p-6 space-y-6">
        {/* User Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Usuário'}</h2>
              <p className="text-gray-600">Iniciante na musculação</p>
            </div>
            <button className="ml-auto p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Edit3 className="h-5 w-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Peso</p>
              <p className="text-lg font-bold text-gray-900">
                {user ? formatWeight(user.currentWeight) : '0kg'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Altura</p>
              <p className="text-lg font-bold text-gray-900">
                {user ? `${user.height}cm` : '0cm'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">IMC</p>
              <p className="text-lg font-bold text-gray-900">
                {bmi.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Categoria IMC:</strong> {bmiCategory}
            </p>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Progresso</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Dias treinando</span>
              <span className="font-semibold text-gray-900">35 dias</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Treinos completos</span>
              <span className="font-semibold text-gray-900">28 treinos</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ganho de peso</span>
              <span className="font-semibold text-green-600">+2.5kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Consistência</span>
              <span className="font-semibold text-blue-600">80%</span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h3>
          <div className="space-y-4">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* About */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre o EVOLUT</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Versão:</strong> 1.0.0
            </p>
            <p>
              <strong>Desenvolvido por:</strong> Equipe EVOLUT
            </p>
            <p>
              <strong>Missão:</strong> Combater frustrações de iniciantes na musculação através de educação científica e expectativas realistas.
            </p>
          </div>
        </div>
      </div>

      {/* Sleep Modal */}
      {showSleepModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registro de Sono</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horas de sono
                </label>
                <input
                  type="number"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 7.5"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de fadiga (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={fatigueLevel}
                  onChange={(e) => setFatigueLevel(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Muito cansado</span>
                  <span>{fatigueLevel}</span>
                  <span>Muito descansado</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Humor (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Muito triste</span>
                  <span>{mood}</span>
                  <span>Muito feliz</span>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowSleepModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={addRecoveryEntry}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Salvar
                </button>
              </div>
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

export default Profile;