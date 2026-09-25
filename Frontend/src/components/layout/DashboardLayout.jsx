import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  AlertTriangle,
  FileText,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../services/authService';
import AccountMenuDropdown from './AccountMenuDropdown';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const userRole = (user?.role || '').toLowerCase();
  const isStrictAdmin = userRole === ROLES.ADMIN.toLowerCase() || userRole === 'admin';
  const isTechnician = userRole === ROLES.TECHNICIAN.toLowerCase() || userRole === 'technician';
  const isAdmin = isStrictAdmin || isTechnician;

  const dashboardPath = useMemo(() => {
    if (isStrictAdmin) return '/admin/dashboard';
    if (isTechnician) return '/dashboard/technician';
    return '/dashboard/viewer';
  }, [isStrictAdmin, isTechnician]);

  const userRoleLabel = useMemo(() => {
    if (isStrictAdmin) return 'System Administrator';
    if (isTechnician) return 'Field Technician';
    return 'Read-Only Viewer';
  }, [isStrictAdmin, isTechnician]);

  const userName = useMemo(() => {
    return user?.name || (isStrictAdmin ? 'Admin User' : isTechnician ? 'Tech User' : 'Viewer User');
  }, [user?.name, isStrictAdmin, isTechnician]);

  const userInitials = useMemo(() => {
    if (user?.initials) return user.initials;
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'AU';
  }, [user?.initials, user?.name]);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Dynamic Navigation items
  const navItems = useMemo(
    () => [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: dashboardPath },
      { id: 'stations', label: 'Stations', icon: Radio, path: '/stations' },
      { id: 'alerts', label: 'Alerts', icon: AlertTriangle, path: '/alerts' },
      { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
    ],
    [dashboardPath]
  );

  const activeId = useMemo(() => {
    return navItems.find((n) => location.pathname.startsWith(n.path))?.id || 'dashboard';
  }, [navItems, location.pathname]);

  const handleNavClick = useCallback(
    (path) => {
      setMobileMenuOpen(false);
      navigate(path);
    },
    [navigate]
  );

  const handleProfileClick = useCallback(() => {
    setShowProfileMenu((prev) => !prev);
  }, []);

  const handleCloseProfileMenu = useCallback(() => {
    setShowProfileMenu(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#f2f6fb] flex flex-col md:flex-row font-[Inter,system-ui,sans-serif] relative">
      {/* ─── Mobile Sticky Topbar (< md) ─── */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a1e3d] text-white sticky top-0 z-40 border-b border-[#1a3a6b]">
        <div
          onClick={() => handleNavClick(dashboardPath)}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="font-bold text-base text-white tracking-tight">RatGuard AI</div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a3a6b] text-[#8eadd4] font-medium">
            Telemetry
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="p-2 rounded-lg text-[#8eadd4] hover:text-white hover:bg-[#132d55] transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* ─── Mobile Backdrop Overlay ─── */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] z-45 animate-in fade-in duration-200"
        />
      )}

      {/* ─── Soft Screen Backdrop Blur when Account Popup is Open ─── */}
      {showProfileMenu && (
        <div
          onClick={handleCloseProfileMenu}
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-[3px] z-40 transition-all duration-200 animate-in fade-in"
        />
      )}

      {/* ─── Sidebar (Responsive Drawer on Mobile, Sticky Column on Desktop) ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[240px] md:w-[220px] bg-[#0a1e3d] flex flex-col h-screen md:sticky top-0 shrink-0 justify-between transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Portion: Brand & Nav Links */}
        <div>
          {/* Brand & Mobile Close Button */}
          <div className="px-5 pt-6 pb-6 flex items-center justify-between">
            <div
              onClick={() => handleNavClick(dashboardPath)}
              className="cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="font-bold text-lg text-white tracking-tight leading-tight">RatGuard AI</div>
              <div className="text-[#7b9cc7] text-xs mt-0.5">Facility Management</div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-[#8eadd4] hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id || location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
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

        {/* Bottom Portion: Admin Action, Divider Line & Account Profile */}
        <div className="relative">
          {/* Admin Quick Add Action */}
          {isAdmin && (
            <div className="px-4 pb-2">
              <button
                onClick={() => handleNavClick('/stations/add')}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/30 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Station
              </button>
            </div>
          )}

          {/* Divider Line */}
          <hr className="border-t border-[#1a3a6b] my-2 mx-4" />

          {/* Account Profile Section */}
          <div className="px-4 py-3">
            <button
              type="button"
              onClick={handleProfileClick}
              className="w-full flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#132d55] transition-all cursor-pointer text-left group"
              title="Account Settings"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white flex items-center justify-center font-extrabold text-sm ring-2 ring-white/20 shadow-md group-hover:ring-blue-400 shrink-0">
                {userInitials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate leading-tight">{userName}</div>
                <div className="text-[11px] text-[#8eadd4] truncate font-medium mt-0.5">{userRoleLabel}</div>
              </div>
            </button>
          </div>

          {/* Account Menu Dropdown */}
          {showProfileMenu && (
            <AccountMenuDropdown onClose={handleCloseProfileMenu} />
          )}
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col min-h-0 min-w-0">
        <div className="flex-1 overflow-auto">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
