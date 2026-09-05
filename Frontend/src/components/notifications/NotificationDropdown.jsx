import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  BellOff,
  AlertTriangle,
  UserPlus,
  CheckCircle2,
  XCircle,
  CheckCheck,
  Trash2,
  X,
  ExternalLink,
  Info,
  Clock,
  Building2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import * as accessRequestService from '../../services/accessRequestService';

export default function NotificationDropdown({ onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = (user?.role || '').toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'system administrator' || userRole === 'technician';

  const {
    notifications,
    pushEnabled,
    unreadCount,
    setPushEnabled,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteNotification,
    approveRequest,
    rejectRequest,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Filtered notifications list
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'alerts') return notif.type === 'alert';
    if (activeTab === 'requests') return notif.type === 'request';
    if (activeTab === 'system') return notif.type === 'system';
    if (activeTab === 'unread') return !notif.read;
    return true;
  });

  const handleApprove = (e, notif) => {
    e.stopPropagation();
    approveRequest(notif.id);
    if (notif.requestId) {
      accessRequestService.approveAccessRequest({
        id: notif.requestId,
        fullName: notif.requesterName || 'User',
        email: notif.requesterEmail || 'user@company.com',
        facility: notif.facility || 'Warehouse A',
        requestedRole: notif.requestedRole,
      });
    }
  };

  const handleReject = (e, notif) => {
    e.stopPropagation();
    rejectRequest(notif.id);
    if (notif.requestId) {
      accessRequestService.rejectAccessRequest(notif.requestId);
    }
  };

  const handleItemClick = (notif) => {
    markAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
      onClose();
    } else if (notif.type === 'request' && isAdmin) {
      navigate('/admin/dashboard');
      onClose();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 w-[460px] sm:w-[520px] bg-white rounded-3xl shadow-2xl border border-[#e2e8f0] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-[Inter,system-ui,sans-serif]"
    >
      {/* ─── ENHANCED TOP HEADER ─── */}
      <div className="bg-gradient-to-r from-[#0a1e3d] via-[#0d2854] to-[#0f346c] text-white p-5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {/* Header Animation Box */}
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15 overflow-hidden shrink-0">
            {pushEnabled ? (
              unreadCount > 0 ? (
                <DotLottieReact
                  src="https://lottie.host/6a4165e1-50c5-4784-aeb3-d836616561f7/Os9jdJQlNp.lottie"
                  loop
                  autoplay
                  style={{ width: '38px', height: '38px' }}
                />
              ) : (
                <Bell className="w-5 h-5 text-blue-400" />
              )
            ) : (
              <DotLottieReact
                src="https://lottie.host/553b6309-8bfb-46a9-b4ea-237f7b1fd01c/akmdUJDulH.lottie"
                loop
                autoplay
                style={{ width: '36px', height: '36px' }}
              />
            )}
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight">Notification Center</h2>
            <p className="text-xs text-[#8eadd4] font-medium mt-0.5">
              {pushEnabled
                ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                : 'Notifications currently muted'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {pushEnabled && notifications.length > 0 && (
            <>
              <button
                type="button"
                onClick={markAllAsRead}
                className="px-2.5 py-1.5 hover:bg-white/10 rounded-xl text-xs text-[#8eadd4] hover:text-white transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="p-2 hover:bg-white/10 rounded-xl text-[#8eadd4] hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl text-[#8eadd4] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-5" />
          </button>
        </div>
      </div>

      {/* ─── PUSH MUTED STATE BANNER WITH LOTTIE ANIMATION ─── */}
      {!pushEnabled && (
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 border-b border-amber-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              <DotLottieReact
                src="https://lottie.host/553b6309-8bfb-46a9-b4ea-237f7b1fd01c/akmdUJDulH.lottie"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div>
              <div className="text-sm font-extrabold text-amber-950">Push Notifications Muted</div>
              <div className="text-xs text-amber-800 font-medium mt-1 leading-relaxed max-w-[280px]">
                Alerts & telemetry updates are paused in Settings.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPushEnabled(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Enable Notifications
          </button>
        </div>
      )}

      {/* ─── ENHANCED FILTER TABS ─── */}
      <div className="flex items-center gap-1.5 p-2.5 bg-[#f8fafc] border-b border-[#e2e8f0] overflow-x-auto no-scrollbar text-xs">
        {[
          { id: 'all', label: 'All', count: notifications.length },
          { id: 'alerts', label: 'Alerts', count: notifications.filter((n) => n.type === 'alert').length },
          ...(isAdmin
            ? [
              {
                id: 'requests',
                label: 'Requests',
                count: notifications.filter((n) => n.type === 'request').length,
                badge: true,
              },
            ]
            : []),
          { id: 'system', label: 'System', count: notifications.filter((n) => n.type === 'system').length },
          { id: 'unread', label: 'Unread', count: unreadCount },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${isActive
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : 'text-[#64748b] hover:bg-[#e2e8f0]/70 hover:text-[#1e293b]'
                }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.3 rounded-full ${isActive
                      ? 'bg-white/20 text-white'
                      : tab.badge
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-[#e2e8f0] text-[#475569]'
                    }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── NOTIFICATION ITEMS LIST (Enlarged viewport) ─── */}
      <div className="max-h-[440px] overflow-y-auto divide-y divide-[#f1f5f9]">
        {filteredNotifications.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-[#f1f5f9] text-[#94a3b8] flex items-center justify-center mb-3">
              <Bell className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-[#475569]">No notifications found</p>
            <p className="text-xs text-[#94a3b8] mt-1 max-w-[240px]">
              {activeTab === 'unread'
                ? "You're all caught up!"
                : 'No notification updates in this category.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isRead = notif.read;
            const isRequest = notif.type === 'request';
            const isAlert = notif.type === 'alert';

            return (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-4 transition-all cursor-pointer relative group ${isRead ? 'bg-white hover:bg-[#f8fafc]' : 'bg-[#eff6ff]/70 hover:bg-[#eff6ff]'
                  }`}
              >
                {/* Unread Bar */}
                {!isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#2563eb] rounded-r-full" />
                )}

                <div className="flex items-start gap-3.5">
                  {/* Icon Avatar */}
                  <div className="shrink-0 mt-0.5">
                    {isAlert ? (
                      <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    ) : isRequest ? (
                      <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                        <UserPlus className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                        <Info className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#101828] truncate">{notif.title}</h4>
                      <span className="text-[11px] text-[#94a3b8] font-semibold shrink-0 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {notif.time}
                      </span>
                    </div>

                    <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Meta info tags */}
                    <div className="flex items-center gap-2 mt-2.5 flex-wrap text-[11px]">
                      {notif.facility && (
                        <span className="bg-[#f1f5f9] text-[#475569] font-semibold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {notif.facility}
                        </span>
                      )}

                      {isRequest && (
                        <span className="bg-purple-100 text-purple-800 font-extrabold px-2.5 py-0.5 rounded-lg">
                          Request · {notif.requestedRole || 'Access'}
                        </span>
                      )}

                      {notif.stationId && (
                        <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-lg">
                          {notif.stationId}
                        </span>
                      )}
                    </div>

                    {/* ─── Admin Inline Request Action Buttons ─── */}
                    {isRequest && isAdmin && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        {notif.requestStatus === 'approved' ? (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Approved
                          </span>
                        ) : notif.requestStatus === 'rejected' ? (
                          <span className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                            <XCircle className="w-4 h-4" /> Rejected
                          </span>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => handleApprove(e, notif)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleReject(e, notif)}
                                className="px-3 py-1.5 bg-slate-200 hover:bg-red-600 hover:text-white text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                            <span className="text-xs text-[#64748b] hover:text-[#2563eb] font-bold flex items-center gap-1">
                              View Admin <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─── FOOTER ─── */}
      <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => {
            navigate('/alerts');
            onClose();
          }}
          className="text-[#2563eb] hover:text-[#1d4ed8] font-bold flex items-center gap-1 cursor-pointer"
        >
          View All Alerts <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              navigate('/admin/dashboard');
              onClose();
            }}
            className="text-[#64748b] hover:text-[#101828] font-bold flex items-center gap-1 cursor-pointer"
          >
            Admin Panel <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
