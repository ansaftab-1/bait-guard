import React from 'react';

export default function FilterChipRow({ activeFilter, setActiveFilter }) {
  const chips = [
    { id: 'all', label: 'All' },
    { id: 'rodent', label: 'Rodent' },
    { id: 'lowBait', label: 'Low bait' },
    { id: 'tamper', label: 'Tamper' },
    { id: 'offline', label: 'Offline' },
  ];

  return (
    <div className="flex items-center gap-2.5 mb-6 flex-wrap">
      {chips.map((chip) => {
        const isActive = activeFilter === chip.id;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => setActiveFilter(chip.id)}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-none ${
              isActive
                ? 'bg-[#2563eb] text-white shadow-sm'
                : 'bg-white text-[#64748b] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#0f172a]'
            }`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
