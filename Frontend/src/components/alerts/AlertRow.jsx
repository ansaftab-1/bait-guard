import React, { memo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../services/authService';
import AnimatedLottieIcon from '../ui/AnimatedLottieIcon';

const ICON_CONFIG = {
  rodent:   { color: '#ef4444', bg: '#fef2f2' },
  tamper:   { color: '#ef4444', bg: '#fef2f2' },
  bait:     { color: '#d97706', bg: '#fffbeb' },
  offline:  { color: '#9333ea', bg: '#f3e8ff' },
  resolved: { color: '#10b981', bg: '#ecfdf5' },
};

const STATUS_PILL_CONFIG = {
  Open:      { bg: '#fef2f2', text: '#ef4444', dot: '#ef4444' },
  Pending:   { bg: '#fffbeb', text: '#d97706', dot: '#f59e0b' },
  'In review': { bg: '#f3e8ff', text: '#9333ea', dot: null },
  Resolved:  { bg: '#ecfdf5', text: '#10b981', dot: null },
};

const AlertRow = memo(function AlertRow({ alert, onClick, onResolve, onSnooze, isCard = true }) {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN || user?.role === 'ADMIN';

  const iconType = alert.iconType || alert.type || 'rodent';
  const iconCfg = ICON_CONFIG[iconType] || ICON_CONFIG.rodent;

  const statusText = alert.statusText || 'Open';
  const statusCfg = STATUS_PILL_CONFIG[statusText] || STATUS_PILL_CONFIG.Open;

  const isResolved = statusText === 'Resolved';

  const handleResolve = (e) => {
    e.stopPropagation();
    if (onResolve) onResolve(alert);
    else window.alert(`Alert ${alert.id || alert.title} marked as Resolved`);
  };

  const handleSnooze = (e) => {
    e.stopPropagation();
    if (onSnooze) onSnooze(alert);
    else window.alert(`Alert ${alert.id || alert.title} snoozed`);
  };

  const isStationEvent = iconType === 'offline' || (alert.title && alert.title.toLowerCase().includes('station'));

  return (
    <div
      onClick={onClick}
      className={`px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all cursor-pointer group ${
        isCard
          ? 'bg-white rounded-2xl border border-[#e2e8f0] shadow-sm hover:border-[#cbd5e1] mb-3'
          : 'hover:bg-[#f8fafc]'
      }`}
    >
      <div className="flex items-start gap-4 min-w-0">
        {/* Left Lottie Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: isStationEvent ? '#f3e8ff' : iconCfg.bg }}
        >
          <AnimatedLottieIcon
            type={isStationEvent ? 'station' : 'warning'}
            colorTint={isStationEvent ? 'purple' : iconType === 'bait' ? 'amber' : 'red'}
            size={40}
          />
        </div>

        {/* Info Text */}
        <div className="min-w-0 flex-1">
          <span className="font-bold text-[#0f172a] text-sm leading-snug block">
            {alert.title}
          </span>
          <p className="text-xs text-[#64748b] mt-0.5 m-0 font-medium">
            {alert.stationCode} · {alert.location}
            {alert.timeAgo && alert.timeAgo.includes(':') && ` · ${alert.timeAgo}`}
          </p>

          {/* Admin Action Buttons (Show for Admin role on unresolved alerts) */}
          {isAdmin && !isResolved && (
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={handleResolve}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-full transition-colors border-none cursor-pointer shadow-sm"
              >
                Resolve
              </button>
              <button
                type="button"
                onClick={handleSnooze}
                className="px-4 py-1.5 text-xs font-bold text-[#334155] bg-[#f1f5f9] hover:bg-[#e2e8f0] rounded-full transition-colors border-none cursor-pointer"
              >
                Snooze
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Status Pill & Timestamp */}
      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
        {alert.timeAgo && !alert.timeAgo.includes(':') && (
          <span className="text-xs text-[#94a3b8] font-medium">{alert.timeAgo}</span>
        )}
        <span
          className="text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5"
          style={{ backgroundColor: statusCfg.bg, color: statusCfg.text }}
        >
          {statusCfg.dot && (
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: statusCfg.dot }}
            />
          )}
          {statusText}
        </span>
      </div>
    </div>
  );
});

export default AlertRow;
