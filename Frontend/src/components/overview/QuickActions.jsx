import React from 'react'
import { RefreshCw, MapPin, Download, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../services/authService'

/**
 * QuickActions Component according to Agent.MD specs
 * @param {function} [onRefresh]
 * @param {function} [onMap]
 * @param {function} [onExport]
 * @param {function} [onConfig]
 * @param {function} [onAction]
 */
export default function QuickActions({
  onRefresh,
  onMap,
  onExport,
  onConfig,
  onAction,
}) {
  const { user } = useAuth()
  const isViewer = !user || user.role === ROLES.VIEWER || user.role === 'VIEWER'

  const actions = [
    {
      id: 'refresh',
      label: 'Refresh',
      icon: <RefreshCw size={20} color="#2563eb" />,
      disabled: false,
      onClick: () => {
        if (onRefresh) onRefresh()
        else if (onAction) onAction('refresh')
      },
    },
    {
      id: 'map',
      label: 'Facility Map',
      icon: <MapPin size={20} color="#2563eb" />,
      disabled: false,
      onClick: () => {
        if (onMap) onMap()
        else if (onAction) onAction('map')
      },
    },
    {
      id: 'export',
      label: 'Export Reports',
      icon: <Download size={20} color="#2563eb" />,
      disabled: false,
      onClick: () => {
        if (onExport) onExport()
        else if (onAction) onAction('export')
      },
    },
    {
      id: 'config',
      label: 'System Config',
      icon: <Settings size={20} color={isViewer ? '#94a3b8' : '#2563eb'} />,
      disabled: isViewer,
      title: isViewer ? 'System Config is restricted for Viewer accounts' : 'System Configuration',
      onClick: () => {
        if (isViewer) return
        if (onConfig) onConfig()
        else if (onAction) onAction('config')
      },
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        margin: '20px 0',
      }}
    >
      {actions.map((act) => (
        <button
          key={act.id}
          type="button"
          disabled={act.disabled}
          title={act.title}
          onClick={act.onClick}
          style={{
            background: act.disabled ? '#f8fafc' : '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e4e7ec',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: act.disabled ? 'not-allowed' : 'pointer',
            opacity: act.disabled ? 0.6 : 1,
            boxShadow: '0 2px 6px rgba(16, 24, 40, 0.03)',
            transition: 'all 0.15s ease',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            if (act.disabled) return
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(16, 24, 40, 0.08)'
            e.currentTarget.style.borderColor = '#bfdbfe'
          }}
          onMouseLeave={(e) => {
            if (act.disabled) return
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(16, 24, 40, 0.03)'
            e.currentTarget.style.borderColor = '#e4e7ec'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: act.disabled ? '#e2e8f0' : '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {act.icon}
          </div>
          <div>
            <span style={{ fontSize: '13.5px', fontWeight: '700', color: act.disabled ? '#64748b' : '#101828', display: 'block' }}>
              {act.label}
            </span>
            {act.disabled && (
              <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: '600' }}>Admin only</span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

