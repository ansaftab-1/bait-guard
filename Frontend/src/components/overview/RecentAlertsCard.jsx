import React from 'react'
import { AlertTriangle, Bell, ArrowRight, CheckCircle2 } from 'lucide-react'

/**
 * RecentAlertsCard Component according to Agent.MD specifications
 * @param {Array<Object>} [alerts]
 * @param {Array<Object>} [items]
 * @param {number} [unreadCount]
 * @param {function} [onViewAll]
 * @param {boolean} [isLoading=false]
 * @param {string} [error]
 */
export default function RecentAlertsCard({
  alerts,
  items,
  unreadCount,
  onViewAll,
  isLoading = false,
  error,
}) {
  const alertList = alerts || items || []
  const count = unreadCount !== undefined ? unreadCount : alertList.length

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e4e7ec',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(16, 24, 40, 0.04)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <Bell size={20} color="#2563eb" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#101828' }}>
            Recent Alerts & System Warnings
          </h3>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: 0,
          }}
        >
          View All ({count})
          <ArrowRight size={15} />
        </button>
      </div>

      {isLoading && (
        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
          Loading recent alerts...
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#991b1b', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {!isLoading && !error && alertList.length === 0 && (
        <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={32} color="#10b981" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#101828' }}>All Clear</span>
          <span style={{ fontSize: '12.5px', color: '#64748b' }}>No pending alerts or warnings across your network.</span>
        </div>
      )}

      {!isLoading && !error && alertList.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alertList.map((alt) => {
            const isCritical = (alt.severity || '').toLowerCase() === 'alert' || (alt.severity || '').toLowerCase() === 'critical'
            return (
              <div
                key={alt.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: isCritical ? '#fef2f2' : '#f8fafc',
                  borderLeft: `4px solid ${isCritical ? '#ef4444' : '#f59e0b'}`,
                  borderTop: '1px solid #f1f5f9',
                  borderRight: '1px solid #f1f5f9',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isCritical ? '#fee2e2' : '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <AlertTriangle size={16} color={isCritical ? '#ef4444' : '#d97706'} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#101828' }}>
                      {alt.title}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                      {alt.timeAgo || alt.time || alt.createdAt}
                    </span>
                  </div>

                  <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                    Station <strong style={{ color: '#334155' }}>{alt.stationId || alt.station}</strong> • {alt.location}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
