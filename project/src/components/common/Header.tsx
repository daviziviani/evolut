import React from 'react';
import { TrendingUp, User } from 'lucide-react';
import { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-black border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">EVOLUT</h1>
        </div>

        {/* User Menu */}
        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-400">Meta: {user.goals.targetWeight}kg</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;