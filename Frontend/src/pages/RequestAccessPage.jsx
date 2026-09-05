import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Building2, Phone, Layers, ShieldCheck, Shield, ArrowLeft } from 'lucide-react'
import AccessInput from '../components/ui/AccessInput'
import { submitAccessRequest } from '../services/accessRequestService'
import SubmissionConfirmedPage from './SubmissionConfirmedPage'

/**
 * RequestAccessPage Component
 * 
 * Configurable via props for easy backend/mock integration:
 * @param {function} [onSubmitRequest] - Custom submit handler override (async function)
 * @param {function} [onCancel]          - Custom cancel navigation override
 * @param {number}   [facilityCount=14] - Active monitoring facility count label
 */
export default function RequestAccessPage({
  onSubmitRequest,
  onCancel,
  facilityCount = 14,
}) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    company: '',
    phone: '',
    department: '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    if (submitError) {
      setSubmitError('')
    }
  }

  function validate() {
    const newErrors = {}
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Company Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company / Organisation is required'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setSubmitError('')

    try {
      if (onSubmitRequest) {
        await onSubmitRequest(formData)
      } else {
        await submitAccessRequest(formData)
      }
      setIsSubmitted(true)
      navigate('/request-access/confirmed')
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleCancel() {
    if (onCancel) {
      onCancel()
    } else {
      navigate('/login')
    }
  }

  if (isSubmitted) {
    return <SubmissionConfirmedPage onBackToLogin={() => navigate('/login')} />
  }


  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f3f5fb',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Container Wrapper with max-width 1080px */}
      <div
        style={{
          width: '100%',
          maxWidth: '1080px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* ─── Top Bar Header ─── */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 4px',
          }}
        >
          {/* Logo Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4a74f0 0%, #2f5fe0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(74, 116, 240, 0.25)',
              }}
            >
              <ShieldCheck size={20} color="#ffffff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  color: '#101828',
                  letterSpacing: '-0.3px',
                  lineHeight: 1.2,
                }}
              >
                Smart BaitGuard
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: '700',
                  color: '#4a74f0',
                  letterSpacing: '1.2px',
                  lineHeight: 1,
                  marginTop: '1px',
                }}
              >
                AI MONITORING
              </span>
            </div>
          </div>

          {/* Label Right */}
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#667085',
              background: '#ffffff',
              padding: '6px 14px',
              borderRadius: '100px',
              border: '1px solid #e4e7ec',
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05)',
            }}
          >
            Credentials Application
          </div>
        </header>

        {/* ─── Main Two-Column Card ─── */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 24px 48px -20px rgba(16,24,40,.18)',
            overflow: 'hidden',
            border: '1px solid #e4e7ec',
          }}
        >
          {/* Responsive stylesheet inject for left panel collapse below 960px */}
          <style>{`
            @media (max-width: 959px) {
              .access-left-panel {
                display: none !important;
              }
              .access-right-panel {
                border-radius: 20px !important;
              }
            }
          `}</style>

          {/* ════════ LEFT PANEL (hidden <960px) ════════ */}
          <div
            className="access-left-panel"
            style={{
              flex: '0 0 42%',
              background: 'linear-gradient(160deg, #0b1220 0%, #111d38 50%, #16234a 100%)',
              padding: '48px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle glow background element */}
            <div
              style={{
                position: 'absolute',
                top: '-60px',
                right: '-60px',
                width: '260px',
                height: '260px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(74, 116, 240, 0.18) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Top Shield Icon Badge */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Shield size={26} color="#93c5fd" />
              </div>
            </div>

            {/* Middle Content */}
            <div style={{ position: 'relative', zIndex: 1, margin: '40px 0' }}>
              <h2
                style={{
                  margin: '0 0 16px',
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#ffffff',
                  lineHeight: 1.25,
                  letterSpacing: '-0.5px',
                }}
              >
                Access is reviewed by a person, not just a checkbox.
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: 1.65,
                  color: 'rgba(226, 232, 240, 0.78)',
                  fontWeight: '400',
                }}
              >
                Our security governance team manually verifies organizational credentials to ensure facility integrity and strict access protocol.
              </p>
            </div>

            {/* Bottom Status Pill */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '6px 14px',
                  borderRadius: '100px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#12b76a',
                    boxShadow: '0 0 8px #12b76a',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: '500',
                    color: '#e2e8f0',
                  }}
                >
                  Monitoring active across {facilityCount} facilities
                </span>
              </div>
            </div>
          </div>

          {/* ════════ RIGHT PANEL (Form) ════════ */}
          <div
            className="access-right-panel"
            style={{
              flex: 1,
              padding: '44px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Form Card Header */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={18} color="#2f5fe0" />
                </div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#101828',
                    letterSpacing: '-0.3px',
                  }}
                >
                  Request System Access
                </h1>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '13.5px',
                  color: '#667085',
                  lineHeight: 1.5,
                }}
              >
                Your request will be reviewed by an administrator shortly.
              </p>
            </div>

            {/* Error banner if submission failed */}
            {submitError && (
              <div
                style={{
                  marginBottom: '20px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  fontSize: '13px',
                  fontWeight: '500',
                }}
              >
                {submitError}
              </div>
            )}

            {/* Access Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 1. Full Name */}
              <AccessInput
                id="fullName"
                label="Full Name"
                required
                placeholder="John Smith"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                iconLeft={<User size={18} />}
                error={errors.fullName}
              />

              {/* 2. Company Email */}
              <AccessInput
                id="email"
                label="Company Email"
                required
                type="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                iconLeft={<Mail size={18} />}
                error={errors.email}
              />

              {/* 3. Password */}
              <AccessInput
                id="password"
                label="Password"
                required
                type="password"
                placeholder="Create a password (min. 6 characters)"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                iconLeft={<Lock size={18} />}
                error={errors.password}
                helperText="You will use this password to log in once your access is approved."
              />

              {/* 4. Company / Organisation */}
              <AccessInput
                id="company"
                label="Company / Organisation"
                required
                placeholder="Acme Corp"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                iconLeft={<Building2 size={18} />}
                error={errors.company}
              />

              {/* 4. Phone Number */}
              <AccessInput
                id="phone"
                label="Phone Number"
                required
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                iconLeft={<Phone size={18} />}
                error={errors.phone}
              />

              {/* 5. Department (Optional) */}
              <AccessInput
                id="department"
                label="Department (Optional)"
                placeholder="Facilities / Maintenance"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                iconLeft={<Layers size={18} />}
              />

              {/* 6. Additional Message (Optional) */}
              <AccessInput
                id="message"
                label="Additional Message (Optional)"
                placeholder="Tell us why you need access to this facility..."
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                isTextarea
                rows={3}
              />

              {/* Action Buttons Stacked */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                {/* Primary Button */}
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
                  {isLoading ? 'Sending Request...' : 'Send Request'}
                </button>

                {/* Secondary Button */}
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '10px',
                    border: '1.5px solid #2f5fe0',
                    background: '#ffffff',
                    color: '#2f5fe0',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f4f7ff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff'
                  }}
                >
                  <ArrowLeft size={16} />
                  Cancel and Back
                </button>
              </div>

              {/* Footer Microcopy */}
              <p
                style={{
                  margin: '8px 0 0',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#667085',
                }}
              >
                Your data is only visible to your facility's administrator.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
