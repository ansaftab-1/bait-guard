import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Video,
  Thermometer,
  Droplets,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
} from 'lucide-react'
import useStationsData from '../hooks/useStationsData'
import { useAuth } from '../context/AuthContext'
import { canEditStation, canDeleteStation } from '../utils/permissions'
import { deleteStation } from '../api/stationsData'
import DeleteConfirmationModal from '../components/stations/DeleteConfirmationModal'



export default function StationDetailPage() {
  const { stationId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data, isLoading } = useStationsData()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const stations = data?.stations || []
  const station =
    stations.find((s) => s.id === stationId || s.code === stationId || s.stationId === stationId) || {
      id: stationId || 'RB-07',
      code: stationId || 'RB-07',
      warehouse: 'Warehouse B',
      zone: 'Zone A',
      location: 'Warehouse B - North Wall',
      bait: 18,
      battery: 82,
      detects: 22,
      status: 'alert',
      statusLabel: 'Alert',
    }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await deleteStation(station.id || station.code)
      setIsDeleteModalOpen(false)
      navigate('/stations')
    } catch (err) {
      alert(err.message || 'Failed to delete station.')
    } finally {
      setIsDeleting(false)
    }
  }

  const baitVal = typeof station.bait === 'number' ? station.bait : station.baitPercent || 18
  const battVal = typeof station.battery === 'number' ? station.battery : station.batteryPercent || 82
  const detectsCount = station.detects || station.detections || 22

  if (isLoading && !data) {
    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ height: '40px', background: '#e2e8f0', borderRadius: '10px', width: '25%' }} />
        <div style={{ height: '280px', background: '#e2e8f0', borderRadius: '16px', width: '100%' }} />
      </div>
    )
  }

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
      {/* ─── Delete Confirmation Modal ─── */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        stationId={station.code || station.id}
        stationName={station.location}
        isLoading={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* ─── Top Header (Matching Image 2) ─── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Back Icon Button */}
          <button
            type="button"
            onClick={() => navigate('/stations')}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#334155',
              boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)',
            }}
          >
            <ChevronLeft size={20} />
          </button>

          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#101828', letterSpacing: '-0.4px' }}>
              {station.code || station.id}
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
              {station.warehouse || 'Warehouse B'} · {station.zone || 'Zone A'}
            </p>
          </div>
        </div>

        {/* Top Right Actions: Admin Edit / Delete + Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Admin Edit Station Button */}
          {canEditStation(user) && (
            <button
              type="button"
              id="edit-station-btn"
              onClick={() => navigate(`/stations/${station.code || station.id}/edit`)}
              style={{
                height: '38px',
                padding: '0 16px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#2563eb',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)',
              }}
            >
              <Edit size={16} />
              Edit Station
            </button>
          )}

          {/* Admin Delete Station Button */}
          {canDeleteStation(user) && (
            <button
              type="button"
              id="delete-station-btn"
              onClick={() => setIsDeleteModalOpen(true)}
              style={{
                height: '38px',
                padding: '0 16px',
                borderRadius: '10px',
                border: '1px solid #fecaca',
                background: '#fef2f2',
                color: '#ef4444',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}

          {/* Status Badge */}
          <span
            style={{
              fontSize: '12px',
              fontWeight: '700',
              padding: '4px 12px',
              borderRadius: '100px',
              background: '#fef2f2',
              color: '#ef4444',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            • {station.statusLabel || station.status || 'Alert'}
          </span>
        </div>
      </div>


      {/* ─── 1. Live Feed Card ─── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e4e7ec',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(16, 24, 40, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#101828' }}>
          Live Feed
        </h2>

        {/* Dark Camera Stream Viewport */}
        <div
          style={{
            width: '100%',
            height: '280px',
            background: '#0b1120',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Left Live Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 0, 0, 0.5)', padding: '4px 10px', borderRadius: '100px', width: 'fit-content', backdropFilter: 'blur(4px)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.5px' }}>LIVE</span>
          </div>

          {/* Center Camera Icon Placeholder */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.12, pointerEvents: 'none' }}>
            <Video size={90} color="#ffffff" />
          </div>

          {/* Bottom Overlays */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: '11.5px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', background: 'rgba(0, 0, 0, 0.5)', padding: '4px 12px', borderRadius: '100px' }}>
              Night vision · 24°C
            </span>
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#ffffff', background: '#ef4444', padding: '4px 14px', borderRadius: '100px' }}>
              Rat · 96% AI
            </span>
          </div>
        </div>
      </div>

      {/* ─── 2. Top 3 Stat Cards Row (Matching Image 2) ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {/* Bait Level */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e4e7ec', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(16, 24, 40, 0.04)' }}>
          <div>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', display: 'block' }}>Bait Level</span>
            <span style={{ fontSize: '26px', fontWeight: '800', color: '#f59e0b', marginTop: '4px', display: 'block' }}>{baitVal}%</span>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
          </div>
        </div>

        {/* Battery */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e4e7ec', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(16, 24, 40, 0.04)' }}>
          <div>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', display: 'block' }}>Battery</span>
            <span style={{ fontSize: '26px', fontWeight: '800', color: '#10b981', marginTop: '4px', display: 'block' }}>{battVal}%</span>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#e7f9ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
          </div>
        </div>

        {/* Detections */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e4e7ec', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(16, 24, 40, 0.04)' }}>
          <div>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', display: 'block' }}>Detections</span>
            <span style={{ fontSize: '26px', fontWeight: '800', color: '#2563eb', marginTop: '4px', display: 'block' }}>{detectsCount}</span>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2563eb' }} />
          </div>
        </div>
      </div>

      {/* ─── 3. Telemetry 4-Metrics Bar (White Card) ─── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e4e7ec',
          padding: '20px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          boxShadow: '0 4px 12px rgba(16, 24, 40, 0.04)',
          textAlign: 'center',
        }}
      >
        {/* Temperature */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Thermometer size={18} color="#64748b" />
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#101828', marginTop: '2px' }}>24°C</span>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Temperature</span>
        </div>

        {/* Humidity */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Droplets size={18} color="#64748b" />
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#101828', marginTop: '2px' }}>61%</span>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Humidity</span>
        </div>

        {/* Last seen */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Clock size={18} color="#64748b" />
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#101828', marginTop: '2px' }}>2:13 AM</span>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Last seen</span>
        </div>

        {/* Zone */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <MapPin size={18} color="#64748b" />
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#101828', marginTop: '2px' }}>Zone B</span>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Zone</span>
        </div>
      </div>

      {/* ─── 4. Detection History Section (Matching Image 2) ─── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e4e7ec',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(16, 24, 40, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#101828' }}>
            Detection History
          </h2>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '13px',
              fontWeight: '700',
              color: '#1d61ff',
              cursor: 'pointer',
            }}
          >
            See All
          </button>
        </div>

        {/* Event List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(station.historyEvents || station.recentEvents || (station.detects > 0 ? [
            { id: 'e-1', title: 'Rodent telemetry detected', subtext: `${station.lastActivity || 'Today, 2:13 AM'} · 96% AI`, badge: 'Active', status: 'red' },
            { id: 'e-2', title: 'Telemetry heartbeat verified', subtext: 'Signal check confirmed', badge: 'Resolved', status: 'green' },
          ] : [
            { id: 'e-1', title: 'Station online & monitoring', subtext: 'No active rodent triggers', badge: 'Normal', status: 'green' },
          ])).map((ev) => {
            const isRed = ev.status === 'red'
            const isYellow = ev.status === 'yellow'

            return (
              <div
                key={ev.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Icon Box */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isRed ? '#fef2f2' : isYellow ? '#fef3c7' : '#e7f9ef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isRed ? (
                      <AlertTriangle size={18} color="#ef4444" />
                    ) : isYellow ? (
                      <AlertTriangle size={18} color="#d97706" />
                    ) : (
                      <CheckCircle size={18} color="#10b981" />
                    )}
                  </div>

                  {/* Title & Subtext */}
                  <div>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#101828', display: 'block' }}>
                      {ev.title}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{ev.subtext}</span>
                  </div>
                </div>

                {/* Status Pill Badge */}
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: '700',
                    padding: '3px 12px',
                    borderRadius: '100px',
                    background: isRed ? '#fef2f2' : isYellow ? '#fef3c7' : '#e7f9ef',
                    color: isRed ? '#ef4444' : isYellow ? '#b45309' : '#0e7845',
                  }}
                >
                  {ev.badge}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
