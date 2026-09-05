import React from 'react';

const TONE_COLORS = {
  green: '#25b26b',
  red: '#e2453f',
  amber: '#f0a52c',
  muted: '#7b8aa1',
};

export default function ZoneSummaryCard({ title, totalStations, stats, showBorder }) {
  return (
    <div className={`px-5 py-4 flex items-center justify-between ${showBorder ? 'border-r border-[#e4eaf3]' : ''}`}>
      <div>
        <h4 className="text-sm font-bold text-[#16233a]">{title}</h4>
        <p className="text-xs text-[#7b8aa1] mt-0.5">{totalStations} stations total</p>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        {stats.map((stat) => (
          <span 
            key={stat.label} 
            className="text-xs font-semibold"
            style={{ color: TONE_COLORS[stat.tone] || TONE_COLORS.muted }}
          >
            {stat.value} {stat.label}
          </span>
        ))}
      </div>
    </div>
  );
}
