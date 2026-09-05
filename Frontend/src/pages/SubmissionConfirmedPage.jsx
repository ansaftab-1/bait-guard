import { useNavigate } from 'react-router-dom'
import { ShieldCheck, HelpCircle } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'


/**
 * SubmissionConfirmedPage Component
 * 
 * Rendered after an access request submission. Matches design mock image exactly.
 * 
 * @param {function} [onBackToLogin] - Custom back handler override
 */
export default function SubmissionConfirmedPage({ onBackToLogin }) {
  const navigate = useNavigate()

  function handleBack() {
    if (onBackToLogin) {
      onBackToLogin()
    } else {
      navigate('/login')
    }
  }

  const STEPS = [
    {
      num: 1,
      title: 'Request reviewed by administrator',
      description: 'Your system administrator reviews the submitted details to verify identity and clearance.',
    },
    {
      num: 2,
      title: 'Account generation upon approval',
      description: 'If approved, an operator profile with appropriate location permissions will be configured.',
    },
    {
      num: 3,
      title: 'Access link dispatched',
      description: 'You will receive an automated invitation email containing setup guidelines and dashboard login.',
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#f4f6f9',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* ─── Top Bar Header (Full Width White Header) ─── */}
      <header
        style={{
          width: '100%',
          height: '64px',
          background: '#ffffff',
          borderBottom: '1px solid #eaecf0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
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
                lineHeight: 1.15,
              }}
            >
              Smart BaitGuard
            </span>
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: '700',
                color: '#64748b',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '1px',
              }}
            >
              AI MONITORING
            </span>
          </div>
        </div>

        {/* Text Right */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#667085',
          }}
        >
          Submission Confirmed
        </div>
      </header>

      {/* ─── Centered Card Section ─── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 20px 40px -15px rgba(16, 24, 40, 0.08)',
            border: '1px solid #f1f5f9',
            padding: '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          {/* 1. Lottie Email Sent Animation */}
          <div
            style={{
              width: '180px',
              height: '180px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DotLottieReact
              src="https://lottie.host/b13adc16-1317-4f20-881b-b0b5202440b1/69VYIuMblg.json"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* 2. Heading */}
          <h1
            style={{
              margin: '0 0 10px',
              fontSize: '22px',
              fontWeight: '700',
              color: '#101828',
              letterSpacing: '-0.4px',
            }}
          >
            Request Submitted Successfully
          </h1>

          {/* 3. Subtext */}
          <p
            style={{
              margin: '0 0 28px',
              fontSize: '13.5px',
              color: '#667085',
              lineHeight: 1.55,
              maxWidth: '380px',
            }}
          >
            Thank you for your request. Your system administrator has received your information and will review it shortly.
          </p>

          {/* 4. Light Gray Sub-panel: "What happens next?" */}
          <div
            style={{
              width: '100%',
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '22px 20px',
              marginBottom: '28px',
              textAlign: 'left',
              boxSizing: 'border-box',
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <HelpCircle size={17} color="#2563eb" strokeWidth={2.2} />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#101828',
                  letterSpacing: '-0.2px',
                }}
              >
                What happens next?
              </span>
            </div>

            {/* 3 Numbered Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {STEPS.map((step) => (
                <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  {/* Blue Circular Number Badge */}
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#2563eb',
                      color: '#ffffff',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '1px',
                    }}
                  >
                    {step.num}
                  </div>

                  {/* Step Title & Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#101828', lineHeight: 1.3 }}>
                      {step.title}
                    </span>
                    <span style={{ fontSize: '12.5px', color: '#667085', lineHeight: 1.45 }}>
                      {step.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Full-width Primary Button */}
          <button
            type="button"
            onClick={handleBack}
            style={{
              width: '100%',
              height: '46px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #1d61ff 0%, #004de6 100%)',
              color: '#ffffff',
              fontSize: '14.5px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(29, 97, 255, 0.35)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(29, 97, 255, 0.45)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(29, 97, 255, 0.35)'
            }}
          >
            Back to Login
          </button>
        </div>
      </main>
    </div>
  )
}
