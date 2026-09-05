import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Radio, AlertTriangle, FileText, Plus, Bell, RefreshCw, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { ROLES } from '../../services/authService';
import AccountMenuDropdown from './AccountMenuDropdown';
import AnimatedBellIcon from '../notifications/AnimatedBellIcon';
import NotificationDropdown from '../notifications/NotificationDropdown';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const userRole = (user?.role || '').toLowerCase();
  const isStrictAdmin = userRole === ROLES.ADMIN.toLowerCase() || userRole === 'admin';
  const isTechnician = userRole === ROLES.TECHNICIAN.toLowerCase() || userRole === 'technician';
  const isAdmin = isStrictAdmin || isTechnician;

  const dashboardPath = isStrictAdmin
    ? '/admin/dashboard'
    : isTechnician
      ? '/dashboard/technician'
      : '/dashboard/viewer';

  const userRoleLabel = isStrictAdmin
    ? 'System Administrator'
    : isTechnician
      ? 'Field Technician'
      : 'Read-Only Viewer';

  const userName = user?.name || (isStrictAdmin ? 'Admin User' : isTechnician ? 'Tech User' : 'Viewer User');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const { unreadCount, pushEnabled } = useNotifications();

  // Dynamic Navigation items — Settings and System Management removed from sidebar per spec
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: dashboardPath },
    { id: 'stations', label: 'Stations', icon: Radio, path: '/stations' },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, path: '/alerts' },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
  ];

  const activeId = navItems.find((n) => location.pathname.startsWith(n.path))?.id || 'dashboard';

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const userInitials = user?.initials || (user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'AU');

  return (
    <div className="min-h-screen bg-[#f2f6fb] flex font-[Inter,system-ui,sans-serif] relative">
      {/* ─── Soft Screen Backdrop Blur when Account Popup is Open ─── */}
      {showProfileMenu && (
        <div
          onClick={() => setShowProfileMenu(false)}
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-[3px] z-40 transition-all duration-200 animate-in fade-in"
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside className="w-[220px] bg-[#0a1e3d] flex flex-col h-screen sticky top-0 shrink-0 z-50 justify-between">
        {/* Top Portion: Brand & Nav Links */}
        <div>
          {/* Brand */}
          <div
            onClick={() => navigate(dashboardPath)}
            className="px-5 pt-6 pb-6 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="font-bold text-lg text-white tracking-tight leading-tight">RatGuard AI</div>
            <div className="text-[#7b9cc7] text-xs mt-0.5">Facility Management</div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id || location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isActive
                      ? 'bg-[#1a3a6b] text-white border-l-[3px] border-[#3b82f6] pl-[9px]'
                      : 'text-[#8eadd4] hover:bg-[#132d55] hover:text-white border-l-[3px] border-transparent pl-[9px]'
                    }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Portion: Admin Action, Divider Line & Large Account Profile Circle */}
        <div className="relative">
          {/* Admin Quick Add Action */}
          {isAdmin && (
            <div className="px-4 pb-2">
              <button
                onClick={() => navigate('/stations/add')}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/30 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Station
              </button>
            </div>
          )}

          {/* ─── Drawn Line Divider After Some Pixels ─── */}
          <hr className="border-t border-[#1a3a6b] my-2 mx-4" />

          {/* ─── Account Profile Section (Moved to Bottom Right of Sidebar with Increased Circle Size) ─── */}
          <div className="px-4 py-3">
            <button
              type="button"
              onClick={handleProfileClick}
              className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#132d55] transition-all cursor-pointer text-left group"
              title="Account Settings"
            >
              {/* Increased Avatar Circle Size (44px w-11 h-11) */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white flex items-center justify-center font-extrabold text-sm ring-2 ring-white/20 shadow-md group-hover:ring-blue-400 shrink-0">
                {userInitials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate leading-tight">{userName}</div>
                <div className="text-[11px] text-[#8eadd4] truncate font-medium mt-0.5">{userRoleLabel}</div>
              </div>
            </button>
          </div>

          {/* Account Menu Dropdown (Pops up directly above bottom avatar) */}
          {showProfileMenu && (
            <AccountMenuDropdown onClose={() => setShowProfileMenu(false)} />
          )}
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col min-h-0 min-w-0">
        {/* Page content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
