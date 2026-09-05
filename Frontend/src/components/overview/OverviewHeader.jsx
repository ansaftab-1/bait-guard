import React, { useState } from 'react'
import { Bell, ChevronDown, Clock, Building2, Shield } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'
import AnimatedBellIcon from '../notifications/AnimatedBellIcon'
import NotificationDropdown from '../notifications/NotificationDropdown'

/**
 * OverviewHeader Component
 */
export default function OverviewHeader({
  userName = 'Admin User',
  role = 'System Administrator',
  warehouse = 'All Facilities',
  lastUpdated = '2 mins ago',
  onWarehouseChange,
}) {
  const { unreadCount, pushEnabled } = useNotifications()
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const WAREHOUSES = ['All Facilities', 'Warehouse A', 'Warehouse B', 'Distribution Center', 'Admin Wing']

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e4e7ec',
        padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(16, 24, 40, 0.04)',
        marginBottom: '20px',
      }}
    >
      {/* Left Greeting & User Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#101828', letterSpacing: '-0.4px' }}>
            {getGreeting()}, {userName}
          </h1>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '100px',
              background: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Shield size={12} />
            {role}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#667085' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="#94a3b8" />
            <span>Updated {lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Right Controls (Warehouse Selector + Notifications) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Warehouse Dropdown Selector */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Building2 size={16} color="#475569" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
          <select
            value={warehouse}
            onChange={(e) => onWarehouseChange && onWarehouseChange(e.target.value)}
            style={{
              height: '40px',
              padding: '0 32px 0 36px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#1e293b',
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '10px',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              fontFamily: 'inherit',
            }}
          >
            {WAREHOUSES.map((wh) => (
              <option key={wh} value={wh}>
                {wh}
              </option>
            ))}
          </select>
          <ChevronDown size={15} color="#64748b" style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }} />
        </div>

        {/* Notification Button & Dropdown */}
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
              transition: 'all 0.15s ease',
            }}
            title={pushEnabled ? 'Notifications' : 'Notifications Muted'}
          >
            <AnimatedBellIcon pushEnabled={pushEnabled} hasUnread={unreadCount > 0} size={40} />
            {pushEnabled && unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 2px #ffffff',
                  padding: '0 2px',
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
  )
}
