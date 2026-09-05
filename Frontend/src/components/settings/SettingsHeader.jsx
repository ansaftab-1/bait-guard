import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import AnimatedBellIcon from '../notifications/AnimatedBellIcon';
import NotificationDropdown from '../notifications/NotificationDropdown';

export default function SettingsHeader() {
  const { unreadCount, pushEnabled } = useNotifications();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-extrabold text-[#101828] tracking-tight">Settings</h1>
        <p className="text-[#64748b] text-sm mt-0.5 font-medium">Manage your account and preferences</p>
      </div>

      {/* Top Right Controls */}
      <div className="flex items-center gap-3">
        {/* Facility Selector Pill */}
        <div className="bg-white border border-[#e2e8f0] px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#101828] flex items-center gap-2 shadow-xs">
          <Globe className="w-3.5 h-3.5 text-[#2563eb]" />
          <span>Warehouse A</span>
        </div>

        {/* Bell Icon Button & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            className="w-11 h-11 rounded-xl bg-white border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:text-[#101828] shadow-xs transition-colors cursor-pointer relative"
            title={pushEnabled ? 'Notifications' : 'Notifications Muted'}
          >
            <AnimatedBellIcon pushEnabled={pushEnabled} hasUnread={unreadCount > 0} size={24} color="#64748b" />
            {pushEnabled && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-extrabold min-w-3.5 h-3.5 rounded-full flex items-center justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotificationsDropdown && (
            <NotificationDropdown onClose={() => setShowNotificationsDropdown(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
