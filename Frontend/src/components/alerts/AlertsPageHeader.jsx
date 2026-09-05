import React, { useState } from 'react';
import { ChevronDown, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { ROLE_LABELS } from '../../services/authService';
import AnimatedBellIcon from '../notifications/AnimatedBellIcon';
import NotificationDropdown from '../notifications/NotificationDropdown';

export default function AlertsPageHeader() {
  const { user } = useAuth();
  const { unreadCount, pushEnabled } = useNotifications();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [warehouse, setWarehouse] = useState('Warehouse A');

  const roleLabel = ROLE_LABELS[user?.role] || user?.role || 'Administrator';
  const WAREHOUSES = ['Warehouse A', 'Warehouse B', 'Distribution Center', 'Admin Wing'];

  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
      {/* Left Title + Dynamic Role Badge */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight m-0">Alerts</h1>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#eff6ff] color-[#2563eb] text-[#2563eb] border border-[#bfdbfe] inline-flex items-center gap-1.5">
          {roleLabel}
        </span>
      </div>

      {/* Right Controls (Warehouse Dropdown + Notification Bell) */}
      <div className="flex items-center gap-3">
        {/* Facility Selector Card */}
        <div className="relative flex items-center">
          <Building2 className="w-4 h-4 text-[#2563eb] absolute left-3 pointer-events-none" />
          <select
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            className="h-10 pl-9 pr-9 text-xs font-semibold text-[#1e293b] bg-white border border-[#e2e8f0] rounded-xl outline-none cursor-pointer appearance-none shadow-sm hover:border-[#cbd5e1] transition-all"
          >
            {WAREHOUSES.map((wh) => (
              <option key={wh} value={wh}>
                {wh} · Updated 2m ago
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#64748b] absolute right-3 pointer-events-none" />
        </div>

        {/* Bell Button & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            className="p-1 rounded-xl bg-transparent border-0 flex items-center justify-center relative cursor-pointer hover:bg-slate-100/60 transition-all"
            title={pushEnabled ? 'Notifications' : 'Notifications Muted'}
          >
            <AnimatedBellIcon pushEnabled={pushEnabled} hasUnread={unreadCount > 0} size={40} />
            {pushEnabled && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ef4444] text-white text-[10px] font-extrabold min-w-4 h-4 rounded-full flex items-center justify-center px-1 ring-2 ring-white">
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
