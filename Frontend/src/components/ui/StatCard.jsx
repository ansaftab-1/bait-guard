import React from 'react'

/**
 * Reusable StatCard Component according to Agent.MD specifications
 * @param {string} title
 * @param {string|number} value
 * @param {string} subtitle
 * @param {React.ReactNode} icon
 * @param {string} [badge]
 * @param {string} [color='#2563eb']
 */
export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  badge,
  color = '#2563eb',
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e4e7ec',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(16, 24, 40, 0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 24, 40, 0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 24, 40, 0.04)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#667085' }}>{title}</span>
        {icon && (
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: `${color}14`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '26px', fontWeight: '800', color: '#101828', letterSpacing: '-0.5px' }}>
            {value}
          </span>
          {badge && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '100px',
                background: `${color}18`,
                color: color,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <span style={{ fontSize: '12.5px', color: '#667085', marginTop: '4px', display: 'block' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
