import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Search,
  Bell,
  ChevronRight,
  ShieldCheck,
  Video,
  Plus,
  X,
} from 'lucide-react'
import useStationsData from '../hooks/useStationsData'
import ErrorState from '../components/ui/ErrorState'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import AnimatedBellIcon from '../components/notifications/AnimatedBellIcon'
import NotificationDropdown from '../components/notifications/NotificationDropdown'
import { canAddStation } from '../utils/permissions'
import { getAvailableSitesList } from '../api/stationsData'
import { SEEDED_FACILITY_MAP } from '../firebase/config'

const getStatusPill = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'alert' || s === 'critical') {
    return { bg: '#fef2f2', color: '#ef4444', label: '• Alert' }
  }
  if (s === 'low_bait' || s.includes('bait')) {
    return { bg: '#fef3c7', color: '#d97706', label: '• Low Bait' }
  }
  if (s === 'low_battery' || s.includes('battery')) {
    return { bg: '#fef3c7', color: '#d97706', label: '• Low Battery' }
  }
  if (s === 'offline' || s === 'inactive') {
    return { bg: '#f1f5f9', color: '#64748b', label: '• Offline' }
  }
  return { bg: '#e7f9ef', color: '#0e7845', label: '• Online' }
}

export default function StationsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { unreadCount, pushEnabled } = useNotifications()
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false)
  const { data, isLoading, error, refresh } = useStationsData()

  const availableSites = useMemo(() => getAvailableSitesList(), [])
  const stations = useMemo(() => data?.stations || [], [data?.stations])

  const [searchQuery, setSearchQuery] = useState('')
  const [activeChip, setActiveChip] = useState('all')
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouses')
  const [showAllModal, setShowAllModal] = useState(false)

  // Parse URL search parameters (e.g. ?filter=alert or ?status=online)
  useEffect(() => {
    const filterParam = searchParams.get('filter') || searchParams.get('status')
    if (filterParam) {
      const p = filterParam.toLowerCase()
      if (p === 'alert' || p === 'alerts' || p === 'critical') {
        setActiveChip('alerts')
      } else if (p === 'online' || p === 'active') {
        setActiveChip('online')
      } else if (p === 'low-bait' || p === 'low_bait' || p === 'refill') {
        setActiveChip('low_bait')
      } else if (p === 'offline') {
        setActiveChip('offline')
      }
    }
  }, [searchParams])

  // Selected station for the Featured card in the right column
  const [selectedStationId, setSelectedStationId] = useState('RB-07')

  // Filter stations based on search, warehouse, active chip filter & Section 7 facility isolation (memoized)
  const filteredStations = useMemo(() => {
    return stations.filter((s) => {
      // Section 7: Facility Isolation Rule (technician/viewer only see their assigned facilities)
      if (user?.facilityIds && user.facilityIds.length > 0 && user.role !== 'admin') {
        const allowedNames = user.facilityIds.map((id) => (SEEDED_FACILITY_MAP[id] || id).toLowerCase());
        const stationSite = (s.warehouse || s.facility || s.building || s.location || '').toLowerCase();
        const isPermitted = allowedNames.some((name) =>
          stationSite.includes(name) || name.includes(stationSite)
        );
        if (!isPermitted) return false;
      }

      const q = searchQuery.toLowerCase().trim()
      const code = (s.code || s.id || '').toLowerCase()
      const loc = (s.location || '').toLowerCase()
      const status = (s.status || '').toLowerCase()
      const baitVal = typeof s.bait === 'number' ? s.bait : s.baitPercent || 0

      if (q && !code.includes(q) && !loc.includes(q)) return false

      if (selectedWarehouse !== 'All Warehouses') {
        const wh = (s.warehouse || s.facility || s.building || '').toLowerCase()
        if (wh !== selectedWarehouse.toLowerCase()) return false
      }

      if (activeChip === 'alerts' && status !== 'alert' && status !== 'critical') return false
      if (activeChip === 'low_bait' && baitVal >= 25 && status !== 'low_bait') return false
      if (activeChip === 'online' && status !== 'online' && status !== 'active') return false

      return true
    })
  }, [stations, user?.facilityIds, user?.role, searchQuery, selectedWarehouse, activeChip])

  // Selected station for the Featured card in the right column (memoized)
  const selectedStation = useMemo(() => {
    return (
      filteredStations.find((s) => s.id === selectedStationId || s.code === selectedStationId) ||
      filteredStations[0] ||
      stations[0] ||
      null
    )
  }, [filteredStations, selectedStationId, stations])

  if (isLoading && !data) {
    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ height: '40px', background: '#e2e8f0', borderRadius: '10px', width: '30%' }} />
        <div style={{ height: '50px', background: '#e2e8f0', borderRadius: '12px', width: '100%' }} />
        <div style={{ height: '400px', background: '#e2e8f0', borderRadius: '16px', width: '100%' }} />
      </div>
    )
  }

  if (error && !data) {
    return (
      <div style={{ padding: '24px' }}>
        <ErrorState onRetry={refresh} message="Failed to load telemetry station inventory." />
      </div>
    )
  }

  const featStatus = selectedStation ? getStatusPill(selectedStation.status) : { bg: '#e7f9ef', color: '#0e7845', label: '• Online' }
  const featBait = selectedStation ? (typeof selectedStation.bait === 'number' ? selectedStation.bait : selectedStation.baitPercent || 18) : 18
  const featBatt = selectedStation ? (typeof selectedStation.battery === 'number' ? selectedStation.battery : selectedStation.batteryPercent || 82) : 82
  const featDetects = selectedStation ? (selectedStation.detects || selectedStation.detections || 22) : 22

  return (
    <div
      style={{
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box',
        background: '#f4f6f9',
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ─── Top Header Bar (Matching Image 1) ─── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
            120 total · 118 active
          </span>
          <h1 style={{ margin: '2px 0 0', fontSize: '28px', fontWeight: '800', color: '#101828', letterSpacing: '-0.5px' }}>
            Stations
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Warehouse / Site Selector Dropdown */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '6px 14px',
              borderRadius: '100px',
              boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)',
            }}
          >
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={11} color="#ffffff" />
            </div>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                color: '#101828',
                cursor: 'pointer',
                outline: 'none',
                paddingRight: '4px',
              }}
            >
              <option value="All Warehouses">All Warehouses & Sites</option>
              {availableSites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
            <span style={{ fontSize: '11.5px', color: '#64748b' }}>Updated 2m ago</span>
          </div>


          {/* Bell Icon Button & Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '4px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
              title={pushEnabled ? 'Notifications' : 'Notifications Muted'}
            >
              <AnimatedBellIcon pushEnabled={pushEnabled} hasUnread={unreadCount > 0} size={40} />
              {pushEnabled && unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                  }}
                >
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

      {/* ─── Search Input & Admin Add Station Button Row ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search stations, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '46px',
              padding: '0 16px 0 44px',
              fontSize: '13.5px',
              color: '#101828',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              outline: 'none',
              boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Admin-only + Add Station Button */}
        {canAddStation(user) && (
          <button
            type="button"
            id="add-station-btn"
            onClick={() => navigate('/stations/add')}
            style={{
              height: '46px',
              padding: '0 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #1d61ff 0%, #004de6 100%)',
              color: '#ffffff',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(29, 97, 255, 0.28)',
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Plus size={18} />
            Add Station
          </button>
        )}
      </div>


      {/* ─── Filter Chips Row ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {[
          { id: 'all', label: 'All' },
          { id: 'alerts', label: 'Alerts' },
          { id: 'low_bait', label: 'Low bait' },
          { id: 'online', label: 'Online' },
        ].map((chip) => {
          const isActive = activeChip === chip.id
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setActiveChip(chip.id)}
              style={{
                padding: '6px 20px',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                border: isActive ? 'none' : '1px solid #e2e8f0',
                background: isActive ? '#1d61ff' : '#ffffff',
                color: isActive ? '#ffffff' : '#475569',
                boxShadow: isActive ? '0 4px 12px rgba(29, 97, 255, 0.3)' : '0 1px 2px rgba(16, 24, 40, 0.04)',
                transition: 'all 0.15s ease',
              }}
            >
              {chip.label}
            </button>
          )
        })}
      </div>

      {/* ─── Main Two-Column Layout (Matching Image 1) ─── */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        {/* Responsive CSS inject */}
        <style>{`
          @media (max-width: 999px) {
            .stations-page-grid {
              flex-direction: column !important;
            }
            .stations-table-col, .stations-featured-col {
              width: 100% !important;
              flex: none !important;
            }
          }
        `}</style>

        {/* ════════ LEFT COLUMN (~58% width - Table Card) ════════ */}
        <div
          className="stations-table-col"
          style={{
            flex: '0 0 58%',
            width: '58%',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e4e7ec',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(16, 24, 40, 0.04)',
            boxSizing: 'border-box',
          }}
        >
          {/* Table Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#101828' }}>
              All stations ({filteredStations.length})
            </h2>
            <button
              type="button"
              onClick={() => {
                setActiveChip('all')
                setSearchQuery('')
                setSelectedWarehouse('All Warehouses')
                setShowAllModal(true)
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '13px',
                fontWeight: '700',
                color: '#1d61ff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              See all <ChevronRight size={15} />
            </button>
          </div>

          {/* Station Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '10px 12px' }}>STATION ID</th>
                  <th style={{ padding: '10px 12px' }}>LOCATION</th>
                  <th style={{ padding: '10px 12px' }}>BAIT LEVEL</th>
                  <th style={{ padding: '10px 12px' }}>BATTERY</th>
                  <th style={{ padding: '10px 12px' }}>STATUS</th>
                  <th style={{ padding: '10px 12px', width: '24px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredStations.map((st) => {
                  const isSelected = selectedStation.id === st.id || selectedStation.code === st.code
                  const baitVal = typeof st.bait === 'number' ? st.bait : st.baitPercent || 18
                  const battVal = typeof st.battery === 'number' ? st.battery : st.batteryPercent || 82
                  const pill = getStatusPill(st.status)

                  return (
                    <tr
                      key={st.id || st.code}
                      onClick={() => setSelectedStationId(st.id || st.code)}
                      onDoubleClick={() => navigate(`/stations/${st.code || st.id}`)}
                      style={{
                        borderBottom: '1px solid #f8fafc',
                        cursor: 'pointer',
                        background: isSelected ? '#f0f4ff' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = '#f8fafc'
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      {/* STATION ID */}
                      <td style={{ padding: '14px 12px', fontWeight: '800', color: '#101828' }}>
                        {st.code || st.id}
                      </td>

                      {/* LOCATION */}
                      <td style={{ padding: '14px 12px', color: '#64748b', fontWeight: '500' }}>
                        {st.location}
                      </td>

                      {/* BAIT LEVEL (Number + Bar) */}
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '800', color: baitVal < 25 ? '#d97706' : '#101828', width: '32px' }}>
                            {baitVal}%
                          </span>
                          <div style={{ width: '48px', height: '5px', background: '#e2e8f0', borderRadius: '100px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${baitVal}%`, background: baitVal < 25 ? '#f59e0b' : '#3b82f6', borderRadius: '100px' }} />
                          </div>
                        </div>
                      </td>

                      {/* BATTERY */}
                      <td style={{ padding: '14px 12px', fontWeight: '600', color: '#64748b' }}>
                        {battVal}%
                      </td>

                      {/* STATUS PILL */}
                      <td style={{ padding: '14px 12px' }}>
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '100px',
                            background: pill.bg,
                            color: pill.color,
                          }}
                        >
                          {pill.label}
                        </span>
                      </td>

                      {/* Chevron Right */}
                      <td style={{ padding: '14px 12px', color: '#cbd5e1', textAlign: 'right' }}>
                        <ChevronRight size={16} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ════════ RIGHT COLUMN (~42% width - Featured Station Card) ════════ */}
        <div
          className="stations-featured-col"
          style={{
            flex: 1,
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e4e7ec',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(16, 24, 40, 0.04)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#101828' }}>
                Featured: {selectedStation.code || selectedStation.id}
              </h2>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                {selectedStation.warehouse || selectedStation.location}
              </span>
            </div>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '100px',
                background: featStatus.bg,
                color: featStatus.color,
              }}
            >
              {featStatus.label}
            </span>
          </div>

          {/* Dark Live Camera Feed Box */}
          <div
            style={{
              width: '100%',
              height: '210px',
              background: '#0b1120',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '14px',
              boxSizing: 'border-box',
            }}
          >
            {/* Top Left Live Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 0, 0, 0.5)', padding: '4px 10px', borderRadius: '100px', width: 'fit-content', backdropFilter: 'blur(4px)' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.5px' }}>LIVE</span>
            </div>

            {/* Camera Viewport Placeholder Center Icon */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.15, pointerEvents: 'none' }}>
              <Video size={72} color="#ffffff" />
            </div>

            {/* Bottom Overlays */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.75)', background: 'rgba(0, 0, 0, 0.5)', padding: '4px 10px', borderRadius: '100px' }}>
                Night vision · 24°C
              </span>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#ffffff', background: '#ef4444', padding: '4px 12px', borderRadius: '100px' }}>
                ~ Rat · 96%
              </span>
            </div>
          </div>

          {/* 3 Stat Cards Below Camera */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {/* Bait Level */}
            <div style={{ background: '#f8fafc', padding: '14px 12px', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', display: 'block' }}>Bait Level</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#d97706', marginTop: '2px', display: 'block' }}>{featBait}%</span>
              <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '100px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${featBait}%`, height: '100%', background: '#f59e0b', borderRadius: '100px' }} />
              </div>
            </div>

            {/* Battery */}
            <div style={{ background: '#f8fafc', padding: '14px 12px', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', display: 'block' }}>Battery</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#10b981', marginTop: '2px', display: 'block' }}>{featBatt}%</span>
              <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '100px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${featBatt}%`, height: '100%', background: '#10b981', borderRadius: '100px' }} />
              </div>
            </div>

            {/* Detections */}
            <div style={{ background: '#f8fafc', padding: '14px 12px', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', display: 'block' }}>Detections</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#2563eb', marginTop: '2px', display: 'block' }}>{featDetects}</span>
              <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '100px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', background: '#2563eb', borderRadius: '100px' }} />
              </div>
            </div>
          </div>

          {/* Action Buttons Below Stats */}
          {(!user || user.role === 'viewer' || user.role === 'VIEWER') ? (
            <button
              type="button"
              onClick={() => navigate(`/stations/${selectedStation.code || selectedStation.id}`)}
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '10px',
                border: '1px solid #1d61ff',
                background: '#1d61ff',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(29, 97, 255, 0.25)',
                transition: 'all 0.15s ease',
              }}
            >
              Locate Station
            </button>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button
                type="button"
                onClick={() => alert(`Refill dispatched for station ${selectedStation.code || selectedStation.id}`)}
                style={{
                  height: '42px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#1d61ff',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(29, 97, 255, 0.25)',
                  transition: 'all 0.15s ease',
                }}
              >
                Refill
              </button>

              <button
                type="button"
                onClick={() => alert(`Station ${selectedStation.code || selectedStation.id} alarm silenced.`)}
                style={{
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#334155',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Silence
              </button>

              <button
                type="button"
                onClick={() => navigate(`/stations/${selectedStation.code || selectedStation.id}`)}
                style={{
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#334155',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Locate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ════════ ALL STATIONS FULL OVERLAY MODAL ════════ */}
      {showAllModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowAllModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '900px',
              maxHeight: '90vh',
              background: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                  All Stations Directory ({stations.length})
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                  Complete list of all registered stations, bait levels & battery status across your facility.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body with Scrollable Table */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px' }}>STATION ID</th>
                    <th style={{ padding: '12px' }}>LOCATION</th>
                    <th style={{ padding: '12px' }}>BUILDING / ZONE</th>
                    <th style={{ padding: '12px' }}>BAIT LEVEL</th>
                    <th style={{ padding: '12px' }}>BATTERY</th>
                    <th style={{ padding: '12px' }}>STATUS</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {stations.map((st) => {
                    const baitVal = typeof st.bait === 'number' ? st.bait : st.baitPercent || 18
                    const battVal = typeof st.battery === 'number' ? st.battery : st.batteryPercent || 82
                    const pill = getStatusPill(st.status)

                    return (
                      <tr key={st.id || st.code} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '14px 12px', fontWeight: '800', color: '#101828' }}>
                          {st.code || st.id}
                        </td>
                        <td style={{ padding: '14px 12px', color: '#475569', fontWeight: '600' }}>
                          {st.location}
                        </td>
                        <td style={{ padding: '14px 12px', color: '#64748b', fontSize: '12px' }}>
                          {st.warehouse || st.facility || 'Warehouse B'} · {st.zone || 'Zone A'}
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: '700', color: baitVal < 25 ? '#ef4444' : '#1e293b' }}>
                          {baitVal}%
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: '700', color: battVal < 20 ? '#ef4444' : '#1e293b' }}>
                          {battVal}%
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span
                            style={{
                              fontSize: '11.5px',
                              fontWeight: '700',
                              padding: '3px 10px',
                              borderRadius: '100px',
                              background: pill.bg,
                              color: pill.color,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: pill.dot }} />
                            {st.statusLabel || st.statusText || pill.label}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStationId(st.id || st.code)
                              setShowAllModal(false)
                            }}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '8px',
                              border: '1px solid #2563eb',
                              background: '#2563eb',
                              color: '#ffffff',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: 'pointer',
                            }}
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #e2e8f0',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
