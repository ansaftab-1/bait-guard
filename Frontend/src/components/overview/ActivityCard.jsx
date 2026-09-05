import React from 'react'
import { Activity, TrendingUp, TrendingDown } from 'lucide-react'

/**
 * ActivityCard Component according to Agent.MD specifications
 * @param {number} [total=42]
 * @param {number} [change=23]
 * @param {number} [changePercent]
 * @param {Array<number>} [data]
 * @param {Array<number>} [series]
 * @param {string} [comparisonLabel='vs yesterday']
 */
export default function ActivityCard({
  total = 42,
  change,
  changePercent = 23,
  data,
  series,
  comparisonLabel = 'vs yesterday',
}) {
  const chartData = data || series || [12, 16, 24, 28, 35, 40, 38, 25, 20, 25, 35, 50]
  const pctChange = change !== undefined ? change : changePercent
  const isPositive = pctChange >= 0

  const generateSmoothPath = (pts, width, height) => {
    if (!pts || pts.length === 0) return ''
    const max = Math.max(...pts, 1)
    const points = pts.map((val, i) => ({
      x: (i / (pts.length - 1)) * width,
      y: height - (val / max) * (height - 20) - 10,
    }))

    let path = `M ${points[0].x},${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1]
      const p1 = points[i]
      const cx = (p0.x + p1.x) / 2
      path += ` C ${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`
    }
    return path
  }

  const generateAreaPath = (pts, width, height) => {
    const linePath = generateSmoothPath(pts, width, height)
    if (!linePath) return ''
    return `${linePath} L ${width},${height} L 0,${height} Z`
  }

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e4e7ec',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(16, 24, 40, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Activity size={18} color="#2563eb" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Today's Detections</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#101828', letterSpacing: '-0.5px' }}>
            {total} <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>detections</span>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12.5px',
              fontWeight: '600',
              color: isPositive ? '#16a34a' : '#dc2626',
              marginTop: '4px',
            }}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>
              {isPositive ? '+' : ''}{pctChange}% {comparisonLabel}
            </span>
          </div>
        </div>

        <select
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '12.5px',
            fontWeight: '600',
            color: '#475569',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>

      {/* SVG Area Line Chart */}
      <div style={{ height: '140px', width: '100%', marginTop: 'auto', position: 'relative' }}>
        <svg viewBox="0 0 500 140" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path d={generateAreaPath(chartData, 500, 140)} fill="url(#activityGradient)" />
          <path d={generateSmoothPath(chartData, 500, 140)} fill="none" stroke="#2563eb" strokeWidth="3" />
          <defs>
            <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
