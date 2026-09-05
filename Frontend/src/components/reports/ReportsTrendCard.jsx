import React from 'react';

export default function ReportsTrendCard({ trendSeries }) {
  const labels = trendSeries?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const title = trendSeries?.title || 'Detections Trend (Week View)';

  // SVG Coordinates matching the curve in user image: Mon low -> Tue high -> Wed dip -> Thu mid -> Fri low dip -> Sat high -> Sun high
  const points = [
    { x: 40, y: 130 },
    { x: 140, y: 60 },
    { x: 240, y: 110 },
    { x: 340, y: 90 },
    { x: 440, y: 145 },
    { x: 540, y: 60 },
    { x: 640, y: 120 },
  ];

  const pathD = points.reduce(
    (acc, point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`,
    ''
  );

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0]/80 p-6 shadow-[0_4px_16px_rgba(16,24,40,0.03)] flex flex-col justify-between h-full">
      <h3 className="text-base font-bold text-[#101828] mb-6">{title}</h3>

      {/* SVG Chart Area */}
      <div className="w-full overflow-hidden flex-1 flex flex-col justify-between">
        <svg viewBox="0 0 680 180" className="w-full h-[150px] overflow-visible">
          {/* Subtle Horizontal Grid Lines */}
          <line x1="20" y1="40" x2="660" y2="40" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="20" y1="90" x2="660" y2="90" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="20" y1="140" x2="660" y2="140" stroke="#f1f5f9" strokeWidth="1" />

          {/* Smooth Blue Line Chart */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* X-Axis Labels */}
        <div className="flex items-center justify-between px-2 mt-2 text-xs font-semibold text-[#94a3b8]">
          {labels.map((lbl) => (
            <span key={lbl} className="w-10 text-center">
              {lbl}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
