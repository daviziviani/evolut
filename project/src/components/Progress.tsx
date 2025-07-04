import React, { useState, useEffect } from 'react';
import { TrendingUp, Camera, Ruler, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WeightEntry, Measurement } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';
import { calculateWeeklyWeightGain, isUnrealisticGain, formatWeight } from '../utils/calculations';
import Modal from './common/Modal';
import Toast from './common/Toast';

const Progress: React.FC = () => {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const weightData = getStorageItem<WeightEntry[]>(STORAGE_KEYS.WEIGHT_ENTRIES) || [];
    const measurementData = getStorageItem<Measurement[]>(STORAGE_KEYS.MEASUREMENTS) || [];
    
    setWeightEntries(weightData);
    setMeasurements(measurementData);
  };

  const addWeightEntry = () => {
    const weight = parseFloat(newWeight);
    if (!weight || weight <= 0) return;

    const newEntry: WeightEntry = {
      date: new Date().toISOString().split('T')[0],
      weight
    };

    const updatedEntries = [...weightEntries, newEntry];
    const weeklyGain = calculateWeeklyWeightGain(updatedEntries);

    if (isUnrealisticGain(weeklyGain)) {
      setShowEducationModal(true);
      return;
    }

    setWeightEntries(updatedEntries);
    setStorageItem(STORAGE_KEYS.WEIGHT_ENTRIES, updatedEntries);
    setNewWeight('');
    setShowWeightModal(false);
    showNotification('✅ Peso registrado com sucesso!', 'success');
  };

  const forceAddWeight = () => {
    const weight = parseFloat(newWeight);
    const newEntry: WeightEntry = {
      date: new Date().toISOString().split('T')[0],
      weight
    };

    const updatedEntries = [...weightEntries, newEntry];
    setWeightEntries(updatedEntries);
    setStorageItem(STORAGE_KEYS.WEIGHT_ENTRIES, updatedEntries);
    setNewWeight('');
    setShowWeightModal(false);
    setShowEducationModal(false);
    showNotification('⚠️ Peso registrado. Lembre-se das expectativas realistas!', 'info');
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const getWeightProgress = () => {
    if (weightEntries.length === 0) return 0;
    const firstEntry = weightEntries[0];
    const lastEntry = weightEntries[weightEntries.length - 1];
    return lastEntry.weight - firstEntry.weight;
  };

  const chartData = weightEntries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    weight: entry.weight
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">Seu Progresso</h1>
        <p className="text-green-100">Acompanhe sua evolução</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Progress Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ganho Total</p>
                <p className="text-xl font-bold text-gray-900">
                  +{formatWeight(getWeightProgress())}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Scale className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Peso Atual</p>
                <p className="text-xl font-bold text-gray-900">
                  {weightEntries.length > 0 ? 
                    formatWeight(weightEntries[weightEntries.length - 1].weight) : 
                    '0kg'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Evolução do Peso</h2>
            <button
              onClick={() => setShowWeightModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Adicionar Peso
            </button>
          </div>
          
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Scale className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum dado de peso registrado</p>
            </div>
          )}
        </div>

        {/* Time Machine */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Time Machine</h2>
            <Camera className="h-5 w-5 text-gray-600" />
          </div>
          
          <div className="text-center py-8 text-gray-500">
            <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="mb-4">Compare seu progresso visual</p>
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Adicionar Foto
            </button>
          </div>
        </div>

        {/* Measurements */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Medições</h2>
            <Ruler className="h-5 w-5 text-gray-600" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Peito</p>
              <p className="text-lg font-bold text-gray-900">98cm</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Braço</p>
              <p className="text-lg font-bold text-gray-900">35cm</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Cintura</p>
              <p className="text-lg font-bold text-gray-900">80cm</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Coxa</p>
              <p className="text-lg font-bold text-gray-900">55cm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Weight Modal */}
      <Modal
        isOpen={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        title="Adicionar Peso"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso (kg)
            </label>
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 72.5"
              step="0.1"
            />
          </div>
          <button
            onClick={addWeightEntry}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Adicionar
          </button>
        </div>
      </Modal>

      {/* Education Modal */}
      <Modal
        isOpen={showEducationModal}
        onClose={() => setShowEducationModal(false)}
        title="⚠️ Atenção aos Ganhos Realistas"
        size="lg"
      >
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Ganho Muscular Real</h3>
            <p className="text-yellow-700">
              Para iniciantes, o ganho muscular realista é de <strong>1-2kg por ano</strong>. 
              Ganhos acima de 500g por semana são extremamente raros e podem indicar:
            </p>
            <ul className="mt-2 text-yellow-700 list-disc list-inside">
              <li>Ganho de gordura corporal</li>
              <li>Retenção de líquidos</li>
              <li>Erro na medição</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Dica Científica</h3>
            <p className="text-blue-700">
              A síntese proteica muscular tem um limite biológico. Focar em progressão 
              gradual e constante é mais eficaz que buscar ganhos rápidos.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowEducationModal(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Revisar Peso
            </button>
            <button
              onClick={forceAddWeight}
              className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Adicionar Mesmo Assim
            </button>
          </div>
        </div>
      </Modal>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default Progress;