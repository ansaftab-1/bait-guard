import React from 'react';

export default function HotspotStationsWidget({ hotspots }) {
  const items = hotspots || [
    { rank: 1, id: 'RB-03', visits: 28, location: 'Cold storage', percent: 100 },
    { rank: 2, id: 'RB-07', visits: 22, location: 'Warehouse B', percent: 78 },
    { rank: 3, id: 'RB-01', visits: 18, location: 'Kitchen area', percent: 64 },
    { rank: 4, id: 'RB-12', visits: 14, location: 'Main entrance', percent: 50 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
      <h3 className="text-sm font-bold text-[#0f172a] mb-4 m-0">Hotspot Stations</h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {/* Rank Number */}
            <span className="text-xs font-bold text-[#64748b] w-3 text-center shrink-0">
              {item.rank}
            </span>

            {/* Station ID & Location */}
            <div className="w-24 shrink-0">
              <span className="text-xs font-bold text-[#0f172a] block leading-tight">{item.id}</span>
              <span className="text-[11px] text-[#94a3b8] font-medium block truncate">{item.location}</span>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-[#2563eb] transition-all duration-500"
                style={{ width: `${item.percent}%` }}
              />
            </div>

            {/* Visit Count */}
            <span className="text-xs font-bold text-[#475569] w-6 text-right shrink-0">
              {item.visits}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
