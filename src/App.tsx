import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { User } from './types';
import { getStorageItem, removeStorageItem, STORAGE_KEYS } from './utils/localStorage';
import Auth from './components/Auth';
import Header from './components/common/Header';
import Navbar from './components/common/Navbar';
import Dashboard from './components/Dashboard';
import Workout from './components/Workout';
import Progress from './components/Progress';
import Diet from './components/Diet';
import Profile from './components/Profile';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = getStorageItem<User>(STORAGE_KEYS.USER);
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    removeStorageItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Header user={user} onLogout={handleLogout} />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/diet" element={<Diet />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;