import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { ROLE_LABELS } from '../services/authService';

/**
 * UnauthorizedPage — shown when a user tries to access a route
 * their role doesn't have permission for.
 */
export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, getDashboardPath } = useAuth();

  const roleName = user?.role ? (ROLE_LABELS[user.role] || user.role) : 'Unknown';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        padding: '24px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '460px',
          padding: '48px 40px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))',
            border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <ShieldOff size={32} color="#f87171" />
        </div>

        {/* Title */}
        <h1
          style={{
            margin: '0 0 8px',
            fontSize: '28px',
            fontWeight: '800',
            color: '#f1f5f9',
            letterSpacing: '-0.5px',
          }}
        >
          Access Denied
        </h1>

        {/* Error code */}
        <div
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '100px',
            background: 'rgba(239,68,68,0.12)',
            color: '#fca5a5',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '1px',
            marginBottom: '20px',
          }}
        >
          403 FORBIDDEN
        </div>

        {/* Description */}
        <p
          style={{
            margin: '0 0 12px',
            fontSize: '15px',
            color: '#94a3b8',
            lineHeight: 1.6,
          }}
        >
          You don't have permission to access this page.
        </p>
        <p
          style={{
            margin: '0 0 32px',
            fontSize: '13px',
            color: '#64748b',
            lineHeight: 1.6,
          }}
        >
          Your current role is <strong style={{ color: '#cbd5e1' }}>{roleName}</strong>.
          Contact your system administrator if you believe this is an error.
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(getDashboardPath())}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.3)';
            }}
          >
            <ArrowLeft size={16} />
            Go to My Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
