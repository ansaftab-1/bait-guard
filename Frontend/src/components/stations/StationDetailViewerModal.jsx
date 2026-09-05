import React from 'react';
import { X, MapPin, RefreshCw, VolumeX, ShieldAlert, Battery, Droplets, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../services/authService';

/**
 * StationDetailViewerModal Component
 * Implements PestAI - Station Detail Viewer Spec from Agent.MD
 * 
 * @param {boolean} isOpen
 * @param {object} station
 * @param {function} onClose
 * @param {function} [onLocate]
 * @param {function} [onRefill]
 * @param {function} [onSilence]
 */
export default function StationDetailViewerModal({
  isOpen,
  station,
  onClose,
  onLocate,
  onRefill,
  onSilence,
}) {
  const { user } = useAuth();
  if (!isOpen || !station) return null;

  const isViewer = !user || user.role === ROLES.VIEWER || user.role === 'VIEWER';

  const stationCode = station.code || station.id || 'Station RB-07';
  const stationLocation = station.location || `${station.warehouse || 'Warehouse B'} · ${station.zone || 'Zone A'}`;
  const statusLabel = station.statusLabel || station.statusText || 'Alert 82%';

  const baitVal = typeof station.bait === 'number' ? station.bait : station.baitPercent || 18;
  const battVal = typeof station.battery === 'number' ? station.battery : station.batteryPercent || 82;
  const detectsCount = station.detects || station.detections || 22;

  const handleLocate = () => {
    if (onLocate) onLocate(station);
    else alert(`Locating ${stationCode} on map...`);
  };

  const handleRefill = () => {
    if (isViewer) return;
    if (onRefill) onRefill(station);
    else alert(`Refill action triggered for ${stationCode}`);
  };

  const handleSilence = () => {
    if (isViewer) return;
    if (onSilence) onSilence(station);
    else alert(`Alarm silenced for ${stationCode}`);
  };

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          animation: 'fadeInScale 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Dark Bar Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ffffff',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px', color: '#ffffff' }}>
                {stationCode}
              </h2>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  background: '#ef4444',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)',
                }}
              >
                <ShieldAlert size={12} />
                {statusLabel}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#94a3b8', fontWeight: '500' }}>
              {stationLocation}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Stats Row (3 Cards with Progress Bars) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {/* Bait Level */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '600' }}>Bait Level</span>
                <Droplets size={14} color="#f59e0b" />
              </div>
              <span style={{ fontSize: '20px', fontWeight: '800', color: baitVal < 25 ? '#ef4444' : '#1e293b' }}>
                {baitVal}%
              </span>
              <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '100px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, Math.max(0, baitVal))}%`,
                    background: baitVal < 25 ? '#ef4444' : '#f59e0b',
                    borderRadius: '100px',
                  }}
                />
              </div>
            </div>

            {/* Battery */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '600' }}>Battery</span>
                <Battery size={14} color="#10b981" />
              </div>
              <span style={{ fontSize: '20px', fontWeight: '800', color: battVal < 20 ? '#ef4444' : '#1e293b' }}>
                {battVal}%
              </span>
              <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '100px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, Math.max(0, battVal))}%`,
                    background: battVal < 20 ? '#ef4444' : '#10b981',
                    borderRadius: '100px',
                  }}
                />
              </div>
            </div>

            {/* Detections */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '14px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '600' }}>Detections</span>
                <Activity size={14} color="#2563eb" />
              </div>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>
                {detectsCount}
              </span>
              <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '100px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, Math.max(10, (detectsCount / 50) * 100))}%`,
                    background: '#2563eb',
                    borderRadius: '100px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          {isViewer ? (
            /* Viewer Side: Refill and Silence buttons are completely REMOVED; only Locate button is rendered */
            <button
              type="button"
              onClick={handleLocate}
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '10px',
                border: '1px solid #2563eb',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <MapPin size={15} />
              Locate Station
            </button>
          ) : (
            /* Admin/Technician Side: Render Refill, Silence, and Locate buttons */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <button
                type="button"
                onClick={handleRefill}
                style={{
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid #fde68a',
                  background: '#fffbeb',
                  color: '#b45309',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <RefreshCw size={15} />
                Refill
              </button>

              <button
                type="button"
                onClick={handleSilence}
                style={{
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#ef4444',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <VolumeX size={15} />
                Silence
              </button>

              <button
                type="button"
                onClick={handleLocate}
                style={{
                  height: '42px',
                  borderRadius: '10px',
                  border: '1px solid #2563eb',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.15s ease',
                }}
              >
                <MapPin size={15} />
                Locate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
