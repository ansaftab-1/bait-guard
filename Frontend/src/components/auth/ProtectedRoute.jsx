import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../services/authService'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  // 1. Full-Screen Loading Gate during session restoration after page refresh (F5)
  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b1220',
          color: '#ffffff',
          fontFamily: "'Inter', system-ui, sans-serif",
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255, 255, 255, 0.15)',
              borderTopColor: '#1d61ff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#94a3b8', letterSpacing: '0.5px' }}>
            Restoring Session...
          </span>
        </div>
      </div>
    )
  }

  // 2. Unauthenticated check
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const userRole = (user.role || '').toLowerCase();

  // 3. Role restriction for elevated routes
  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());
    const isAllowed = normalizedAllowed.includes(userRole);

    if (!isAllowed) {
      const fallbackDashboard =
        userRole === 'admin'
          ? '/admin/dashboard'
          : userRole === 'technician'
          ? '/dashboard/technician'
          : '/dashboard/viewer';

      return <Navigate to="/unauthorized" state={{ from: location, fallback: fallbackDashboard }} replace />;
    }
  }

  // 4. Role-based redirect for generic /dashboard
  if (location.pathname === '/dashboard') {
    const targetDashboard =
      userRole === 'admin'
        ? '/admin/dashboard'
        : userRole === 'technician'
        ? '/dashboard/technician'
        : '/dashboard/viewer';

    return <Navigate to={targetDashboard} replace />;
  }

  return children;
}

