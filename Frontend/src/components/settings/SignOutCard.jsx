import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SignOutCard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to log out of your session?')) {
      await logout();
      navigate('/landing');
    }
  };

  return (
    <div className="mt-8 mb-6">
      <button
        type="button"
        onClick={handleSignOut}
        className="w-full py-3.5 px-4 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
      >
        <LogOut className="w-4 h-4 text-red-500" />
        <span>Log Out</span>
      </button>
    </div>
  );
}
