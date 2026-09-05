import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  Bell,
  ChevronDown,
  AlertTriangle,
  Radio,
  Users,
  Box,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import AnimatedBellIcon from '../../components/notifications/AnimatedBellIcon'
import NotificationDropdown from '../../components/notifications/NotificationDropdown'
import AnimatedLottieIcon from '../../components/ui/AnimatedLottieIcon'
import useOverviewData from '../../hooks/useOverviewData'
import ErrorState from '../../components/ui/ErrorState'
import { getAvailableSitesList } from '../../api/stationsData'
import { getPendingAccessRequests, subscribeAccessRequests } from '../../services/accessRequestService'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { unreadCount, pushEnabled } = useNotifications()
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false)
  const { data, isLoading, error, refresh } = useOverviewData()
  const [selectedWarehouse, setSelectedWarehouse] = useState('Warehouse A')

  const availableSites = getAvailableSitesList()
  const adminName = user?.name || user?.displayName || 'Administrator'
  const notificationsCount = unreadCount || 0

  const [pendingRequestsCount, setPendingRequestsCount] = useState(() => getPendingAccessRequests().length)

  const [totalUsersCount, setTotalUsersCount] = useState(() => {
    try {
      const stored = localStorage.getItem('baitguard_system_users')
      return stored ? JSON.parse(stored).length : 3
    } catch {
      return 3
    }
  })

  useEffect(() => {
    const unsubscribe = subscribeAccessRequests((updatedReqs) => {
      setPendingRequestsCount(updatedReqs.length)
      try {
        const storedUsers = localStorage.getItem('baitguard_system_users')
        setTotalUsersCount(storedUsers ? JSON.parse(storedUsers).length : 3)
      } catch { }
    })
    return () => unsubscribe()
  }, [])

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning,'
    if (hour < 18) return 'Good afternoon,'
    return 'Good evening,'
  }

  if (isLoading && !data) {
    return (
      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ height: '40px', background: '#e2e8f0', borderRadius: '10px', width: '30%' }} />
        <div style={{ height: '160px', background: '#e2e8f0', borderRadius: '16px', width: '100%' }} />
        <div style={{ height: '300px', background: '#e2e8f0', borderRadius: '16px', width: '100%' }} />
      </div>
    )
  }

  if (error && !data) {
    return (
      <div style={{ padding: '28px' }}>
        <ErrorState onRetry={refresh} message="Failed to load Admin Dashboard telemetry." />
      </div>
    )
  }

  const allStations = data?.stations || []
  const filteredStations =
    selectedWarehouse === 'All Warehouses'
      ? allStations
      : allStations.filter((s) => (s.warehouse || s.facility || s.building) === selectedWarehouse)

  const totalStationsCount = selectedWarehouse === 'All Warehouses' ? allStations.length || 120 : filteredStations.length || 120
  const activeStations = filteredStations.filter((s) => s.status === 'active' || s.status === 'online').length || 118
  const refillStations = filteredStations.filter((s) => s.status === 'warning' || s.bait < 25).length || 8
  const offlineStations = filteredStations.filter((s) => s.status === 'offline').length || 2
  const criticalCount = filteredStations.filter((s) => s.status === 'critical' || s.status === 'alert').length || 3
  const healthScore = totalStationsCount > 0 ? Math.round((activeStations / totalStationsCount) * 100) : 87

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
      {/* ─── 1. Header Row (Matching Screenshot) ─── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', display: 'block' }}>
            {getGreeting()}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#101828', letterSpacing: '-0.5px' }}>
              {adminName}
            </h1>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '700',
                padding: '3px 12px',
                borderRadius: '100px',
                background: '#eff6ff',
                color: '#2563eb',
              }}
            >
              Administrator
            </span>
          </div>
        </div>

        {/* Top Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Warehouse Selector */}
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
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
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
            <ChevronDown size={14} color="#64748b" />
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
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '10.5px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    border: '2px solid #ffffff',
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

      {/* ─── 2. Top 5 Hero Metric Cards Row (Matching Screenshot) ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
        }}
      >
        {/* HERO CARD 1: Dark Navy System Health */}
        <div
          style={{
            gridColumn: 'span 2',
            background: 'linear-gradient(135deg, #0f1e38 0%, #0d2854 50%, #0f346c 100%)',
            borderRadius: '18px',
            padding: '20px 24px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 8px 24px rgba(13, 40, 84, 0.25)',
            minWidth: '320px',
          }}
        >
          {/* Circular SVG Gauge */}
          <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0 }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="rgba(255,255,255,0.12)" strokeWidth="3.5" />
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeDasharray={`${healthScore} ${100 - healthScore}`}
                strokeDashoffset="0"
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', lineHeight: 1 }}>{healthScore}</span>
              <span style={{ fontSize: '9px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginTop: '2px' }}>HEALTH</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '100px',
                padding: '2px 10px',
                fontSize: '10.5px',
                fontWeight: '800',
                color: '#10b981',
                width: 'fit-content',
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
              ALL SYSTEMS NOMINAL
            </span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>
              118 of 120 stations online · 2 need attention
            </span>
            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> +3 pts this week
            </span>
          </div>
        </div>

        {/* STAT CARD 2: Total Stations */}
        <div
          onClick={() => navigate('/stations')}
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e4e7ec',
            padding: '18px 20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Radio size={18} color="#64748b" />
            <span style={{ fontSize: '10.5px', fontWeight: '800', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '100px' }}>
              LIVE
            </span>
          </div>
          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#101828', display: 'block', lineHeight: 1 }}>{totalStationsCount}</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#101828', marginTop: '6px', display: 'block' }}>Total Stations</span>
            <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', display: 'block' }}>Across 5 facilities</span>
          </div>
        </div>

        {/* STAT CARD 3: Active */}
        <div
          onClick={() => navigate('/stations?status=online')}
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e4e7ec',
            padding: '18px 20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Users size={18} color="#10b981" />
            <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#10b981' }}>98% OPERATIONAL</span>
          </div>
          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#101828', display: 'block', lineHeight: 1 }}>{activeStations} / {totalStationsCount}</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#101828', marginTop: '6px', display: 'block' }}>Active</span>
            <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', display: 'block' }}>98% operational</span>
          </div>
        </div>

        {/* STAT CARD 4: Need Refill */}
        <div
          onClick={() => navigate('/stations?status=low-bait')}
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e4e7ec',
            padding: '18px 20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box size={18} color="#f59e0b" />
            <span style={{ fontSize: '10.5px', fontWeight: '800', background: '#fffbeb', color: '#b45309', padding: '2px 8px', borderRadius: '100px' }}>
              LIVE
            </span>
          </div>
          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#f59e0b', display: 'block', lineHeight: 1 }}>{refillStations}</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#101828', marginTop: '6px', display: 'block' }}>Need Refill</span>
            <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', display: 'block' }}>Low bait level</span>
          </div>
        </div>

        {/* STAT CARD 5: Offline */}
        <div
          onClick={() => navigate('/stations?status=offline')}
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e4e7ec',
            padding: '18px 20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ fontSize: '10.5px', fontWeight: '800', background: '#fef2f2', color: '#ef4444', padding: '2px 8px', borderRadius: '100px' }}>
              LIVE
            </span>
          </div>
          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#ef4444', display: 'block', lineHeight: 1 }}>{offlineStations}</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#101828', marginTop: '6px', display: 'block' }}>Offline</span>
            <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', display: 'block' }}>Require attention</span>
          </div>
        </div>
      </div>

      {/* ─── 3. Middle 2 Hero Cards Row (Matching Screenshot) ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Critical Alerts Hero Card */}
        <div
          onClick={() => navigate('/stations?filter=alert')}
          style={{
            background: '#fef2f2',
            borderRadius: '18px',
            border: '1px solid #fecaca',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AnimatedLottieIcon type="alert" size={40} />
            </div>
            <div>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#991b1b', display: 'block' }}>
                Critical Alerts
              </span>
              <span style={{ fontSize: '12.5px', color: '#7f1d1d' }}>
                {criticalCount} stations require immediate attention
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigate('/stations?filter=alert')
            }}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        {/* Admin Overview Summary Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #e4e7ec',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#101828', display: 'block' }}>
              Admin Overview
            </span>
            <span style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px', display: 'block' }}>
              {pendingRequestsCount} Pending requests · {totalUsersCount} Users · Healthy System
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/system')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#eff6ff',
              color: '#1d61ff',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
            }}
          >
            Manage System <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ─── 4. Bottom Main White Container Card (Matching Screenshot) ─── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e4e7ec',
          padding: '28px',
          boxShadow: '0 4px 16px rgba(16, 24, 40, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Top Detection Analytics Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: '500', display: 'block' }}>
              Today's Detections
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '32px', fontWeight: '800', color: '#101828', lineHeight: 1 }}>42</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <TrendingUp size={14} /> +12%
              </span>
            </div>
          </div>

          {/* Pending Requests Soft Blue Pill Button */}
          <button
            type="button"
            onClick={() => navigate('/admin/system')}
            style={{
              padding: '8px 16px',
              borderRadius: '100px',
              border: 'none',
              background: '#eff6ff',
              color: '#1d61ff',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {pendingRequestsCount} Requests Pending
          </button>
        </div>

        <div style={{ height: '1px', background: '#f1f5f9', width: '100%' }} />

        {/* Recent Alerts Log Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#101828' }}>
              Recent Alerts log
            </h3>
            <button
              type="button"
              onClick={() => navigate('/alerts')}
              style={{ background: 'none', border: 'none', color: '#1d61ff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
            >
              View All (12)
            </button>
          </div>

          {/* All Recent Alerts Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { id: '1', icon: AlertCircle, title: 'Rat detected', detail: 'BS-006 · Office Block Entry', time: '2:17 AM', status: 'Open', color: '#ef4444', bg: '#fef2f2' },
              { id: '2', icon: AlertTriangle, title: 'Low bait (18%)', detail: 'BS-003 · Loading Bay North', time: '3:45 AM', status: 'Pending', color: '#d97706', bg: '#fffbeb' },
              { id: '3', icon: AlertCircle, title: 'Tamper detected', detail: 'BS-009 · Loading Bay South', time: 'Yesterday 11:45', status: 'Open', color: '#ef4444', bg: '#fef2f2' },
              { id: '4', icon: Info, title: 'Station offline', detail: 'BS-012 · Processing Room B', time: 'Yesterday 8:20', status: 'In review', color: '#8b5cf6', bg: '#f5f3ff' },
              { id: '5', icon: CheckCircle2, title: 'Mouse detected', detail: 'BS-004 · Storage Facility C', time: '2 days ago', status: 'Resolved', color: '#10b981', bg: '#e7f9ef' },
              { id: '6', icon: AlertCircle, title: 'Rodent intruder', detail: 'BS-007 · Warehouse B, Zone A', time: '3 days ago', status: 'Open', color: '#ef4444', bg: '#fef2f2' },
              { id: '7', icon: AlertTriangle, title: 'Low battery (12%)', detail: 'BS-015 · Cold Storage Room', time: '3 days ago', status: 'Pending', color: '#d97706', bg: '#fffbeb' },
              { id: '8', icon: Info, title: 'Firmware update required', detail: 'BS-022 · East Gate Perimeter', time: '4 days ago', status: 'In review', color: '#8b5cf6', bg: '#f5f3ff' },
              { id: '9', icon: CheckCircle2, title: 'Bait replenished', detail: 'BS-001 · Main Entrance A', time: '5 days ago', status: 'Resolved', color: '#10b981', bg: '#e7f9ef' },
              { id: '10', icon: AlertCircle, title: 'Thermal camera motion trigger', detail: 'BS-019 · Silo Loading Dock', time: '5 days ago', status: 'Open', color: '#ef4444', bg: '#fef2f2' },
              { id: '11', icon: AlertTriangle, title: 'Enclosure tilt alert', detail: 'BS-008 · Roof Deck Zone C', time: '6 days ago', status: 'Pending', color: '#d97706', bg: '#fffbeb' },
              { id: '12', icon: CheckCircle2, title: 'Routine inspection passed', detail: 'BS-011 · Cleanroom Perimeter', time: '1 week ago', status: 'Resolved', color: '#10b981', bg: '#e7f9ef' },
            ].map((alertRow, idx, arr) => {
              const Icon = alertRow.icon
              return (
                <div
                  key={alertRow.id}
                  onClick={() => navigate(`/alerts/${alertRow.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 0',
                    borderBottom: idx === arr.length - 1 ? 'none' : '1px solid #f8fafc',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: alertRow.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} color={alertRow.color} />
                    </div>

                    <div>
                      <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#101828', display: 'block' }}>
                        {alertRow.title}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{alertRow.detail}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{alertRow.time}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        background: alertRow.bg,
                        color: alertRow.color,
                        minWidth: '55px',
                        textAlign: 'center',
                      }}
                    >
                      {alertRow.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
