import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Bell,
  Battery,
  Droplets,
  Thermometer,
  Activity,
  Video,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import AnimatedBellIcon from '../components/notifications/AnimatedBellIcon';
import NotificationDropdown from '../components/notifications/NotificationDropdown';
import StationDetailViewerModal from '../components/stations/StationDetailViewerModal';
import ExportReportModal from '../components/reports/ExportReportModal';

// Isolated AdminNotesCard to prevent whole-page re-renders on keystroke
const AdminNotesCard = React.memo(function AdminNotesCard() {
  const [noteText, setNoteText] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveNote = useCallback(() => {
    if (!noteText.trim()) return;
    setSavedNote(noteText);
    setIsSaved(true);
    const timer = setTimeout(() => setIsSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [noteText]);

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-3">
      <h2 className="text-base font-extrabold text-[#101828]">Admin Notes</h2>

      <textarea
        rows={4}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Add investigation notes..."
        className="w-full p-3 rounded-xl border border-[#e2e8f0] text-xs font-medium text-[#101828] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all bg-[#f8fafc] resize-none"
      />

      {savedNote && (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
          <span className="font-bold block mb-0.5 text-slate-900">Saved Note:</span>
          {savedNote}
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-[#94a3b8] font-medium">
          {isSaved ? '✓ Note saved' : 'Auto-saved draft'}
        </span>

        <button
          type="button"
          onClick={handleSaveNote}
          className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] transition-colors cursor-pointer shadow-sm"
        >
          Save Note
        </button>
      </div>
    </div>
  );
});

export default function AlertDetailPage() {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount, pushEnabled } = useNotifications();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState('Open');

  // Mock Alert details matching spec, memoized against status and user changes
  const alertData = useMemo(() => ({
    id: alertId || 'RB-07',
    species: 'Rat',
    confidence: '97%',
    status: alertStatus,
    priority: 'High',
    detectionTime: '2:13 AM - Jun 24, 2026',
    facility: 'Warehouse B',
    zone: 'Zone A',
    stationId: 'RB-07',
    stationName: 'RB-07',
    firmware: 'v3.2.1',
    signalStrength: '-62 dBm',
    lastSeen: '2:14 AM',
    lastSync: '2:14 AM - Jun 24, 2026',
    stationStatus: 'Active',
    health: {
      battery: 82,
      bait: 18,
      temperature: 24,
      humidity: 61,
    },
    timeline: [
      { id: 1, title: 'Rodent detected', time: '02:13 AM', color: '#ef4444' },
      { id: 2, title: 'Image uploaded', time: '02:13 AM', color: '#2563eb' },
      { id: 3, title: 'Cloud synchronized', time: '02:13 AM', color: '#8b5cf6' },
      { id: 4, title: 'Push notification delivered', time: '02:14 AM', color: '#10b981' },
      { id: 5, title: 'Admin opened alert', time: '02:15 AM', color: '#94a3b8' },
    ],
    audit: {
      created: '2:13 AM - Jun 24, 2026',
      viewedBy: user?.name || user?.displayName || 'System Administrator',
      resolvedBy: alertStatus === 'Resolved' ? (user?.name || user?.displayName || 'System Administrator') : '—',
      resolutionTime: alertStatus === 'Resolved' ? 'Just now' : '—',
      lastUpdated: '2:15 AM - Jun 24, 2026',
    },
  }), [alertId, alertStatus, user?.name, user?.displayName]);

  const stationForModal = useMemo(() => ({
    id: alertData.stationId,
    code: alertData.stationId,
    location: `${alertData.facility} · ${alertData.zone}`,
    warehouse: alertData.facility,
    zone: alertData.zone,
    bait: alertData.health.bait,
    battery: alertData.health.battery,
    detects: 24,
    statusLabel: alertData.stationStatus,
  }), [alertData]);


  return (
    <div className="p-6 md:p-8 bg-[#f4f6f9] min-h-screen font-sans">
      {/* ─── Top Navigation & Header ─── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/alerts')}
            className="w-9 h-9 rounded-xl bg-white border border-[#e2e8f0] flex items-center justify-center text-[#334155] hover:bg-[#f8fafc] transition-colors cursor-pointer shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-extrabold text-[#101828]">Alert Details</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Bell Icon Button & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="w-11 h-11 rounded-xl bg-white border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:text-[#101828] transition-colors cursor-pointer shadow-sm relative"
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

          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#fef2f2] text-[#ef4444] border border-[#fecaca]">
            {alertStatus}
          </span>
        </div>
      </div>

      {/* ─── Two-Column Main Content Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Left Column: Feed, Detection Summary, Timeline, Station Info */}
        <div className="flex flex-col gap-6 min-w-0">
          {/* 1. Camera Snapshot & Live Feed Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 md:p-6 shadow-sm flex flex-col gap-4">
            <div className="relative w-full h-[340px] rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex flex-col justify-between p-4 box-border">
              {/* Warehouse Camera Snapshot Background Graphic */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-85 mix-blend-luminosity"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop')`,
                }}
              />

              {/* Dark Gradient Overlay for camera look */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/70" />

              {/* Top Overlays */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                  <span className="text-[11px] font-extrabold text-white tracking-wide">LIVE FEED</span>
                </div>

                <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-extrabold shadow-md">
                  Critical Alert
                </span>
              </div>

              {/* Center Rodent Detection Bounding Box Graphic */}
              <div className="relative z-10 mx-auto my-auto border-2 border-dashed border-red-500 rounded-lg p-6 bg-red-500/10 backdrop-blur-[2px] flex flex-col items-center gap-1">
                <Video size={36} className="text-white/80" />
                <span className="text-xs font-bold text-white tracking-wide">RODENT DETECTED (97%)</span>
              </div>

              {/* Bottom Overlays */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90 bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-md">
                  {alertData.detectionTime}
                </span>

                <span className="text-xs font-bold text-white bg-[#2563eb] px-3.5 py-1 rounded-full shadow-md">
                  Station {alertData.stationId}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Detection Summary Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-[#101828]">Detection Summary</h2>

            <div className="divide-y divide-[#f1f5f9] text-xs font-semibold">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Species Detected</span>
                <span className="text-[#101828] font-bold">{alertData.species}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Confidence Score</span>
                <span className="text-emerald-600 font-extrabold">{alertData.confidence}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Current Status</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] font-bold border border-blue-200">
                  {alertData.status}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Priority</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                  {alertData.priority}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Detection Time</span>
                <span className="text-[#101828] font-bold">{alertData.detectionTime}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Facility</span>
                <span className="text-[#101828] font-bold">{alertData.facility}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Zone</span>
                <span className="text-[#101828] font-bold">{alertData.zone}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Station ID</span>
                <span className="text-[#2563eb] font-bold">{alertData.stationId}</span>
              </div>
            </div>
          </div>

          {/* 3. Alert Timeline Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-[#101828]">Alert Timeline</h2>

            <div className="flex flex-col gap-4 relative pl-2">
              {alertData.timeline.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
                  />
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#64748b] font-medium">{item.time}</span>
                    <span className="text-[#101828] font-bold">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Station Information Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-[#101828]">Station Information</h2>

            <div className="divide-y divide-[#f1f5f9] text-xs font-semibold">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Station Name</span>
                <span className="text-[#101828] font-bold">{alertData.stationName}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Facility</span>
                <span className="text-[#101828] font-bold">{alertData.facility}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Zone</span>
                <span className="text-[#101828] font-bold">{alertData.zone}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Current Status</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-200">
                  {alertData.stationStatus}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Last Seen</span>
                <span className="text-[#101828] font-bold">{alertData.lastSeen}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Last Sync</span>
                <span className="text-[#101828] font-bold">{alertData.lastSync}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Firmware Version</span>
                <span className="text-[#101828] font-bold">{alertData.firmware}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748b]">Signal Strength</span>
                <span className="text-[#101828] font-bold">{alertData.signalStrength}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry, Action Center, Admin Notes, Audit Trail */}
        <div className="flex flex-col gap-6 min-w-0">
          {/* 1. Telemetry Diagnostics Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-[#101828]">Telemetry Diagnostics</h2>

            <div className="grid grid-cols-2 gap-3">
              {/* Battery */}
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#64748b]">
                  <span>BATTERY</span>
                  <Battery size={14} className="text-emerald-500" />
                </div>
                <span className="text-lg font-extrabold text-[#101828]">{alertData.health.battery}%</span>
                <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${alertData.health.battery}%` }} />
                </div>
              </div>

              {/* Bait Remaining */}
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#64748b]">
                  <span>BAIT REMAINING</span>
                  <Droplets size={14} className="text-red-500" />
                </div>
                <span className="text-lg font-extrabold text-red-600">{alertData.health.bait}%</span>
                <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${alertData.health.bait}%` }} />
                </div>
              </div>

              {/* Temperature */}
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#64748b]">
                  <span>TEMPERATURE</span>
                  <Thermometer size={14} className="text-blue-500" />
                </div>
                <span className="text-lg font-extrabold text-[#2563eb]">{alertData.health.temperature}°C</span>
              </div>

              {/* Humidity */}
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#64748b]">
                  <span>HUMIDITY</span>
                  <Activity size={14} className="text-cyan-500" />
                </div>
                <span className="text-lg font-extrabold text-cyan-600">{alertData.health.humidity}%</span>
              </div>
            </div>
          </div>

          {/* 2. Action Center Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-3">
            <h2 className="text-base font-extrabold text-[#101828]">Action Center</h2>

            <button
              type="button"
              onClick={() => setAlertStatus('Resolved')}
              className="w-full py-2.5 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] transition-colors cursor-pointer shadow-md shadow-blue-200"
            >
              Resolve Alert
            </button>

            <button
              type="button"
              onClick={() => setAlertStatus('Investigating')}
              className="w-full py-2.5 rounded-xl bg-[#eff6ff] text-[#2563eb] text-xs font-bold hover:bg-[#dbeafe] transition-colors cursor-pointer border border-blue-200"
            >
              Mark as Investigating
            </button>

            <button
              type="button"
              onClick={() => setIsStationModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-white text-[#2563eb] border border-[#2563eb] text-xs font-bold hover:bg-blue-50 transition-colors cursor-pointer"
            >
              Open Station Details
            </button>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-white text-[#2563eb] border border-[#2563eb] text-xs font-bold hover:bg-blue-50 transition-colors cursor-pointer"
            >
              Generate Report
            </button>

            <button
              type="button"
              onClick={() => setAlertStatus('Dismissed')}
              className="w-full py-2 text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer text-center"
            >
              Dismiss as False Detection
            </button>

            <span className="text-[11px] text-[#94a3b8] font-medium text-center mt-1">
              * Requires confirmation on action
            </span>
          </div>

          {/* 3. Admin Notes Card (Isolated state prevents whole page re-renders) */}
          <AdminNotesCard />

          {/* 4. Audit Trail Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-[#101828]">Audit Trail</h2>

            <div className="divide-y divide-[#f1f5f9] text-xs font-semibold">
              <div className="py-2 flex items-center justify-between">
                <span className="text-[#64748b]">Created</span>
                <span className="text-[#101828] font-bold">{alertData.audit.created}</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-[#64748b]">Viewed By</span>
                <span className="text-[#101828] font-bold">{alertData.audit.viewedBy}</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-[#64748b]">Resolved By</span>
                <span className="text-[#101828] font-bold">{alertData.audit.resolvedBy}</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-[#64748b]">Resolution Time</span>
                <span className="text-[#101828] font-bold">{alertData.audit.resolutionTime}</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <span className="text-[#64748b]">Last Updated</span>
                <span className="text-[#101828] font-bold">{alertData.audit.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Station Detail Modal */}
      <StationDetailViewerModal
        isOpen={isStationModalOpen}
        station={stationForModal}
        onClose={() => setIsStationModalOpen(false)}
      />

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
