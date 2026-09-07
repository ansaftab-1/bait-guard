import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import useOverviewData from '../../hooks/useOverviewData';
import useStationsData from '../../hooks/useStationsData';
import useAlertsData from '../../hooks/useAlertsData';
import AnimatedBellIcon from '../../components/notifications/AnimatedBellIcon';
import NotificationDropdown from '../../components/notifications/NotificationDropdown';
import AnimatedLottieIcon from '../../components/ui/AnimatedLottieIcon';
import ErrorState from '../../components/ui/ErrorState';
import OverviewSkeleton from '../../components/overview/OverviewSkeleton';
import {
  Wrench, MapPin, AlertTriangle, Radio, Activity,
  CheckCircle2, Clock, ArrowRight, RefreshCw, Database,
  ChevronDown, FileText, Settings, ClipboardList, AlertCircle, X, Search, Check
} from 'lucide-react';

const FULL_HISTORY_LOGS = [
  { id: '1', title: 'Bait Refilled', detail: 'BS-005 · Office Block Entry', time: '2:17 AM', date: 'Today', status: 'Completed', type: 'refill' },
  { id: '2', title: 'Trap Inspected', detail: 'BS-003 · Loading Bay North', time: '9:45 AM', date: 'Today', status: 'Completed', type: 'inspection' },
  { id: '3', title: 'Tamper Resolved', detail: 'BS-009 · Loading Bay South', time: 'Yesterday 4:30 PM', date: 'Yesterday', status: 'Completed', type: 'alert' },
  { id: '4', title: 'Bait Refilled', detail: 'BS-012 · Cold Storage Wing', time: 'Yesterday 11:20 AM', date: 'Yesterday', status: 'Completed', type: 'refill' },
  { id: '5', title: 'Trap Inspected', detail: 'BS-004 · Storage Facility C', time: '2 days ago 3:15 PM', date: '2 days ago', status: 'Completed', type: 'inspection' },
  { id: '6', title: 'Sensor Cleaning', detail: 'BS-001 · Main Entrance A', time: '3 days ago 10:00 AM', date: '3 days ago', status: 'Completed', type: 'cleaning' },
  { id: '7', title: 'Battery Replaced', detail: 'BS-015 · Cold Storage Room', time: '4 days ago 9:00 AM', date: '4 days ago', status: 'Completed', type: 'battery' },
  { id: '8', title: 'Trap Inspected', detail: 'BS-019 · Silo Loading Dock', time: '5 days ago 2:30 PM', date: '5 days ago', status: 'Completed', type: 'inspection' },
  { id: '9', title: 'Bait Refilled', detail: 'BS-022 · East Gate Perimeter', time: '1 week ago', date: '1 week ago', status: 'Completed', type: 'refill' },
];

export default function TechnicianDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount, pushEnabled } = useNotifications();
  const { isLoading, error, refresh } = useOverviewData();
  const { data: stationsData } = useStationsData();
  const { data: alertsData } = useAlertsData();

  // Dropdown & Modal States
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('Warehouse A');
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Pending' | 'In Progress' | 'Completed' | 'High / Urgent'
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // Search & filter states inside History Modal
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState('All');

  // Simulated Refresh State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedText, setLastUpdatedText] = useState('Updated 2m ago');

  // Toast State
  const [toasts, setToasts] = useState([]);

  // Dynamic Route Assignments (initially matching the screenshot)
  const [routes, setRoutes] = useState([
    { id: 'BS-005', location: 'Office Block Entry', detail: 'Refill bait & clean sensor', priority: 'Normal', status: 'Pending' },
    { id: 'BS-003', location: 'Loading Bay North', detail: 'Low bait alert (18%) response', priority: 'High', status: 'In Progress' },
    { id: 'BS-009', location: 'Loading Bay South', detail: 'Tamper alert inspection', priority: 'Urgent', status: 'Pending' },
    { id: 'BS-012', location: 'Cold Storage Wing', detail: 'Routine monthly cycle check', priority: 'Low', status: 'Completed' },
  ]);

  // Dropdown state for status change of each station card
  const [activeStatusChangeId, setActiveStatusChangeId] = useState(null);

  // Stats derived from route assignments, synced to mock screenshot values
  const [completedTodayOffset, setCompletedTodayOffset] = useState(0);

  const helperShowToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Calculations for stats (memoized)
  const totalAssignedCount = 18;
  
  const pendingCount = useMemo(() => routes.filter(r => r.status !== 'Completed').length, [routes]); 
  const completedCount = useMemo(() => routes.filter(r => r.status === 'Completed').length, [routes]);
  
  const completedToday = useMemo(() => 2 + completedTodayOffset, [completedTodayOffset]);
  const servicedStations = useMemo(() => 15 + completedTodayOffset, [completedTodayOffset]);
  
  // Health score calculation (memoized)
  const healthScore = useMemo(
    () => Math.min(100, 80 + Math.round((servicedStations / totalAssignedCount) * 20)),
    [servicedStations]
  );

  const handleStatusChange = useCallback((routeId, newStatus) => {
    setRoutes((prevRoutes) => {
      const prevRoute = prevRoutes.find(r => r.id === routeId);
      if (!prevRoute || prevRoute.status === newStatus) return prevRoutes;

      if (newStatus === 'Completed' && prevRoute.status !== 'Completed') {
        setCompletedTodayOffset(prev => prev + 1);
        helperShowToast(`Marked ${routeId} as Completed! Health score increased.`, 'success');
      } else if (prevRoute.status === 'Completed' && newStatus !== 'Completed') {
        setCompletedTodayOffset(prev => Math.max(-2, prev - 1));
        helperShowToast(`Marked ${routeId} as ${newStatus}.`, 'info');
      } else {
        helperShowToast(`Updated ${routeId} to ${newStatus}.`, 'info');
      }

      return prevRoutes.map(r => r.id === routeId ? { ...r, status: newStatus } : r);
    });
    setActiveStatusChangeId(null);
  }, [helperShowToast]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    helperShowToast('Refreshing dashboard telemetry...', 'info');
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdatedText('Updated just now');
      helperShowToast('Dashboard data refreshed successfully!', 'success');
    }, 800);
  }, [helperShowToast]);

  const handleExportReports = useCallback(() => {
    helperShowToast('Compiling and generating reports PDF...', 'info');
    setTimeout(() => {
      helperShowToast('Report "Technician_ServiceLog_WarehouseA.pdf" downloaded successfully.', 'success');
    }, 1500);
  }, [helperShowToast]);

  // Filter routes based on filter selections (memoized)
  const filteredRoutes = useMemo(() => {
    return routes.filter(r => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Pending') return r.status === 'Pending';
      if (activeFilter === 'In Progress') return r.status === 'In Progress';
      if (activeFilter === 'Completed') return r.status === 'Completed';
      if (activeFilter === 'High / Urgent') return r.priority === 'High' || r.priority === 'Urgent';
      return true;
    });
  }, [routes, activeFilter]);

  const filteredHistoryLogs = useMemo(() => {
    return FULL_HISTORY_LOGS.filter(log => {
      const matchesSearch = log.title.toLowerCase().includes(historySearch.toLowerCase()) || 
                            log.detail.toLowerCase().includes(historySearch.toLowerCase());
      
      if (historyFilter === 'All') return matchesSearch;
      if (historyFilter === 'Refills') return matchesSearch && log.type === 'refill';
      if (historyFilter === 'Inspections') return matchesSearch && log.type === 'inspection';
      if (historyFilter === 'Alerts') return matchesSearch && log.type === 'alert';
    });
  }, [historySearch, historyFilter]);

  if (isLoading) return <div style={{ padding: '24px' }}><OverviewSkeleton /></div>;
  if (error) return <div style={{ padding: '24px' }}><ErrorState onRetry={refresh} /></div>;

  return (
    <div className="p-6 bg-[#f4f7fb] min-h-screen text-[#1a2d42] font-[Inter,system-ui,sans-serif] relative select-none">
      
      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-white text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'info' ? 'bg-[#2563eb]' : 'bg-[#e11d48]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 size={16} />}
            {toast.type === 'info' && <Activity size={16} />}
            {toast.type === 'error' && <AlertTriangle size={16} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* ─── Header Section ─── */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Good morning,
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {user?.name || 'Tariq Khan'}
            </h1>
            <span className="bg-emerald-100/90 text-emerald-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
              Technician
            </span>
          </div>
        </div>

        {/* Header Right actions */}
        <div className="flex items-center gap-3 relative">
          
          {/* Warehouse Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowWarehouseDropdown(!showWarehouseDropdown)}
              className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm hover:bg-slate-50 transition-all text-xs font-bold text-slate-800 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-[#eff6ff] flex items-center justify-center text-[#2563eb]">
                <Database size={12} className="fill-[#2563eb]" />
              </div>
              <span>{selectedWarehouse}</span>
              <span className="text-[11px] text-slate-400 font-medium">{lastUpdatedText}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {/* Warehouse Dropdown Panel */}
            {showWarehouseDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowWarehouseDropdown(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Site
                  </div>
                  {['Warehouse A', 'Warehouse B', 'Cold Storage Complex', 'Office Complex Block'].map((site) => (
                    <button
                      key={site}
                      onClick={() => {
                        setSelectedWarehouse(site);
                        setShowWarehouseDropdown(false);
                        helperShowToast(`Switched to ${site}`, 'success');
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between cursor-pointer ${
                        selectedWarehouse === site ? 'bg-slate-50 text-[#2563eb]' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{site}</span>
                      {selectedWarehouse === site && <Check size={14} className="text-[#2563eb]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 shadow-sm relative transition-all cursor-pointer"
            >
              <AnimatedBellIcon pushEnabled={pushEnabled} hasUnread={unreadCount > 0} size={40} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotificationsDropdown && (
              <NotificationDropdown onClose={() => setShowNotificationsDropdown(false)} />
            )}
          </div>

        </div>
      </div>

      {/* ─── Top Metrics Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        
        {/* Navy Blue Health Ring Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-[#0d1e3a] via-[#15325c] to-[#11427c] rounded-3xl p-5 text-white flex items-center gap-5 shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
          
          {/* Circular SVG Progress Meter */}
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeDasharray={`${healthScore} ${100 - healthScore}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
              <span className="text-[20px] font-extrabold">{healthScore}</span>
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">Health</span>
            </div>
          </div>

          {/* Stats info */}
          <div className="flex flex-col gap-1.5 z-10">
            <div className="bg-emerald-500/25 border border-emerald-500/40 rounded-full px-3 py-0.5 text-[9.5px] font-extrabold text-emerald-400 w-fit uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {servicedStations} / {totalAssignedCount} Stations Serviced
            </div>
            <div className="text-[13px] font-bold text-white tracking-tight">
              {pendingCount} pending stations remain on today's route
            </div>
            <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <Activity size={12} />
              +{completedToday} completed today
            </div>
          </div>
        </div>

        {/* Stat Card 2: Assigned Stations */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <AnimatedLottieIcon type="assigned" colorTint="none" size={32} />
            </div>
            <span className="bg-blue-50 text-blue-600 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
              Live
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-800 leading-none">{totalAssignedCount}</span>
            <span className="text-xs font-extrabold text-slate-800 block mt-1.5">Assigned Stations</span>
            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">In {selectedWarehouse}</span>
          </div>
        </div>

        {/* Stat Card 3: Pending Service */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <AnimatedLottieIcon type="pending" colorTint="none" size={32} />
            </div>
            <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
              Todo
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-800 leading-none">{pendingCount}</span>
            <span className="text-xs font-extrabold text-slate-800 block mt-1.5">Pending Service</span>
            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">Remaining on route</span>
          </div>
        </div>

        {/* Stat Card 4: Active Alerts */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AnimatedLottieIcon type="alert" size={32} />
            </div>
            <span className="bg-red-100 text-red-800 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
              Urgent
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-800 leading-none">2</span>
            <span className="text-xs font-extrabold text-slate-800 block mt-1.5">Active Alerts</span>
            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">Tamper & Low Bait</span>
          </div>
        </div>

        {/* Stat Card 5: Overdue */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-sm relative overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-100/50 flex items-center justify-center">
              <AnimatedLottieIcon type="warning" size={32} />
            </div>
            <span className="bg-rose-950 text-rose-100 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
              Critical
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-800 leading-none">1</span>
            <span className="text-xs font-extrabold text-slate-800 block mt-1.5">Overdue</span>
            <span className="text-[11px] text-slate-400 font-medium block mt-0.5">Missed cycle target</span>
          </div>
        </div>

      </div>

      {/* ─── Quick Actions Panel ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 mb-6 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 px-1">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Action 1: Refresh */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2.5 bg-slate-50 border border-slate-150 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={`text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Action 2: Facility Map */}
          <button
            onClick={() => navigate('/facility-map')}
            className="flex items-center justify-center gap-2.5 bg-slate-50 border border-slate-150 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
          >
            <MapPin size={14} className="text-slate-600" />
            <span>Facility Map</span>
          </button>

          {/* Action 3: Export Reports */}
          <button
            onClick={handleExportReports}
            className="flex items-center justify-center gap-2.5 bg-slate-50 border border-slate-150 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
          >
            <FileText size={14} className="text-slate-600" />
            <span>Export Reports</span>
          </button>

          {/* Action 4: System Config */}
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center justify-center gap-2.5 bg-slate-50 border border-slate-150 rounded-2xl py-3 px-4 text-xs font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
          >
            <Settings size={14} className="text-slate-600" />
            <span>System Config</span>
          </button>

        </div>
      </div>

      {/* ─── Two Column Content Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Today's Route Assignments */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 relative">
              <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
                Today's Route Assignments
              </h2>
              
              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="text-xs font-bold text-[#2563eb] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  Filter: {activeFilter} ({filteredRoutes.length})
                  <ChevronDown size={12} />
                </button>

                {/* Filter Dropdown list */}
                {showFilterDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)} />
                    <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-100">
                      {['All', 'Pending', 'In Progress', 'Completed', 'High / Urgent'].map((filterOpt) => (
                        <button
                          key={filterOpt}
                          onClick={() => {
                            setActiveFilter(filterOpt);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                            activeFilter === filterOpt ? 'bg-slate-50 text-[#2563eb]' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {filterOpt}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Assignments List */}
            <div className="flex flex-col gap-3">
              {filteredRoutes.map((route) => {
                const priorityColors = {
                  Low: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
                  Normal: { bg: 'bg-blue-50/70', text: 'text-blue-600', border: 'border-blue-100' },
                  High: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
                  Urgent: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
                };

                const statusColors = {
                  Pending: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
                  'In Progress': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
                  Completed: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
                };

                return (
                  <div
                    key={route.id}
                    className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50/60 hover:border-slate-200 transition-all relative group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                          <span>{route.id}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-bold">{route.location}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {route.detail}
                        </div>
                      </div>
                    </div>

                    {/* Actions and Badges */}
                    <div className="flex items-center gap-2.5 relative">
                      
                      {/* Priority Chip */}
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        priorityColors[route.priority].bg
                      } ${priorityColors[route.priority].text} ${priorityColors[route.priority].border}`}>
                        {route.priority}
                      </span>

                      {/* Interactive Status Selector Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveStatusChangeId(activeStatusChangeId === route.id ? null : route.id)}
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full cursor-pointer flex items-center gap-1 transition-all ${
                            statusColors[route.status]
                          }`}
                        >
                          <span>{route.status}</span>
                          {route.status === 'Completed' ? <Check size={10} /> : <ChevronDown size={10} />}
                        </button>

                        {activeStatusChangeId === route.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setActiveStatusChangeId(null)} />
                            <div className="absolute right-0 mt-1.5 w-32 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-100">
                              {['Pending', 'In Progress', 'Completed'].map((statusOption) => (
                                <button
                                  key={statusOption}
                                  onClick={() => handleStatusChange(route.id, statusOption)}
                                  className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold cursor-pointer hover:bg-slate-50 ${
                                    route.status === statusOption ? 'text-[#2563eb]' : 'text-slate-700'
                                  }`}
                                >
                                  {statusOption}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Navigate to detail */}
                      <button
                        onClick={() => navigate(`/stations/${route.id}`)}
                        className="w-7 h-7 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                        title="View Station Details"
                      >
                        <ArrowRight size={13} />
                      </button>

                    </div>
                  </div>
                );
              })}

              {filteredRoutes.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                  No routes match the selected filter.
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Showing {filteredRoutes.length} of {routes.length} assignments</span>
            <span>Last sync: 2 mins ago</span>
          </div>
        </div>

        {/* RIGHT COLUMN: This Week's Activity */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  This Week's Activity
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-black text-slate-800 leading-none">12</span>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    +3 vs last week
                  </span>
                </div>
              </div>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                Weekly Target: 18
              </span>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="relative pt-4">
              <svg viewBox="0 0 450 140" className="w-full h-32">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                <line x1="0" y1="20" x2="450" y2="20" stroke="#f8fafc" strokeWidth="1" />
                <line x1="0" y1="60" x2="450" y2="60" stroke="#f8fafc" strokeWidth="1" />
                <line x1="0" y1="100" x2="450" y2="100" stroke="#f8fafc" strokeWidth="1" />

                {/* Shaded Area */}
                <path
                  d="M 10 120 
                     C 60 90, 80 100, 110 80
                     C 140 60, 170 120, 200 95
                     C 230 70, 260 50, 290 40
                     C 320 30, 350 70, 380 50
                     C 410 30, 430 80, 440 90
                     L 440 120 Z"
                  fill="url(#chartGrad)"
                />

                {/* Smooth Curve Line */}
                <path
                  d="M 10 120 
                     C 60 90, 80 100, 110 80
                     C 140 60, 170 120, 200 95
                     C 230 70, 260 50, 290 40
                     C 320 30, 350 70, 380 50
                     C 410 30, 430 80, 440 90"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Points */}
                <circle cx="110" cy="80" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="200" cy="95" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="290" cy="40" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="380" cy="50" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="440" cy="90" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
              </svg>

              {/* Flex Labels */}
              <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1 mt-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-medium text-center">
            Daily logs automatically sync with sensor activity stream.
          </div>
        </div>

      </div>

      {/* ─── Recent Service Log Section ─── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 mt-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
            Recent Service Log
          </h2>
          <button
            onClick={() => setShowHistoryModal(true)}
            className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
          >
            View All History
          </button>
        </div>

        <div className="flex flex-col">
          {[
            { title: 'Bait Refilled', detail: 'BS-005 · Office Block Entry', time: '2:17 AM', dateText: 'Today', status: 'Completed' },
            { title: 'Trap Inspected', detail: 'BS-003 · Loading Bay North', time: '9:45 AM', dateText: 'Today', status: 'Completed' },
            { title: 'Tamper Resolved', detail: 'BS-009 · Loading Bay South', time: 'Yesterday', dateText: 'Yesterday', status: 'Completed' },
          ].map((log, idx, arr) => (
            <div
              key={idx}
              className={`flex items-center justify-between py-3.5 ${
                idx === arr.length - 1 ? 'pb-1' : 'border-b border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={15} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {log.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {log.detail}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 font-semibold">{log.time}</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── History Modal Window (View All History) ─── */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2.5px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl flex flex-col max-h-[80vh] overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-800">
                  Service History Log
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Complete historic record of field actions
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Filters & Search */}
            <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by station, location, or task..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb] focus:bg-white transition-all font-semibold"
                />
              </div>

              {/* Filter Row */}
              <div className="flex gap-2">
                {['All', 'Refills', 'Inspections', 'Alerts'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setHistoryFilter(f)}
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer transition-all ${
                      historyFilter === f
                        ? 'bg-[#2563eb] text-white border-[#2563eb]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredHistoryLogs.map((log) => (
                <div
                  key={log.id}
                  className="border border-slate-100 rounded-xl p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {log.title}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {log.detail}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">
                      {log.time}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-100 inline-block mt-1">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}

              {filteredHistoryLogs.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                  No historical logs match your search.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span>Showing {filteredHistoryLogs.length} logs</span>
              <button
                onClick={handleExportReports}
                className="text-[#2563eb] hover:underline cursor-pointer flex items-center gap-1"
              >
                <FileText size={12} />
                Download PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
