import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, Sun, Moon, Monitor, ArrowUpRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../services/authService';

export default function AccountMenuDropdown({ onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTheme, setActiveTheme] = useState('light');
  const menuRef = useRef(null);

  const userRole = (user?.role || '').toLowerCase();
  const isAdmin =
    userRole === ROLES.ADMIN.toLowerCase() ||
    userRole === ROLES.TECHNICIAN.toLowerCase() ||
    userRole === 'admin' ||
    userRole === 'technician';

  const userName = user?.name || (isAdmin ? 'Admin User' : 'Muhammad');
  const userEmail = user?.email || 'ansaftab68@gmail.com';

  // Automatic Click Anywhere Outside to Close Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('pointerdown', handleClickOutside);
      document.addEventListener('click', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  const handleNav = (path) => {
    if (onClose) onClose();
    navigate(path);
  };

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
    navigate('/landing');
  };

  return (
    <div
      ref={menuRef}
      className="absolute bottom-20 left-3 w-68 bg-[#18181b]/85 backdrop-blur-xl text-white rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-zinc-700/60 z-50 font-sans transform transition-all duration-200 ease-out"
      style={{
        animation: 'smoothPopupFade 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Inline Keyframes style for ultra-smooth entry animation */}
      <style>{`
        @keyframes smoothPopupFade {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {/* ─── Profile Header ─── */}
      <div className="mb-3">
        <h4 className="font-extrabold text-sm text-white leading-snug">{userName}</h4>
        <p className="text-xs text-zinc-400 font-medium truncate mb-3">{userEmail}</p>

        {/* Set up profile button */}
        <button
          type="button"
          onClick={() => handleNav('/settings/edit-profile')}
          className="w-full py-2 bg-zinc-800/90 hover:bg-zinc-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all duration-150 cursor-pointer shadow-xs border border-zinc-700/50"
        >
          Set up profile
        </button>
      </div>

      <hr className="border-zinc-800/80 my-2.5" />

      {/* ─── Action Items ─── */}
      <div className="space-y-1">
        {/* Request Content (Viewer only) */}
        {!isAdmin && (
          <button
            type="button"
            onClick={() => handleNav('/settings/contact-admin')}
            className="w-full flex items-center gap-2.5 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white hover:translate-x-1 transition-all duration-150 cursor-pointer text-left group"
          >
            <div className="w-4 h-4 rounded-full border border-zinc-500 group-hover:border-white flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
              <Plus className="w-3 h-3" />
            </div>
            <span>Request content</span>
          </button>
        )}

        {/* Settings */}
        <button
          type="button"
          onClick={() => handleNav('/settings')}
          className="w-full flex items-center gap-2.5 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white hover:translate-x-1 transition-all duration-150 cursor-pointer text-left group"
        >
          <Settings className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
          <span>Settings</span>
        </button>
      </div>

      <hr className="border-zinc-800/80 my-2.5" />

      {/* ─── Theme Switcher ─── */}
      <div className="flex items-center justify-between py-1">
        <span className="text-xs font-semibold text-zinc-300">Theme</span>
        <div className="bg-zinc-800/90 p-1 rounded-full flex items-center gap-1 border border-zinc-700/60">
          <button
            type="button"
            onClick={() => setActiveTheme('light')}
            className={`p-1.5 rounded-full transition-all duration-150 cursor-pointer ${activeTheme === 'light' ? 'bg-zinc-700 text-amber-400 scale-105' : 'text-zinc-400 hover:text-white'
              }`}
            title="Light Theme"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTheme('dark')}
            className={`p-1.5 rounded-full transition-all duration-150 cursor-pointer ${activeTheme === 'dark' ? 'bg-zinc-700 text-blue-400 scale-105' : 'text-zinc-400 hover:text-white'
              }`}
            title="Dark Theme"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTheme('system')}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${activeTheme === 'system' ? 'bg-zinc-700 text-emerald-400 scale-105' : 'text-zinc-400 hover:text-white'
              }`}
            title="System Theme"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <hr className="border-zinc-800/80 my-2.5" />

      {/* ─── Links List (With diagonal arrow ↗) ─── */}
      <div className="space-y-1.5">
        {isAdmin ? (
          <>
            <button
              type="button"
              onClick={() => handleNav('/admin/system')}
              className="w-full flex items-center justify-between py-1 text-xs font-semibold text-zinc-200 hover:text-white hover:translate-x-1 transition-all duration-150 cursor-pointer text-left group"
            >
              <span>System Management</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => handleNav('/settings')}
              className="w-full flex items-center justify-between py-1 text-xs font-semibold text-zinc-200 hover:text-white hover:translate-x-1 transition-all duration-150 cursor-pointer text-left group"
            >
              <span>Settings</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => handleNav('/settings/contact-admin')}
            className="w-full flex items-center justify-between py-1 text-xs font-semibold text-zinc-200 hover:text-white hover:translate-x-1 transition-all duration-150 cursor-pointer text-left group"
          >
            <span>Contact Administrator</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

        <button
          type="button"
          onClick={() => handleNav('/landing')}
          className="w-full flex items-center justify-between py-1 text-xs font-semibold text-zinc-200 hover:text-white hover:translate-x-1 transition-all duration-150 cursor-pointer text-left group"
        >
          <span>Landing Page</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <hr className="border-zinc-800/80 my-2.5" />

      {/* ─── Support & Logout ─── */}
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={() => alert('Support portal: Contact support@ratguard.ai')}
          className="w-full flex items-center justify-between py-1 text-xs font-semibold text-zinc-200 hover:text-white hover:translate-x-1 transition-all duration-150 cursor-pointer text-left group"
        >
          <span>Support</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-between py-1 text-xs font-bold text-red-400 hover:text-red-300 hover:translate-x-1 transition-all duration-150 cursor-pointer text-left"
        >
          <span>Log out</span>
        </button>
      </div>

      <hr className="border-zinc-800/80 my-2.5" />

      {/* ─── Footer ─── */}
      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-semibold pt-0.5">
        <div className="flex items-center gap-2">
          <span className="hover:text-zinc-400 transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-zinc-400 transition-colors cursor-pointer">Terms</span>
          <span className="hover:text-zinc-400 transition-colors cursor-pointer">Copyright</span>
        </div>
        <button
          type="button"
          onClick={() => onClose && onClose()}
          className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
