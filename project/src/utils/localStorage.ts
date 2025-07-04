export const STORAGE_KEYS = {
  USER: 'evolut_user',
  WORKOUTS: 'evolut_workouts',
  WEIGHT_ENTRIES: 'evolut_weight_entries',
  RECOVERY_ENTRIES: 'evolut_recovery_entries',
  MEASUREMENTS: 'evolut_measurements',
  PROGRESS_PHOTOS: 'evolut_progress_photos',
  NOTIFICATIONS: 'evolut_notifications',
  SETTINGS: 'evolut_settings'
} as const;

export const getStorageItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

export const clearAllStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};