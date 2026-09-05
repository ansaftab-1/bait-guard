import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function AddUserPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Admin')
  const [selectedSites, setSelectedSites] = useState(['Warehouse A'])
  const [errorMsg, setErrorMsg] = useState('')

  const handleToggleSite = (siteName) => {
    if (selectedSites.includes(siteName)) {
      setSelectedSites(selectedSites.filter((s) => s !== siteName))
    } else {
      setSelectedSites([...selectedSites, siteName])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setErrorMsg('Please enter full name.')
      return
    }
    if (!email.trim()) {
      setErrorMsg('Please enter email address.')
      return
    }

    const initials = fullName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    const newUser = {
      id: `u-${Date.now()}`,
      initials,
      name: fullName.trim(),
      email: email.trim(),
      role: role,
      sites: selectedSites,
    }

    const stored = localStorage.getItem('baitguard_system_users')
    const current = stored
      ? JSON.parse(stored)
      : [
        { id: 'usr-admin-001', initials: 'AU', name: 'Admin User', email: 'admin@baitguard.com', role: 'Admin' },
        { id: 'usr-tech-001', initials: 'TU', name: 'Tech User', email: 'technician@baitguard.com', role: 'Technician' },
        { id: 'usr-viewer-001', initials: 'VU', name: 'Viewer User', email: 'user@baitguard.com', role: 'Viewer' },
      ]

    localStorage.setItem('baitguard_system_users', JSON.stringify([newUser, ...current]))
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
          Add User
        </button>
      </div>

      {/* Centered White Card (Matching Image 3) */}
      <div
        style={{
          maxWidth: '480px',
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
          Create New User Account
        </h2>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#ef4444', fontSize: '12.5px', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Smith"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
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

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="e.g. john@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
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

          {/* Role Segmented Pills */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Role
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {['Admin', 'Technician', 'Viewer'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    height: '42px',
                    borderRadius: '100px',
                    border: role === r ? '1.5px solid #1d61ff' : '1px solid #e2e8f0',
                    background: role === r ? '#eaf2ff' : '#ffffff',
                    color: role === r ? '#1d61ff' : '#475569',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Site Access Checklist */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
              Site Access
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Warehouse A', desc: '28 stations · Healthy' },
                { name: 'Warehouse B', desc: '92 stations · 2 offline' },
              ].map((site) => {
                const isChecked = selectedSites.includes(site.name)
                return (
                  <div
                    key={site.name}
                    onClick={() => handleToggleSite(site.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => { }}
                      style={{ width: '18px', height: '18px', accentColor: '#1d61ff', cursor: 'pointer' }}
                    />
                    <div>
                      <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#101828', display: 'block' }}>
                        {site.name}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{site.desc}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Solid Blue Add User Button */}
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
            Add User
          </button>
        </form>
      </div>
    </div>
  )
}
