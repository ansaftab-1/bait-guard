import React from 'react';

export default function ProgressMetric({ label, value, percent, colorClass }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-[#7b8aa1]">{label}</span>
        <span className="text-sm font-bold text-[#16233a]">{value}</span>
      </div>
      <div className="w-full bg-[#e4eaf3] rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClass}`} 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
