import React from 'react';

export default function WeeklyActivityWidget({ data }) {
  const chartData = data || [
    { day: 'Tue', value: 4 },
    { day: 'Wed', value: 7 },
    { day: 'Thu', value: 14 },
    { day: 'Fri', value: 10 },
    { day: 'Sat', value: 12 },
    { day: 'Sun', value: 13 },
  ];

  // Generate smooth SVG curve points
  const width = 300;
  const height = 90;
  const paddingX = 10;
  const paddingY = 15;

  const maxVal = Math.max(...chartData.map((d) => d.value), 1);
  const minVal = 0;

  const points = chartData.map((item, index) => {
    const x = paddingX + (index / (chartData.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((item.value - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
    return { x, y, day: item.day, value: item.value };
  });

  const pathD = points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = a[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#0f172a] m-0">This Week's Trend</h3>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#eff6ff] text-[#2563eb]">
          Live Report
        </span>
      </div>

      {/* SVG Line & Area Chart */}
      <div className="w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#trendGradient)" />
          <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        {/* X-Axis Labels */}
        <div className="flex items-center justify-between mt-1 px-1">
          {chartData.map((item, idx) => (
            <span key={idx} className="text-[10.5px] font-semibold text-[#64748b]">
              {item.day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
