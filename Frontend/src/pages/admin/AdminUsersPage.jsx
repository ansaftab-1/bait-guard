import React, { useState, useEffect } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { apiClient } from '../../api/client'

const CANONICAL_USERS = [
  { id: 'usr-admin-001', name: 'Admin User', email: 'admin@baitguard.com', role: 'admin', roleLabel: 'System Administrator', status: 'active', lastActive: 'Just now' },
  { id: 'usr-tech-001', name: 'Tech User', email: 'technician@baitguard.com', role: 'technician', roleLabel: 'Field Technician', status: 'active', lastActive: '10 mins ago' },
  { id: 'usr-viewer-001', name: 'Viewer User', email: 'user@baitguard.com', role: 'viewer', roleLabel: 'Read-Only Viewer', status: 'active', lastActive: '1 hour ago' },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(CANONICAL_USERS)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'technician' })

  useEffect(() => {
    apiClient.get('/users').then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role || 'viewer',
          roleLabel: u.role === 'admin' ? 'System Administrator' : u.role === 'technician' ? 'Field Technician' : 'Read-Only Viewer',
          status: u.status || 'active',
          lastActive: 'Active',
        })))
      }
    }).catch(() => {})
  }, [])

  const handleAddUser = async (e) => {
    e.preventDefault()
    if (!newUser.name || !newUser.email) return
    const added = {
      id: `u-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      roleLabel: newUser.role === 'admin' ? 'System Administrator' : newUser.role === 'technician' ? 'Field Technician' : 'Read-Only Viewer',
      status: 'active',
      lastActive: 'Just created',
    }
    setUsers([added, ...users])
    setNewUser({ name: '', email: '', role: 'technician' })
    setShowAddModal(false)
  }

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id))
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box', background: '#f4f6f9', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#64748b' }}>
            System Access & Security Controls
          </span>
          <h1 style={{ margin: '2px 0 0', fontSize: '26px', fontWeight: '800', color: '#101828', letterSpacing: '-0.4px' }}>
            User & Role Management
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          style={{
            height: '42px',
            padding: '0 20px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #1d61ff 0%, #004de6 100%)',
            color: '#ffffff',
            fontSize: '13.5px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(29, 97, 255, 0.28)',
          }}
        >
          <Plus size={18} />
          Create User Account
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid #e4e7ec', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={18} color="#64748b" />
        <input
          type="text"
          placeholder="Search accounts by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13.5px', color: '#101828' }}
        />
      </div>

      {/* Users Table */}
      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e4e7ec', overflow: 'hidden', boxShadow: '0 4px 16px rgba(16, 24, 40, 0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #eaecf0', color: '#64748b', fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 20px' }}>User</th>
              <th style={{ padding: '14px 20px' }}>Role</th>
              <th style={{ padding: '14px 20px' }}>Status</th>
              <th style={{ padding: '14px 20px' }}>Last Active</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: u.role === 'admin' ? '#eff6ff' : '#f1f5f9', color: u.role === 'admin' ? '#2563eb' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                      {u.name[0]}
                    </div>
                    <div>
                      <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#101828', display: 'block' }}>{u.name}</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{u.email}</span>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '16px 20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', background: u.role === 'admin' ? '#eff6ff' : '#f8fafc', color: u.role === 'admin' ? '#2563eb' : '#334155', border: '1px solid #e2e8f0' }}>
                    {u.roleLabel}
                  </span>
                </td>

                <td style={{ padding: '16px 20px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Active
                  </span>
                </td>

                <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '12.5px' }}>
                  {u.lastActive}
                </td>

                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(u.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    title="Delete user"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <form onSubmit={handleAddUser} style={{ background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '440px', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '800', color: '#101828' }}>Create User Account</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Full Name</label>
                <input type="text" required value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Email Address</label>
                <input type="email" required value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Assigned Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="admin">System Administrator</option>
                  <option value="technician">Field Technician</option>
                  <option value="viewer">Read-Only Viewer</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#1d61ff', color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}>Create User</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
