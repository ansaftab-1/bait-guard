import React from 'react';
import { MoreVertical } from 'lucide-react';

export default function StationsPageHeader({ totalStations = 120, activeStations = 118 }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-[24px] font-bold text-[#16233a] tracking-tight">Stations</h1>
        <p className="text-[#7b8aa1] text-sm mt-0.5 font-medium">
          {totalStations} total · {activeStations} active
        </p>
      </div>
      <button 
        className="p-2 text-[#7b8aa1] hover:text-[#16233a] hover:bg-white rounded-lg border border-transparent hover:border-[#e4eaf3] transition-all cursor-pointer"
        title="More options"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
}
