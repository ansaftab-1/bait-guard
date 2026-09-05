import React from 'react';

export default function StationsStatCardsRow({ summary }) {
  const cards = [
    {
      id: 'uptime',
      label: 'Uptime',
      value: summary?.uptime || '98.4%',
      colorClass: 'text-[#1e5fc4]', // blue
    },
    {
      id: 'refills',
      label: 'Pending Refills',
      value: summary?.pendingRefills ?? 8,
      colorClass: 'text-[#f0a52c]', // amber
    },
    {
      id: 'detects',
      label: 'Total Detects (24h)',
      value: summary?.totalDetects24h ?? 42,
      colorClass: 'text-[#1e5fc4]', // blue
    },
    {
      id: 'offline',
      label: 'Stations Offline',
      value: summary?.stationsOffline ?? 2,
      colorClass: 'text-[#e2453f]', // red
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-xl border border-[#e4eaf3] p-4 shadow-sm flex flex-col justify-between"
        >
          <span className="text-xs font-medium text-[#7b8aa1] uppercase tracking-wider">
            {card.label}
          </span>
          <span className={`text-2xl font-bold mt-2 ${card.colorClass}`}>
            {card.value}
          </span>
        </div>
      ))}
    </div>
  );
}
