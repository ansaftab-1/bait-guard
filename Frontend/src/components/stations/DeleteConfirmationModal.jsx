import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

/**
 * DeleteConfirmationModal Component according to Agent.MD specifications
 * @param {boolean} isOpen
 * @param {string} stationId
 * @param {string} stationName
 * @param {boolean} isLoading
 * @param {function} onClose
 * @param {function} onConfirm
 */
export default function DeleteConfirmationModal({
  isOpen,
  stationId,
  stationName,
  isLoading = false,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '28px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: '#64748b',
          }}
        >
          <X size={18} />
        </button>

        {/* Warning Icon Badge */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <AlertTriangle size={24} color="#ef4444" />
        </div>

        {/* Content */}
        <h3 style={{ margin: '0 0 8px', fontSize: '19px', fontWeight: '800', color: '#101828' }}>
          Delete Station
        </h3>
        <p style={{ margin: '0 0 24px', fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
          Are you sure you want to delete station <strong style={{ color: '#101828' }}>{stationId || stationName}</strong>? This action cannot be undone and all associated telemetry history will be removed.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              height: '42px',
              padding: '0 20px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#334155',
              fontSize: '13.5px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              height: '42px',
              padding: '0 20px',
              borderRadius: '10px',
              border: 'none',
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.75 : 1,
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
            }}
          >
            {isLoading ? 'Deleting...' : 'Delete Station'}
          </button>
        </div>
      </div>
    </div>
  )
}
