import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function AddSitePage() {
  const navigate = useNavigate()
  const [siteName, setSiteName] = useState('')
  const [address, setAddress] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!siteName.trim()) {
      setErrorMsg('Please enter a site name.')
      return
    }

    // Persist new site to localStorage
    const stored = localStorage.getItem('baitguard_system_sites')
    const current = stored
      ? JSON.parse(stored)
      : [
          { id: 's-1', name: 'Warehouse A', detail: '28 stations · Healthy', status: 'Healthy', statusType: 'green' },
          { id: 's-2', name: 'Warehouse B', detail: '92 stations · 2 offline', status: '2 Offline', statusType: 'orange' },
        ]

    const newSite = {
      id: `s-${Date.now()}`,
      name: siteName.trim(),
      detail: address.trim() ? `0 stations · ${address.trim()}` : '0 stations · Healthy',
      status: 'Healthy',
      statusType: 'green',
    }

    localStorage.setItem('baitguard_system_sites', JSON.stringify([newSite, ...current]))
    navigate('/admin/system')
  }

  return (
    <div
      style={{
        padding: '32px 40px',
        boxSizing: 'border-box',
        background: '#f4f6f9',
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Back Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin/system')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '22px',
            fontWeight: '800',
            color: '#101828',
            padding: 0,
          }}
        >
          <ChevronLeft size={24} />
          Add Site
        </button>
      </div>

      {/* Centered White Card (Matching Image 2) */}
      <div
        style={{
          maxWidth: '460px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 10px 30px rgba(16, 24, 40, 0.06)',
          boxSizing: 'border-box',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/admin/system')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13.5px',
            fontWeight: '700',
            color: '#2563eb',
            marginBottom: '20px',
            padding: 0,
          }}
        >
          <ChevronLeft size={18} />
          Back to System Management
        </button>

        <h2 style={{ margin: '0 0 24px', fontSize: '19px', fontWeight: '800', color: '#101828' }}>
          Register New Facility Site
        </h2>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#ef4444', fontSize: '12.5px', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Site Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Site Name
            </label>
            <input
              type="text"
              placeholder="e.g. Warehouse C"
              value={siteName}
              onChange={(e) => {
                setSiteName(e.target.value)
                if (errorMsg) setErrorMsg('')
              }}
              style={{
                width: '100%',
                height: '46px',
                padding: '0 16px',
                fontSize: '13.5px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                outline: 'none',
                color: '#101828',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Address */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Address
            </label>
            <input
              type="text"
              placeholder="e.g. 123 Industrial Blvd"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: '100%',
                height: '46px',
                padding: '0 16px',
                fontSize: '13.5px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                outline: 'none',
                color: '#101828',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Solid Blue Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '12px',
              border: 'none',
              background: '#1d61ff',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '8px',
              boxShadow: '0 4px 14px rgba(29, 97, 255, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            Add Site
          </button>
        </form>
      </div>
    </div>
  )
}
