import React from 'react';
import ZoneSummaryCard from './ZoneSummaryCard';

export default function ZoneSummaryBar({ zoneSummaries }) {
  if (!zoneSummaries || zoneSummaries.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-0 mt-5 border border-[#e4eaf3] rounded-xl overflow-hidden bg-white">
      {zoneSummaries.map((zone, index) => (
        <ZoneSummaryCard 
          key={zone.id}
          title={zone.title}
          totalStations={zone.totalStations}
          stats={zone.stats}
          showBorder={index < zoneSummaries.length - 1}
        />
      ))}
    </div>
  );
}
