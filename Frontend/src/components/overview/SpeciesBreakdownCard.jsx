import React from 'react'
import { PieChart as PieIcon } from 'lucide-react'

/**
 * SpeciesBreakdownCard Component according to Agent.MD specifications
 * @param {Array<{ name: string, value: number, percent?: number, color?: string }>} [data]
 * @param {Array} [breakdown]
 * @param {number} [total]
 * @param {string} [caption='Total Detections']
 */
export default function SpeciesBreakdownCard({
  data,
  breakdown,
  total,
  caption = 'Total Detections',
}) {
  const defaultData = [
    { name: 'Rat', value: 58, color: '#ef4444' },
    { name: 'Mouse', value: 29, color: '#f59e0b' },
    { name: 'Other', value: 13, color: '#94a3b8' },
  ]

  const items = (data || breakdown || defaultData).map((item, idx) => {
    const name = item.name || item.label || item.id || `Species ${idx + 1}`
    const val = item.value !== undefined ? item.value : item.percent || 0
    const color = item.color || (name.toLowerCase().includes('rat') ? '#ef4444' : name.toLowerCase().includes('mouse') ? '#f59e0b' : '#94a3b8')
    return { name, value: val, color }
  })

  const totalSum = total !== undefined ? total : items.reduce((acc, cur) => acc + cur.value, 0)

  // SVG Pie chart calculation
  let cumulativePercent = 0
  const svgSlices = items.map((item) => {
    const pct = totalSum > 0 ? (item.value / totalSum) * 100 : 0
    const dashArray = `${pct} ${100 - pct}`
    const dashOffset = 100 - cumulativePercent
    cumulativePercent += pct
    return { ...item, dashArray, dashOffset }
  })

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
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <PieIcon size={18} color="#2563eb" />
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#101828' }}>
          Species Breakdown
        </h3>
      </div>

      {/* Donut Chart Viewport */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto 0' }}>
        <div style={{ position: 'relative', width: '150px', height: '150px', marginBottom: '20px' }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            {svgSlices.map((slice, i) => (
              <circle
                key={slice.name + i}
                cx="18"
                cy="18"
                r="15.9155"
                fill="transparent"
                stroke={slice.color}
                strokeWidth="4.5"
                strokeDasharray={slice.dashArray}
                strokeDashoffset={slice.dashOffset}
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
              />
            ))}
          </svg>

          {/* Center Donut Label */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '26px', fontWeight: '800', color: '#101828', lineHeight: 1 }}>
              {totalSum}
            </span>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginTop: '2px' }}>
              {caption}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((item) => {
            const pct = totalSum > 0 ? Math.round((item.value / totalSum) * 100) : item.value
            return (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                  <span style={{ fontWeight: '600', color: '#334155' }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: '700', color: '#101828' }}>{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
