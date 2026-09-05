import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getDashboardForRole } from '../services/authService'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const fromPath = location.state?.from?.pathname

  function clearError() {
    if (errorMessage) setErrorMessage('')
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault()
    clearError()

    // Client-side validation
    if (!email.trim()) {
      setErrorMessage('Please enter your company email address.')
      return
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsLoading(true)

    try {
      const loggedInUser = await login(email.trim(), password)
      const dashboardPath = getDashboardForRole(loggedInUser.role)
      const redirectTo = fromPath || dashboardPath
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleQuickFill(accEmail, accPw) {
    setEmail(accEmail)
    setPassword(accPw)
    clearError()
  }

  return (
    <div
      id="login-page"
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        margin: 0,
        padding: 0,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* Responsive layout styles */}
      <style>{`
        @keyframes pulseDot {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(18, 183, 106, 0.5); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(18, 183, 106, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(18, 183, 106, 0); }
        }
        .login-pulse-dot {
          animation: pulseDot 2s infinite ease-in-out;
        }
        @media (max-width: 899px) {
          #login-page {
            flex-direction: column !important;
          }
          .login-left-panel {
            width: 100% !important;
            flex: none !important;
            border-right: none !important;
            border-bottom: 3px solid #2f5fe0 !important;
            padding: 36px 24px !important;
          }
          .login-right-panel {
            width: 100% !important;
            flex: 1 !important;
            padding: 36px 20px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .login-pulse-dot {
            animation: none !important;
          }
        }
      `}</style>

      {/* ══════════════ LEFT PANEL (~46% width) ══════════════ */}
      <div
        className="login-left-panel"
        style={{
          flex: '0 0 46%',
          width: '46%',
          background: 'linear-gradient(160deg, #0b1220 0%, #111d38 50%, #16234a 100%)',
          borderRight: '3px solid #2f5fe0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '52px 48px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle radial glow background decoration */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74, 116, 240, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* 1. Brand Lockup (Top) */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4a74f0 0%, #2f5fe0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(74, 116, 240, 0.35)',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '19px',
                fontWeight: '800',
                color: '#ffffff',
                letterSpacing: '-0.3px',
                lineHeight: 1.15,
              }}
            >
              Smart BaitGuard
            </span>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: '700',
                color: '#4a74f0',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}
            >
              AI-Powered Rodent Monitoring
            </span>
          </div>
        </div>

        {/* 2. Mid Content (Middle) */}
        <div style={{ position: 'relative', zIndex: 1, margin: '48px 0' }}>
          <h1
            style={{
              margin: '0 0 18px',
              fontSize: '29px',
              fontWeight: '800',
              color: '#ffffff',
              lineHeight: 1.25,
              letterSpacing: '-0.6px',
              maxWidth: '440px',
            }}
          >
            Continuous vigilance.{' '}
            <span style={{ color: '#93c5fd' }}>Military-grade precision.</span>
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '14.5px',
              fontWeight: '400',
              color: 'rgba(226, 232, 240, 0.78)',
              lineHeight: 1.7,
              maxWidth: '420px',
            }}
          >
            Protecting multi-site facilities with real-time AI rodent monitoring. Minimize liabilities, automate telemetry, and execute instant target event response.
          </p>
        </div>

        {/* 3 & 4. Status Pill & Footer (Bottom) */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Status Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              padding: '7px 16px',
              borderRadius: '100px',
              width: 'fit-content',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span
              className="login-pulse-dot"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#12b76a',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '12.5px',
                fontWeight: '500',
                color: '#e2e8f0',
                letterSpacing: '0.01em',
              }}
            >
              All stations reporting normally
            </span>
          </div>

          {/* Footer Uppercase Microcopy */}
          <div
            style={{
              fontSize: '10px',
              fontWeight: '700',
              color: 'rgba(148, 163, 184, 0.65)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            POWERED BY SMART IOT SYSTEMS
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT PANEL (Light Gray Background) ══════════════ */}
      <div
        className="login-right-panel"
        style={{
          flex: 1,
          background: '#f3f5fb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {/* Centered White Card (max 400px) */}
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 24px 48px -20px rgba(16,24,40,.16)',
            border: '1px solid #e4e7ec',
            padding: '36px 32px',
            boxSizing: 'border-box',
          }}
        >
          {/* Card Header */}
          <div style={{ marginBottom: '24px' }}>
            <h2
              style={{
                margin: '0 0 6px',
                fontSize: '20px',
                fontWeight: '700',
                color: '#101828',
                letterSpacing: '-0.3px',
              }}
            >
              Welcome Back
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: '#667085',
                lineHeight: 1.5,
              }}
            >
              Sign in to monitor your smart bait stations.
            </p>
          </div>

          {/* Inline Error Message Banner */}
          {errorMessage && (
            <div
              style={{
                marginBottom: '18px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
                <path d="M8 4.5v3.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="10.5" r="0.75" fill="#ef4444" />
              </svg>
              <span style={{ fontSize: '12.5px', color: '#991b1b', fontWeight: '500', flex: 1 }}>
                {errorMessage}
              </span>
              <button
                type="button"
                onClick={clearError}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#dc2626',
                  fontSize: '16px',
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* Log In Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 1. Email Address Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="email"
                style={{ fontSize: '13px', fontWeight: '600', color: '#101828' }}
              >
                Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '12px',
                    color: '#667085',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '0 14px 0 38px',
                    fontSize: '13.5px',
                    color: '#101828',
                    background: '#f9fafb',
                    border: '1.5px solid #e4e7ec',
                    borderRadius: '10px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4a74f0'
                    e.target.style.boxShadow = '0 0 0 3px rgba(74, 116, 240, 0.16)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e4e7ec'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* 2. Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="password"
                style={{ fontSize: '13px', fontWeight: '600', color: '#101828' }}
              >
                Password <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '12px',
                    color: '#667085',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '0 40px 0 38px',
                    fontSize: '13.5px',
                    color: '#101828',
                    background: '#f9fafb',
                    border: '1.5px solid #e4e7ec',
                    borderRadius: '10px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4a74f0'
                    e.target.style.boxShadow = '0 0 0 3px rgba(74, 116, 240, 0.16)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e4e7ec'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                {/* Password visibility toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#667085',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* 3. Options Row (Remember me + Forgot Password) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '13px',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#667085',
                  fontWeight: '500',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#2f5fe0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => alert('Password reset instructions have been sent to your administrator.')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#2f5fe0',
                  cursor: 'pointer',
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* 4. Full-Width Primary Log In Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #4a74f0 0%, #2f5fe0 100%)',
                color: '#ffffff',
                fontSize: '14.5px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(47, 95, 224, 0.25)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '4px',
                opacity: isLoading ? 0.75 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(47, 95, 224, 0.35)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(47, 95, 224, 0.25)'
                }
              }}
            >
              {isLoading ? 'Signing in...' : 'Log In'}
              {!isLoading && <ArrowRight size={17} />}
            </button>
          </form>

          {/* 5. Footer Line: Contact Administrator Link */}
          <div
            style={{
              marginTop: '22px',
              paddingTop: '18px',
              borderTop: '1px solid #e4e7ec',
              textAlign: 'center',
              fontSize: '12.5px',
              color: '#667085',
            }}
          >
            Need access to the system?{' '}
            <button
              type="button"
              onClick={() => navigate('/request-access')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#2f5fe0',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '12.5px',
                textDecoration: 'none',
              }}
            >
              Contact Administrator
            </button>
          </div>

          {/* Developer / Tester Accounts Quick Fill Helper */}
          <div
            style={{
              marginTop: '20px',
              padding: '12px 14px',
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '10px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              TEST ACCOUNTS QUICK FILL
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              {[
                { role: 'Admin', email: 'admin@baitguard.com', pw: 'admin123' },
                { role: 'Technician', email: 'technician@baitguard.com', pw: 'tech123' },
                { role: 'Viewer', email: 'user@baitguard.com', pw: 'user123' },
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickFill(acc.email, acc.pw)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    fontSize: '11.5px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#334155',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2f5fe0'
                    e.currentTarget.style.color = '#2f5fe0'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0'
                    e.currentTarget.style.color = '#334155'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '11px' }}>{acc.role}</strong>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>{acc.email.split('@')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
