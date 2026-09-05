import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * AccessInput — Form input primitive with left inline icon, right toggle, & clean focus states
 * 
 * @param {string} label       - Field label text
 * @param {boolean} required   - If field displays required asterisk *
 * @param {string} placeholder - Placeholder text
 * @param {string} type        - HTML input type ('text' | 'email' | 'tel' | 'password' …)
 * @param {string} id          - Form control ID
 * @param {node} iconLeft      - Icon rendered inside input on the left
 * @param {node} iconRight     - Icon rendered inside input on the right
 * @param {string} value       - Controlled input value
 * @param {function} onChange  - Input change handler
 * @param {string} error       - Validation error message
 * @param {string} helperText  - Optional assistive help text below the input
 * @param {boolean} isTextarea - Render as textarea if true
 */
export default function AccessInput({
  label,
  required = false,
  placeholder,
  type = 'text',
  id,
  iconLeft,
  iconRight,
  value,
  onChange,
  error,
  helperText,
  isTextarea = false,
  rows = 3,
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isPasswordType = type === 'password'
  const resolvedType = isPasswordType ? (showPassword ? 'text' : 'password') : type

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
  }

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#101828',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  }

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: isTextarea ? 'flex-start' : 'center',
    width: '100%',
  }

  const iconContainerStyle = {
    position: 'absolute',
    left: '12px',
    top: isTextarea ? '12px' : '50%',
    transform: isTextarea ? 'none' : 'translateY(-50%)',
    color: isFocused ? '#2f5fe0' : '#667085',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    transition: 'color 0.15s ease',
  }

  const hasRightAction = isPasswordType || iconRight

  const fieldStyle = {
    width: '100%',
    minHeight: isTextarea ? 'auto' : '44px',
    paddingLeft: iconLeft ? '38px' : '14px',
    paddingRight: hasRightAction ? '42px' : '14px',
    paddingTop: isTextarea ? '10px' : '0',
    paddingBottom: isTextarea ? '10px' : '0',
    fontSize: '14px',
    color: '#101828',
    background: error ? '#fef2f2' : '#f9fafb',
    border: `1.5px solid ${error ? '#f87171' : isFocused ? '#4a74f0' : '#e4e7ec'}`,
    borderRadius: '10px',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: isFocused
      ? error
        ? '0 0 0 3px rgba(248,113,113,0.16)'
        : '0 0 0 3px rgba(74,116,240,0.16)'
      : 'none',
    transition: 'all 0.15s ease',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    resize: isTextarea ? 'vertical' : 'none',
  }

  return (
    <div style={containerStyle}>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label}
          {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}

      <div style={inputWrapperStyle}>
        {iconLeft && <div style={iconContainerStyle}>{iconLeft}</div>}

        {isTextarea ? (
          <textarea
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
            style={fieldStyle}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        ) : (
          <input
            id={id}
            type={resolvedType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={fieldStyle}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        )}

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#667085',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {!isPasswordType && iconRight && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#667085',
              pointerEvents: 'none',
            }}
          >
            {iconRight}
          </div>
        )}
      </div>

      {error ? (
        <p style={{ margin: '2px 0 0 2px', fontSize: '12px', color: '#ef4444', fontWeight: '500' }}>
          {error}
        </p>
      ) : helperText ? (
        <p style={{ margin: '2px 0 0 2px', fontSize: '11.5px', color: '#667085', fontWeight: '400' }}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
