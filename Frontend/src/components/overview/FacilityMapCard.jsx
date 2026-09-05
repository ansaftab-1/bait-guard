import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Navigation } from 'lucide-react'

/**
 * FacilityMapCard Component according to Agent.MD specifications
 * Marker colors: Green (active/online), Yellow (warning/monitor), Red (alert/critical), Gray (offline)
 * 
 * @param {Array} stations
 * @param {function} [onSelect]
 */
export default function FacilityMapCard({ stations = [], onSelect }) {
  const navigate = useNavigate()

  const getMarkerStyle = (status) => {
    const s = (status || '').toLowerCase()
    if (s.includes('alert') || s.includes('critical')) {
      return { bg: '#ef4444', ring: '#fca5a5', label: 'Alert' } // Red
    }
    if (s.includes('warning') || s.includes('monitor') || s.includes('low')) {
      return { bg: '#f59e0b', ring: '#fde68a', label: 'Attention' } // Yellow
    }
    if (s.includes('offline') || s.includes('inactive')) {
      return { bg: '#64748b', ring: '#cbd5e1', label: 'Offline' } // Gray
    }
    return { bg: '#10b981', ring: '#a7f3d0', label: 'Online' } // Green
  }

  const handleStationClick = (st) => {
    if (onSelect) {
      onSelect(st)
      return
    }
    const targetId = st.id || st.code || st.stationId
    navigate(`/stations/${targetId}`)
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e4e7ec',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(16, 24, 40, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header & Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={20} color="#2563eb" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#101828' }}>
            Live Facility Map
          </h3>
        </div>

        {/* Legend Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11.5px', fontWeight: '600' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#047857' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Green: Online
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#b45309' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Yellow: Warning
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#b91c1c' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} /> Red: Alert
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#475569' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }} /> Gray: Offline
          </span>
        </div>
      </div>

      {/* Map Viewport Canvas */}
      <div
        style={{
          flex: 1,
          minHeight: '220px',
          background: 'linear-gradient(135deg, #f0f4ff 0%, #e2eafc 100%)',
          borderRadius: '12px',
          border: '1px solid #dbeabe',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Subtle Map Grid Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }}
        />

        {/* Station Markers */}
        {stations.map((st, idx) => {
          const marker = getMarkerStyle(st.status)
          const posX = st.pinCoords?.x || st.x || (20 + (idx * 25) % 70)
          const posY = st.pinCoords?.y || st.y || (30 + (idx * 20) % 50)

          return (
            <div
              key={st.id || idx}
              onClick={() => handleStationClick(st)}
              style={{
                position: 'absolute',
                left: `${posX}%`,
                top: `${posY}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 10,
              }}
              title={`Station ${st.code || st.id} - ${st.location}`}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: marker.bg,
                  boxShadow: `0 0 0 4px ${marker.ring}, 0 4px 10px rgba(0,0,0,0.15)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '800',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {st.code || st.id}
              </div>
            </div>
          )
        })}

        {/* Floating Hint */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(4px)',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11.5px',
            color: '#475569',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            border: '1px solid #cbd5e1',
          }}
        >
          <Navigation size={12} color="#2563eb" />
          Click any marker to inspect station telemetry
        </div>
      </div>
    </div>
  )
}
