import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Eye } from 'lucide-react'

/**
 * StationsTable Component according to Agent.MD specifications
 * Columns: Station ID, Location, Bait Level, Battery, Status, Last Seen, Zone, Warehouse, Action
 */
const StationsTable = memo(function StationsTable({
  stations = [],
  selectedStation,
  onSelectStation,
  onExportCSV,
}) {
  const navigate = useNavigate()

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase()
    if (s === 'ONLINE' || s === 'ACTIVE') {
      return { bg: '#e7f9ef', color: '#0e7845', label: 'Online' }
    }
    if (s === 'OFFLINE' || s === 'INACTIVE') {
      return { bg: '#f1f5f9', color: '#64748b', label: 'Offline' }
    }
    if (s === 'ALERT' || s === 'CRITICAL') {
      return { bg: '#fef2f2', color: '#ef4444', label: 'Alert' }
    }
    if (s === 'MAINTENANCE') {
      return { bg: '#eff6ff', color: '#2563eb', label: 'Maintenance' }
    }
    return { bg: '#fef3c7', color: '#b45309', label: status || 'Monitor' }
  }

  const handleRowClick = (st) => {
    if (onSelectStation) onSelectStation(st)
    const targetId = st.id || st.code || st.stationId
    navigate(`/stations/${targetId}`)
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e4e7ec',
        boxShadow: '0 4px 12px rgba(16, 24, 40, 0.04)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid #eaecf0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#101828' }}>
            Station Telemetry Inventory
          </h3>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '100px' }}>
            {stations.length} stations
          </span>
        </div>

        {onExportCSV && (
          <button
            type="button"
            onClick={onExportCSV}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#2563eb',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Download size={14} />
            Export CSV
          </button>
        )}
      </div>

      {/* Table Element */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #eaecf0', color: '#64748b', fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '12px 16px' }}>Station ID</th>
              <th style={{ padding: '12px 16px' }}>Location</th>
              <th style={{ padding: '12px 16px' }}>Bait Level</th>
              <th style={{ padding: '12px 16px' }}>Battery</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Last Seen</th>
              <th style={{ padding: '12px 16px' }}>Zone</th>
              <th style={{ padding: '12px 16px' }}>Warehouse</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((st) => {
              const baitVal = typeof st.bait === 'number' ? st.bait : st.baitPercent || 0
              const battVal = typeof st.battery === 'number' ? st.battery : st.batteryPercent || 0
              const badge = getStatusBadge(st.status)
              const isSelected = selectedStation?.id === st.id

              return (
                <tr
                  key={st.id || st.code}
                  onClick={() => handleRowClick(st)}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = '#f8fafc'
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = '#ffffff'
                  }}
                >
                  {/* Station ID */}
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: '#101828' }}>
                    {st.code || st.id || st.stationId}
                  </td>

                  {/* Location */}
                  <td style={{ padding: '14px 16px', color: '#334155' }}>
                    <div style={{ fontWeight: '600', color: '#101828' }}>{st.location}</div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{st.building || st.fullAddress}</div>
                  </td>

                  {/* Bait Level (Animated Progress Bar) */}
                  <td style={{ padding: '14px 16px', minWidth: '130px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '100px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${baitVal}%`,
                            background: baitVal < 20 ? '#ef4444' : baitVal < 50 ? '#f59e0b' : '#2563eb',
                            borderRadius: '100px',
                            transition: 'width 0.6s ease',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#101828', width: '32px' }}>
                        {baitVal}%
                      </span>
                    </div>
                  </td>

                  {/* Battery (Animated Progress Bar) */}
                  <td style={{ padding: '14px 16px', minWidth: '130px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '100px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${battVal}%`,
                            background: battVal < 20 ? '#ef4444' : battVal < 50 ? '#f59e0b' : '#10b981',
                            borderRadius: '100px',
                            transition: 'width 0.6s ease',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#101828', width: '32px' }}>
                        {battVal}%
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: '700',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        background: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {badge.label}
                    </span>
                  </td>

                  {/* Last Seen */}
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12.5px' }}>
                    {st.lastSeen || st.lastActivity}
                  </td>

                  {/* Zone */}
                  <td style={{ padding: '14px 16px', fontWeight: '600', color: '#334155' }}>
                    {st.zone}
                  </td>

                  {/* Warehouse */}
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>
                    {st.warehouse || st.facility}
                  </td>

                  {/* Action */}
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRowClick(st)
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: '600',
                        fontSize: '12.5px',
                      }}
                    >
                      <Eye size={15} />
                      Inspect
                    </button>
                  </td>
                </tr>
              )
            })}

            {stations.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '13.5px' }}>
                  No stations found matching your search or filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
})

export default StationsTable
