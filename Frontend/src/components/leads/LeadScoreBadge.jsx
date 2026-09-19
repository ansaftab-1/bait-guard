import React from 'react';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

const PRIORITY_CONFIG = {
  high: {
    label: 'HIGH',
    bg: '#dcfce7',
    color: '#15803d',
    border: '#86efac',
    Icon: ArrowUp,
    dot: '#16a34a',
  },
  medium: {
    label: 'MEDIUM',
    bg: '#fef9c3',
    color: '#a16207',
    border: '#fde047',
    Icon: ArrowRight,
    dot: '#d97706',
  },
  low: {
    label: 'LOW',
    bg: '#f1f5f9',
    color: '#475569',
    border: '#cbd5e1',
    Icon: ArrowDown,
    dot: '#94a3b8',
  },
};

/**
 * LeadScoreBadge — displays a numeric score pill and a text priority badge.
 *
 * @param {number} score — 0–100
 * @param {string} priority — 'high' | 'medium' | 'low'
 * @param {boolean} compact — shows only the priority badge (for table rows)
 */
export default function LeadScoreBadge({ score, priority = 'low', compact = false }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
  const { Icon } = cfg;

  const scoreColor =
    score >= 80 ? '#15803d' :
    score >= 60 ? '#a16207' :
    '#dc2626';

  if (compact) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '0.04em',
          padding: '3px 8px',
          borderRadius: '100px',
          background: cfg.bg,
          color: cfg.color,
          border: `1px solid ${cfg.border}`,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon size={11} strokeWidth={2.5} />
        {cfg.label}
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Numeric score */}
      <span
        style={{
          fontSize: '15px',
          fontWeight: '800',
          color: scoreColor,
          minWidth: '30px',
          letterSpacing: '-0.3px',
        }}
      >
        {score}
      </span>

      {/* Priority badge */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '0.04em',
          padding: '2px 7px',
          borderRadius: '100px',
          background: cfg.bg,
          color: cfg.color,
          border: `1px solid ${cfg.border}`,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon size={10} strokeWidth={2.5} />
        {cfg.label}
      </span>
    </div>
  );
}

/**
 * DataQualityBadge — displays a data quality status pill.
 * @param {string} status — 'good' | 'needs_review' | 'poor'
 * @param {number} pct — 0–100
 */
export function DataQualityBadge({ status, pct }) {
  const cfg = {
    good:         { label: 'Good',         bg: '#dcfce7', color: '#15803d', border: '#86efac' },
    needs_review: { label: 'Needs Review', bg: '#fef9c3', color: '#a16207', border: '#fde047' },
    poor:         { label: 'Poor',         bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' },
  }[status] || { label: 'Unknown', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '0.04em',
          padding: '2px 7px',
          borderRadius: '100px',
          background: cfg.bg,
          color: cfg.color,
          border: `1px solid ${cfg.border}`,
          whiteSpace: 'nowrap',
        }}
      >
        {cfg.label}
      </span>
      {pct !== undefined && (
        <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>{pct}%</span>
      )}
    </div>
  );
}
