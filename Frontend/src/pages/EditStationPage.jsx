import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Radio, Signal, ShieldCheck, Check, AlertCircle, Save } from 'lucide-react'
import { getPersistedStations, updateStation, getAvailableSitesList } from '../api/stationsData'

export default function EditStationPage() {
  const { stationId } = useParams()
  const navigate = useNavigate()
  const availableSites = getAvailableSitesList()

  const [formData, setFormData] = useState({
    stationId: stationId || '',
    stationName: '',
    warehouse: 'Warehouse B',
    zone: 'Zone A',
    connectivity: 'wifi',
    wifiName: '',
    notifications: {
      rodent: true,
      offline: true,
      tamper: true,
      bait: true,
    },
  })


  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const stations = getPersistedStations()
    const found = stations.find((s) => s.id === stationId || s.code === stationId || s.stationId === stationId)

    if (found) {
      setFormData({
        stationId: found.id || found.code || stationId,
        stationName: found.location || found.stationName || '',
        warehouse: found.warehouse || found.facility || 'Warehouse B',
        zone: found.zone || 'Zone A',
        connectivity: found.connectivity || 'wifi',
        wifiName: found.wifiName || '',
        notifications: found.notifications || { rodent: true, offline: true, tamper: true, bait: true },
      })
    }
    setIsLoading(false)
  }, [stationId])

  const handleTextChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }))
    if (errorMsg) setErrorMsg('')
  }

  const handleToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!formData.stationName.trim()) {
      setErrorMsg('Station Name / Location is required.')
      return
    }

    setIsSubmitting(true)

    try {
      await updateStation(formData.stationId, formData)
      setSuccessMsg(`Station ${formData.stationId} updated successfully!`)
      setTimeout(() => {
        navigate(`/stations/${formData.stationId}`)
      }, 1000)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update station.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        Loading station details...
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '32px 40px',
        maxWidth: '840px',
        margin: '0 auto',
        boxSizing: 'border-box',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <button
          type="button"
          onClick={() => navigate(`/stations/${stationId}`)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
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
          <ArrowLeft size={20} />
        </button>

        <div>
          <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#64748b' }}>
            Update hardware parameters & triggers
          </span>
          <h1 style={{ margin: '2px 0 0', fontSize: '26px', fontWeight: '800', color: '#101828', letterSpacing: '-0.4px' }}>
            Edit Station {formData.stationId}
          </h1>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div style={{ padding: '14px 18px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#991b1b', fontSize: '13.5px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={18} color="#ef4444" />
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ padding: '14px 18px', background: '#e7f9ef', border: '1px solid #a7f3d0', borderRadius: '12px', color: '#065f46', fontSize: '13.5px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Check size={18} color="#10b981" />
          {successMsg}
        </div>
      )}

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e4e7ec',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(16, 24, 40, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Section 1: Identifiers */}
        <div>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#101828', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={18} color="#2563eb" /> Hardware Identifiers
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Station ID (Readonly) */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Station ID (Read-only)
              </label>
              <input
                type="text"
                value={formData.stationId}
                disabled
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  background: '#f1f5f9',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  outline: 'none',
                  color: '#64748b',
                  fontWeight: '700',
                  boxSizing: 'border-box',
                  cursor: 'not-allowed',
                }}
              />
            </div>

            {/* Station Name */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Station Name / Location <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.stationName}
                onChange={(e) => handleTextChange('stationName', e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  outline: 'none',
                  color: '#101828',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Warehouse */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Warehouse / Site
              </label>
              <select
                value={formData.warehouse}
                onChange={(e) => handleTextChange('warehouse', e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  outline: 'none',
                  color: '#101828',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              >
                {availableSites.map((site) => (
                  <option key={site} value={site}>
                    {site}
                  </option>
                ))}
              </select>

            </div>

            {/* Zone */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Zone
              </label>
              <select
                value={formData.zone}
                onChange={(e) => handleTextChange('zone', e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  outline: 'none',
                  color: '#101828',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              >
                <option value="Zone A">Zone A - High Activity</option>
                <option value="Zone B">Zone B - Storage Bays</option>
                <option value="Zone C">Zone C - Outer Perimeter</option>
              </select>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />

        {/* Section 2: Connectivity */}
        <div>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#101828', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Signal size={18} color="#2563eb" /> Connectivity Settings
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
            {[
              { id: 'wifi', title: 'WiFi Network', desc: '802.11 b/g/n' },
              { id: '4g', title: '4G Cellular', desc: 'Sim Gateway' },
              { id: 'lorawan', title: 'LoRaWAN', desc: 'Long-Range RF' },
            ].map((conn) => {
              const isSelected = formData.connectivity === conn.id
              return (
                <div
                  key={conn.id}
                  onClick={() => handleTextChange('connectivity', conn.id)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #1d61ff' : '1px solid #e2e8f0',
                    background: isSelected ? '#eff6ff' : '#f8fafc',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: '700', color: isSelected ? '#1d61ff' : '#101828', display: 'block' }}>
                    {conn.title}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{conn.desc}</span>
                </div>
              )
            })}
          </div>

          {formData.connectivity === 'wifi' && (
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                WiFi SSID
              </label>
              <input
                type="text"
                value={formData.wifiName}
                onChange={(e) => handleTextChange('wifiName', e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 14px',
                  fontSize: '13.5px',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  outline: 'none',
                  color: '#101828',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />

        {/* Section 3: Notification Toggles */}
        <div>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#101828', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#2563eb" /> Alert Triggers
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 'rodent', label: 'Rodent Detection Trigger' },
              { id: 'offline', label: 'Station Offline Alert' },
              { id: 'tamper', label: 'Tamper Sensor Alert' },
              { id: 'bait', label: 'Low Bait Warning' },
            ].map((item) => {
              const isChecked = formData.notifications[item.id]
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#101828' }}>{item.label}</span>
                  <div
                    style={{
                      width: '40px',
                      height: '22px',
                      borderRadius: '100px',
                      background: isChecked ? '#1d61ff' : '#cbd5e1',
                      position: 'relative',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        position: 'absolute',
                        top: '3px',
                        left: isChecked ? '21px' : '3px',
                        transition: 'left 0.2s ease',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button
            type="button"
            onClick={() => navigate(`/stations/${stationId}`)}
            disabled={isSubmitting}
            style={{
              height: '46px',
              padding: '0 24px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#334155',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              height: '46px',
              padding: '0 32px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #1d61ff 0%, #004de6 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.75 : 1,
              boxShadow: '0 4px 14px rgba(29, 97, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
