import React from 'react';
import { STATUS_COLORS } from '../../constants/theme';

export default function StationMarker({ station, isSelected, onClick }) {
  const bgColor = STATUS_COLORS[station.status] || STATUS_COLORS.offline;
  
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10"
      style={{ left: `${station.x}%`, top: `${station.y}%` }}
      onClick={onClick}
    >
      <div 
        className={`rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white transition-all duration-200 ${
          isSelected ? 'w-10 h-10 text-sm ring-4 ring-offset-1' : 'w-8 h-8 text-xs hover:scale-110'
        }`}
        style={{ 
          backgroundColor: bgColor,
          boxShadow: isSelected ? `0 0 0 4px ${bgColor}40` : ''
        }}
      >
        {station.id}
      </div>
    </div>
  );
}
