import React, { useState, useEffect } from 'react';
import { TrendingUp, Camera, Scale, Calendar, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WeightEntry, ProgressPhoto } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/localStorage';
import { calculateWeeklyWeightGain, isUnrealisticGain, formatWeight } from '../utils/calculations';
import Toast from './common/Toast';

const Progress: React.FC = () => {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const weightData = getStorageItem<WeightEntry[]>(STORAGE_KEYS.WEIGHT_ENTRIES) || [];
    const photoData = getStorageItem<ProgressPhoto[]>(STORAGE_KEYS.PROGRESS_PHOTOS) || [];
    
    setWeightEntries(weightData);
    setProgressPhotos(photoData);
  };

  const addProgressEntry = () => {
    const weight = parseFloat(newWeight);
    if (!weight || weight <= 0) {
      showNotification('Por favor, insira um peso válido', 'error');
      return;
    }

    const newWeightEntry: WeightEntry = {
      date: new Date().toISOString().split('T')[0],
      weight
    };

    const updatedEntries = [...weightEntries, newWeightEntry];
    const weeklyGain = calculateWeeklyWeightGain(updatedEntries);

    if (isUnrealisticGain(weeklyGain)) {
      setShowEducationModal(true);
      return;
    }

    // Add weight entry
    setWeightEntries(updatedEntries);
    setStorageItem(STORAGE_KEYS.WEIGHT_ENTRIES, updatedEntries);

    // Add photo if selected
    if (selectedPhoto) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: ProgressPhoto = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          url: e.target?.result as string,
          weight: weight
        };

        const updatedPhotos = [...progressPhotos, newPhoto];
        setProgressPhotos(updatedPhotos);
        setStorageItem(STORAGE_KEYS.PROGRESS_PHOTOS, updatedPhotos);
      };
      reader.readAsDataURL(selectedPhoto);
    }

    setNewWeight('');
    setSelectedPhoto(null);
    setShowAddModal(false);
    showNotification('✅ Progresso registrado com sucesso!', 'success');
  };

  const forceAddEntry = () => {
    const weight = parseFloat(newWeight);
    const newWeightEntry: WeightEntry = {
      date: new Date().toISOString().split('T')[0],
      weight
    };

    const updatedEntries = [...weightEntries, newWeightEntry];
    setWeightEntries(updatedEntries);
    setStorageItem(STORAGE_KEYS.WEIGHT_ENTRIES, updatedEntries);

    // Add photo if selected
    if (selectedPhoto) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: ProgressPhoto = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          url: e.target?.result as string,
          weight: weight
        };

        const updatedPhotos = [...progressPhotos, newPhoto];
        setProgressPhotos(updatedPhotos);
        setStorageItem(STORAGE_KEYS.PROGRESS_PHOTOS, updatedPhotos);
      };
      reader.readAsDataURL(selectedPhoto);
    }

    setNewWeight('');
    setSelectedPhoto(null);
    setShowAddModal(false);
    setShowEducationModal(false);
    showNotification('⚠️ Progresso registrado. Lembre-se das expectativas realistas!', 'info');
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
    <div className="min-h-screen bg-black pb-20 pt-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-b-3xl mx-4">
        <h1 className="text-2xl font-bold mb-2">Seu Progresso</h1>
        <p className="text-red-100">Acompanhe sua evolução visual e numérica</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Progress Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Ganho Total</p>
                <p className="text-xl font-bold text-white">
                  +{formatWeight(getWeightProgress())}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Peso Atual</p>
                <p className="text-xl font-bold text-white">
                  {weightEntries.length > 0 ? 
                    formatWeight(weightEntries[weightEntries.length - 1].weight) : 
                    '0kg'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Progress Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="h-6 w-6" />
          <span>Adicionar Progresso</span>
        </button>

        {/* Weight Chart */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Evolução do Peso</h2>
          
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Scale className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p>Nenhum dado de peso registrado</p>
            </div>
          )}
        </div>

        {/* Visual Timeline */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Timeline Visual</h2>
          
          {progressPhotos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {progressPhotos.map((photo) => (
                <div key={photo.id} className="bg-gray-800 p-4 rounded-xl">
                  <img
                    src={photo.url}
                    alt="Progress"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">
                        {new Date(photo.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Scale className="h-4 w-4 text-red-500" />
                      <span className="text-white font-semibold">
                        {formatWeight(photo.weight)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Camera className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p className="mb-4">Nenhuma foto de progresso ainda</p>
              <p className="text-sm text-gray-400">
                Adicione fotos para acompanhar sua evolução visual
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Progress Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Adicionar Progresso</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white"
                  placeholder="Ex: 72.5"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Foto (opcional)
                </label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedPhoto(e.target.files?.[0] || null)}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-400 text-sm">Clique para adicionar foto</p>
                  </label>
                  {selectedPhoto && (
                    <p className="mt-2 text-sm text-green-400">
                      Foto selecionada: {selectedPhoto.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={addProgressEntry}
                  disabled={!newWeight}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {showEducationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-white mb-4">⚠️ Atenção aos Ganhos Realistas</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-500 bg-opacity-20 rounded-lg border border-yellow-500 border-opacity-30">
                <h4 className="font-semibold text-yellow-400 mb-2">Ganho Muscular Real</h4>
                <p className="text-yellow-300 text-sm">
                  Para iniciantes, o ganho muscular realista é de <strong>1-2kg por ano</strong>. 
                  Ganhos acima de 500g por semana são extremamente raros e podem indicar:
                </p>
                <ul className="mt-2 text-yellow-300 text-sm list-disc list-inside">
                  <li>Ganho de gordura corporal</li>
                  <li>Retenção de líquidos</li>
                  <li>Erro na medição</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-500 bg-opacity-20 rounded-lg border border-blue-500 border-opacity-30">
                <h4 className="font-semibold text-blue-400 mb-2">Dica Científica</h4>
                <p className="text-blue-300 text-sm">
                  A síntese proteica muscular tem um limite biológico. Focar em progressão 
                  gradual e constante é mais eficaz que buscar ganhos rápidos.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEducationModal(false)}
                  className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Revisar Peso
                </button>
                <button
                  onClick={forceAddEntry}
                  className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Adicionar Mesmo Assim
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

export default Progress;