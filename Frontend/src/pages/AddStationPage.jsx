import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Radio, Signal, ShieldCheck, Check, AlertCircle, Settings, Globe } from 'lucide-react'
import { addStation, getAvailableSitesList } from '../api/stationsData'

export default function AddStationPage() {
  const navigate = useNavigate()
  const availableSites = getAvailableSitesList()

  const [formData, setFormData] = useState({
    stationId: '',
    stationName: '',
    site: availableSites[0] || 'Warehouse A',
    zone: 'Zone A',
    connectivity: 'wifi',
    wifiName: 'BaitGuard_Secure_5G',
    notifications: {
      rodent: true,
      offline: true,
      tamper: true,
      bait: true,
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [registeredStation, setRegisteredStation] = useState(null)

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

  const resetForm = () => {
    setRegisteredStation(null)
    setFormData({
      stationId: '',
      stationName: '',
      site: availableSites[0] || 'Warehouse A',
      zone: 'Zone A',
      connectivity: 'wifi',
      wifiName: 'BaitGuard_Secure_5G',
      notifications: {
        rodent: true,
        offline: true,
        tamper: true,
        bait: true,
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    // Client-side Validation
    if (!formData.stationId.trim()) {
      setErrorMsg('Station ID is required (e.g. RB-99).')
      return
    }
    if (!formData.stationName.trim()) {
      setErrorMsg('Station Name / Location is required (e.g. West Corridor).')
      return
    }
    if (!formData.site.trim()) {
      setErrorMsg('Site / Facility is required.')
      return
    }
    if (!formData.zone.trim()) {
      setErrorMsg('Zone is required.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addStation(formData)
      setRegisteredStation(result || {
        code: formData.stationId.toUpperCase(),
        stationId: formData.stationId.toUpperCase(),
        location: formData.stationName,
        warehouse: formData.site,
        connectivity: formData.connectivity === 'wifi' ? 'Wi-Fi Connected (98%)' : 'Cellular (4G)',
      })
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register station.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ════════ REGISTRATION SUCCESS POPUP / SCREEN ════════
  if (registeredStation) {
    const stationCode = registeredStation.code || registeredStation.stationId || formData.stationId.toUpperCase()
    const stationLoc = registeredStation.location || formData.stationName
    const stationSite = registeredStation.warehouse || registeredStation.facility || formData.site
    const stationConn = formData.connectivity === 'wifi' ? 'Wi-Fi Connected (98%)' : 'Cellular (4G)'

    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#f8fafc',
          padding: '32px 40px',
          boxSizing: 'border-box',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'between',
        }}
      >
        {/* Top Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', display: 'block' }}>
              System Portal
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#101828', letterSpacing: '-0.4px' }}>
                Registration Success
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  background: '#eff6ff',
                  color: '#2563eb',
                  border: '1px solid #bfdbfe',
                }}
              >
                Hardware Added
              </span>
            </div>
          </div>

          {/* Top Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '6px 14px',
                fontSize: '12.5px',
                fontWeight: '600',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <Globe size={14} color="#2563eb" />
              <span>{stationSite}</span>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '4px' }}>Updated 3m ago</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/settings')}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Center Main Confirmation Section */}
        <div
          style={{
            maxWidth: '560px',
            margin: '0 auto 40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Glowing Green Check Icon */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.4)',
              marginBottom: '20px',
            }}
          >
            <Check size={36} color="#ffffff" strokeWidth={3} />
          </div>

          {/* Heading */}
          <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '800', color: '#101828', letterSpacing: '-0.3px' }}>
            Station Registered Successfully
          </h2>
          <p style={{ margin: '0 0 28px', fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, maxWidth: '480px' }}>
            <strong style={{ color: '#101828' }}>{stationCode}</strong> has been added to your monitoring network and is now syncing. Live data reports will reflect calibration soon.
          </p>

          {/* Centered Telemetry Detail Card */}
          <div
            style={{
              width: '100%',
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 10px 30px rgba(16, 24, 40, 0.04)',
              textAlign: 'left',
              marginBottom: '28px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Radio size={16} color="#2563eb" />
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#101828' }}>
                System Integration Telemetry
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>Station ID</span>
                <span style={{ color: '#101828', fontWeight: '800' }}>{stationCode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>Location</span>
                <span style={{ color: '#101828', fontWeight: '700' }}>{stationLoc}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>Site Assignment</span>
                <span style={{ color: '#101828', fontWeight: '700' }}>{stationSite}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>Connectivity</span>
                <span style={{ color: '#101828', fontWeight: '700' }}>{stationConn}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => navigate('/stations')}
              style={{
                height: '44px',
                padding: '0 28px',
                borderRadius: '12px',
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.15s ease',
              }}
            >
              View Station
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={{
                height: '44px',
                padding: '0 24px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#334155',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Add Another Station
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ════════ MAIN REGISTRATION FORM ════════
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
          onClick={() => navigate('/stations')}
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
            Register a new hardware monitor
          </span>
          <h1 style={{ margin: '2px 0 0', fontSize: '26px', fontWeight: '800', color: '#101828', letterSpacing: '-0.4px' }}>
            Add Station
          </h1>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div
          style={{
            padding: '14px 18px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            color: '#991b1b',
            fontSize: '13.5px',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={18} color="#ef4444" />
          {errorMsg}
        </div>
      )}

      {/* Main Form Container */}
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
        {/* Section 1: Basic Telemetry Identifiers */}
        <div>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#101828', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={18} color="#2563eb" /> Hardware Identifiers & Location
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Station ID */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Station ID <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. RB-99"
                value={formData.stationId}
                onChange={(e) => handleTextChange('stationId', e.target.value)}
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

            {/* Station Name */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Station Name / Location <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. West Wing Loading Dock"
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

            {/* Site / Facility */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Site / Facility <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={formData.site}
                onChange={(e) => handleTextChange('site', e.target.value)}
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
                Zone <span style={{ color: '#ef4444' }}>*</span>
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

        {/* Section 2: Connectivity Protocols */}
        <div>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#101828', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Signal size={18} color="#2563eb" /> Connectivity Protocol
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
            {[
              { id: 'wifi', title: 'WiFi 802.11 b/g/n', desc: 'Local Facility Mesh Network' },
              { id: '4g', title: '4G / LTE Cellular', desc: 'Autonomous SIM Gateway' },
              { id: 'lorawan', title: 'LoRaWAN Long-Range', desc: 'Ultra-low power RF link' },
            ].map((conn) => {
              const isSelected = formData.connectivity === conn.id
              return (
                <div
                  key={conn.id}
                  onClick={() => handleTextChange('connectivity', conn.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #1d61ff' : '1px solid #e2e8f0',
                    background: isSelected ? '#eff6ff' : '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: isSelected ? '#1d61ff' : '#101828', display: 'block' }}>
                    {conn.title}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    {conn.desc}
                  </span>
                </div>
              )
            })}
          </div>

          {formData.connectivity === 'wifi' && (
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                WiFi Network SSID
              </label>
              <input
                type="text"
                placeholder="e.g. BaitGuard_Secure_5G"
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

        {/* Section 3: Alert Notifications */}
        <div>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#101828', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#2563eb" /> Alert Notification Triggers
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { id: 'rodent', label: 'Rodent Detection Trigger', desc: 'Push immediate AI alert when rodent motion is detected.' },
              { id: 'offline', label: 'Station Offline Alert', desc: 'Alert operator if device ping is lost for > 15 minutes.' },
              { id: 'tamper', label: 'Tamper & Vibration Sensor', desc: 'Trigger alarm if station unit is opened or displaced.' },
              { id: 'bait', label: 'Low Bait Level Warning', desc: 'Notify technician when bait drops below 25% capacity.' },
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
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#101828', display: 'block' }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{item.desc}</span>
                  </div>

                  {/* Toggle Switch */}
                  <div
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: '100px',
                      background: isChecked ? '#1d61ff' : '#cbd5e1',
                      position: 'relative',
                      transition: 'background 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        position: 'absolute',
                        top: '3px',
                        left: isChecked ? '23px' : '3px',
                        transition: 'left 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/stations')}
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
            }}
          >
            {isSubmitting ? 'Registering...' : 'Register Station'}
          </button>
        </div>
      </form>
    </div>
  )
}
