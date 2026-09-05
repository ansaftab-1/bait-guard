import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Trash2 } from 'lucide-react'
import {
  getPendingAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
  subscribeAccessRequests,
} from '../../services/accessRequestService'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../services/authService'
import { SEEDED_FACILITY_MAP } from '../../firebase/config'
import { apiClient } from '../../api/client'

const CANONICAL_USERS = [
  { id: 'usr-admin-001', initials: 'AU', name: 'Admin User', email: 'admin@baitguard.com', role: 'Admin', sites: ['Warehouse A', 'Warehouse B', 'Distribution Center', 'Cold Storage', 'Manufacturing Plant'], status: 'Active' },
  { id: 'usr-tech-001', initials: 'TU', name: 'Tech User', email: 'technician@baitguard.com', role: 'Technician', sites: ['Warehouse A', 'Warehouse B'], status: 'Active' },
  { id: 'usr-viewer-001', initials: 'VU', name: 'Viewer User', email: 'user@baitguard.com', role: 'Viewer', sites: ['Warehouse A'], status: 'Active' },
]

const SEEDED_SITES = [
  { id: 'site_1', name: 'Warehouse A', detail: '28 stations · Healthy', status: 'Healthy', statusType: 'green' },
  { id: 'site_2', name: 'Warehouse B', detail: '38 stations · 2 offline', status: '2 Offline', statusType: 'orange' },
  { id: 'site_3', name: 'Distribution Center', detail: '42 stations · Healthy', status: 'Healthy', statusType: 'green' },
  { id: 'site_4', name: 'Cold Storage', detail: '12 stations · Attention', status: 'Attention Required', statusType: 'red' },
  { id: 'site_5', name: 'Manufacturing Plant', detail: '20 stations · Healthy', status: 'Healthy', statusType: 'green' },
]

export default function AdminSystemPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const userRole = (user?.role || '').toLowerCase()
  const isStrictAdmin = userRole === ROLES.ADMIN.toLowerCase() || userRole === 'admin'

  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('baitguard_system_users')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const clean = parsed.filter(
            (u) =>
              u.email !== 'alex.rivera@company.com' &&
              u.email !== 'sarah.chen@company.com' &&
              u.email !== 'mj.williams@company.com' &&
              u.email !== 'alex.k@ratguard.ai'
          )
          if (clean.length > 0) return clean
        }
      }
    } catch {}
    return CANONICAL_USERS
  })

  const [sites] = useState(() => SEEDED_SITES)

  const [editingUser, setEditingUser] = useState(null)

  const [pendingRequests, setPendingRequests] = useState(() => getPendingAccessRequests())

  useEffect(() => {
    apiClient.get('/users').then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((u) => ({
          id: u.id,
          initials: u.initials || u.name?.slice(0, 2).toUpperCase() || 'U',
          name: u.name,
          email: u.email,
          role: u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : 'Viewer',
          sites: (u.facilityIds || ['site_1']).map((id) => SEEDED_FACILITY_MAP[id] || id),
          status: 'Active',
        }))
        setUsers(formatted)
        localStorage.setItem('baitguard_system_users', JSON.stringify(formatted))
      }
    }).catch(() => {})

    const unsubscribe = subscribeAccessRequests((updatedRequests) => {
      setPendingRequests(updatedRequests)
      const storedUsers = localStorage.getItem('baitguard_system_users')
      if (storedUsers) {
        try {
          const clean = JSON.parse(storedUsers).filter(
            (u) =>
              u.email !== 'alex.rivera@company.com' &&
              u.email !== 'sarah.chen@company.com' &&
              u.email !== 'mj.williams@company.com'
          )
          setUsers(clean)
        } catch {}
      }
    })
    return () => unsubscribe()
  }, [])

  // TODO: replace mock store with real DB call
  const handleApproveRequest = (req) => {
    const updated = approveAccessRequest(req)
    setPendingRequests(updated)
    const storedUsers = localStorage.getItem('baitguard_system_users')
    if (storedUsers) setUsers(JSON.parse(storedUsers))
  }

  // TODO: replace mock store with real DB call
  const handleRejectRequest = (reqId) => {
    const updated = rejectAccessRequest(reqId)
    setPendingRequests(updated)
  }

  const handleSaveUser = (updatedUser) => {
    const updatedList = users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    setUsers(updatedList)
    localStorage.setItem('baitguard_system_users', JSON.stringify(updatedList))
    setEditingUser(null)
  }

  const handleDeleteUser = (userId) => {
    const updatedList = users.filter((u) => u.id !== userId)
    setUsers(updatedList)
    localStorage.setItem('baitguard_system_users', JSON.stringify(updatedList))
    setEditingUser(null)
  }

  const adminCount = users.filter((u) => u.role === 'Admin').length
  const viewerCount = users.filter((u) => u.role === 'Viewer').length

  return (
    <div
      style={{
        padding: '32px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        width: '100%',
        boxSizing: 'border-box',
        background: '#f8fafc',
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ─── Top Header ─── */}
      <div>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', display: 'block' }}>
          Access Management
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#101828', letterSpacing: '-0.4px' }}>
            {isStrictAdmin ? 'Pending Requests & System' : 'Site Management'}
          </h1>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: '700',
              padding: '4px 12px',
              borderRadius: '100px',
              background: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
            }}
          >
            {isStrictAdmin ? 'Administrator' : 'Field Technician'}
          </span>
        </div>
      </div>

      {/* ─── Pending Approvals Section (Admin only) ─── */}
      {isStrictAdmin && (
        <div style={{ maxWidth: '960px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#101828' }}>
              Pending Approvals
            </h2>
          <span
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {pendingRequests.length}
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div
            style={{
              padding: '32px',
              borderRadius: '20px',
              background: '#ffffff',
              border: '1px dashed #cbd5e1',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            All pending requests have been processed.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(16, 24, 40, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: req.bg || '#2563eb',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {req.initials || 'JD'}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#101828' }}>
                        {req.fullName}
                      </h3>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b', display: 'block', marginTop: '2px' }}>
                        {req.company || req.department || 'Logistics Inc. · Supply Chain'}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>
                    {req.submittedAt || 'Today, 8:30 AM'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: '600', color: '#64748b', flexWrap: 'wrap' }}>
                  <span>{req.email}</span>
                  {req.requestedRole && (
                    <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '100px', fontWeight: '700', border: '1px solid #bfdbfe' }}>
                      Requested: {req.requestedRole}
                    </span>
                  )}
                  {req.facility && (
                    <span style={{ fontSize: '11px', background: '#f8fafc', color: '#475569', padding: '2px 8px', borderRadius: '100px', fontWeight: '600', border: '1px solid #e2e8f0' }}>
                      Facility: {req.facility}
                    </span>
                  )}
                  {req.password && (
                    <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '100px', fontWeight: '700', border: '1px solid #a7f3d0' }}>
                      Password Set
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#334155', lineHeight: 1.5, background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  {req.subject && <div style={{ fontWeight: '700', color: '#101828', marginBottom: '4px' }}>{req.subject}</div>}
                  {req.message || 'Need access to monitor Zone B bait levels for our weekly audits.'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => handleApproveRequest(req)}
                    style={{
                      height: '42px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#10b981',
                      color: '#ffffff',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {req.requestedRole ? `Approve Role to ${req.requestedRole}` : 'Approve Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRejectRequest(req.id)}
                    style={{
                      height: '42px',
                      borderRadius: '12px',
                      border: '1.5px solid #fca5a5',
                      background: '#ffffff',
                      color: '#ef4444',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Reject Access
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* ─── User Management & Site Management Cards ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isStrictAdmin ? 'repeat(auto-fit, minmax(340px, 1fr))' : '1fr',
          maxWidth: isStrictAdmin ? '100%' : '640px',
          gap: '24px',
          alignItems: 'stretch',
        }}
      >
        {/* Left Column: User Management Card (Admin only) */}
        {isStrictAdmin && (
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(16, 24, 40, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#101828' }}>
                  User Management
                </h2>
                <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: '500', marginTop: '4px', display: 'block' }}>
                  {users.length} users · {adminCount} admins · {viewerCount} viewers
                </span>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  background: '#e0edff',
                  color: '#1d61ff',
                }}
              >
                {users.length} USERS
              </span>
            </div>

            {/* Users List Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {users.map((u) => {
                const isBlueAvatar = u.role === 'Admin' || u.role === 'Operator';
                const avatarBg = isBlueAvatar ? '#dbeafe' : '#f1f5f9';
                const avatarColor = isBlueAvatar ? '#1d61ff' : '#64748b';

                const roleColors = {
                  Admin: { bg: '#e0edff', color: '#1d61ff' },
                  Technician: { bg: '#f5f3ff', color: '#7c3aed' },
                  Viewer: { bg: '#f1f5f9', color: '#64748b' },
                };
                const roleStyle = roleColors[u.role] || roleColors.Viewer;

                return (
                  <div
                    key={u.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: avatarBg,
                          color: avatarColor,
                          fontSize: '13px',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {u.initials || (u.name ? u.name.split(' ').map((n) => n[0]).join('') : 'U')}
                      </div>

                      <div>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#101828', display: 'block' }}>
                          {u.name}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{u.email}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: '700',
                          padding: '3px 12px',
                          borderRadius: '100px',
                          background: roleStyle.bg,
                          color: roleStyle.color,
                        }}
                      >
                        {u.role}
                      </span>

                      <button
                        type="button"
                        onClick={() => setEditingUser(u)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                          background: '#ffffff',
                          color: '#101828',
                          fontSize: '12.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full-width + Add User Button */}
          <button
            type="button"
            onClick={() => navigate('/admin/system/add-user')}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '14px',
              border: 'none',
              background: '#e0edff',
              color: '#1d61ff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            + Add User
          </button>
        </div>
        )}

        {/* Right Column: Site Management Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e4e7ec',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(16, 24, 40, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#101828' }}>
                  Site Management
                </h2>
                <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: '500', marginTop: '4px', display: 'block' }}>
                  {sites.length} active sites
                </span>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  background: '#fef3c7',
                  color: '#b45309',
                }}
              >
                {sites.length} SITES
              </span>
            </div>

            {/* Sites List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sites.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 18px',
                    borderRadius: '16px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#101828', display: 'block' }}>
                      {s.name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{s.detail}</span>
                  </div>

                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: '700',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      background: s.statusType === 'green' ? '#e7f9ef' : '#fffbeb',
                      color: s.statusType === 'green' ? '#0e7845' : '#d97706',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: s.statusType === 'green' ? '#10b981' : '#f59e0b',
                      }}
                    />
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Full-width + Add Site Button */}
          <button
            type="button"
            onClick={() => navigate('/admin/system/add-site')}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '14px',
              border: 'none',
              background: '#e0edff',
              color: '#1d61ff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            + Add Site
          </button>
        </div>
      </div>

      {/* ─── Edit User Modal ─── */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          sites={sites}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  )
}

function EditUserModal({ user, sites, onClose, onSave, onDelete }) {
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [role, setRole] = useState(user.role || 'Viewer')
  const [userSites, setUserSites] = useState(user.sites || ['Warehouse A'])

  const handleToggleSite = (siteName) => {
    if (userSites.includes(siteName)) {
      setUserSites(userSites.filter((s) => s !== siteName))
    } else {
      setUserSites([...userSites, siteName])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    const initials = name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    onSave({
      ...user,
      name: name.trim(),
      email: email.trim(),
      initials,
      role,
      sites: userSites,
    })
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '28px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#101828' }}>
            Edit User Account
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 14px',
                fontSize: '13.5px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 14px',
                fontSize: '13.5px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
              Role Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {['Admin', 'Technician', 'Viewer'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    height: '38px',
                    borderRadius: '100px',
                    border: role === r ? '1.5px solid #1d61ff' : '1px solid #e2e8f0',
                    background: role === r ? '#e0edff' : '#ffffff',
                    color: role === r ? '#1d61ff' : '#475569',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
              Site Access
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sites.map((s) => {
                const checked = userSites.includes(s.name)
                return (
                  <div
                    key={s.id}
                    onClick={() => handleToggleSite(s.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      style={{ accentColor: '#1d61ff', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#101828' }}>{s.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', gap: '10px' }}>
            <button
              type="button"
              onClick={() => onDelete(user.id)}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
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
              <Trash2 size={15} /> Remove
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#1d61ff',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(29, 97, 255, 0.25)',
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
