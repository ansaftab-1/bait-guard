import { TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react'

/**
 * StationHealthCard Component
 * @param {number} [score=87]
 * @param {string} [status='Optimal']
 * @param {number} [activeStations=118]
 * @param {number} [attention=8]
 * @param {number} [weeklyChange=4.2]
 * @param {Array} [stats]
 */
export default function StationHealthCard({
  score = 87,
  status = 'Optimal',
  activeStations = 118,
  attention = 8,
  weeklyChange = 4.2,
  stats,
}) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const activeCount = activeStations || (stats && stats.find(s => s.id === 'active')?.value) || 118
  const attentionCount = attention || (stats && stats.find(s => s.id === 'refills')?.value) || 8

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="#2563eb" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#101828' }}>
            System Health & Readiness
          </h3>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12px',
            fontWeight: '700',
            padding: '4px 10px',
            borderRadius: '100px',
            background: score >= 80 ? '#e7f9ef' : '#fef3c7',
            color: score >= 80 ? '#0e7845' : '#b45309',
          }}
        >
          <CheckCircle2 size={13} />
          {status}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {/* SVG Health Circle */}
        <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
          <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="55" cy="55" r={radius} stroke="#e2e8f0" strokeWidth="9" fill="transparent" />
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="url(#healthGradient)"
              strokeWidth="9"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
            <defs>
              <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4a74f0" />
                <stop offset="100%" stopColor="#2f5fe0" />
              </linearGradient>
            </defs>
          </svg>
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
              {score}%
            </span>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginTop: '2px' }}>
              Score
            </span>
          </div>
        </div>

        {/* Telemetry Breakdown List */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', minWidth: '180px' }}>
          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', display: 'block' }}>Active Stations</span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginTop: '2px', display: 'block' }}>
              {activeCount}
            </span>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', display: 'block' }}>Need Attention</span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#d97706', marginTop: '2px', display: 'block' }}>
              {attentionCount}
            </span>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#16a34a', fontWeight: '600' }}>
            <TrendingUp size={15} />
            <span>+{weeklyChange}% improvement from last week</span>
          </div>
        </div>
      </div>
    </div>
  )
}
