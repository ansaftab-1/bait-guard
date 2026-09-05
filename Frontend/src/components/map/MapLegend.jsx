import React from 'react';
import { STATUS_COLORS } from '../../constants/theme';

export default function MapLegend() {
  const legendItems = [
    { label: 'Active & Secure', color: STATUS_COLORS.active },
    { label: 'Rodent Detected', color: STATUS_COLORS.alert },
    { label: 'Low Bait (Refill)', color: STATUS_COLORS.lowBait },
    { label: 'Offline / Maintenance', color: STATUS_COLORS.offline },
  ];

  return (
    <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur border border-[#e4eaf3] rounded-lg px-4 py-3 shadow-sm z-20">
      <div className="text-[10px] font-bold text-[#7b8aa1] uppercase tracking-widest mb-2.5">Legend</div>
      <div className="flex flex-col gap-2">
        {legendItems.map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-xs font-medium text-[#16233a]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
