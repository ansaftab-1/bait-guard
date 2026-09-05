import React from 'react';
import { Search } from 'lucide-react';

export default function StationsSearchToggleRow({ 
  searchQuery, 
  setSearchQuery, 
  viewFilter, 
  setViewFilter 
}) {
  const filterOptions = [
    { id: 'stationId', label: 'Station ID' },
    { id: 'facility', label: 'Facility' },
    { id: 'building', label: 'Building' },
    { id: 'zone', label: 'Zone' },
  ];

  return (
    <div className="flex items-center gap-4 mb-5 flex-wrap">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[260px]">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9aa8bd]">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2.5 border border-[#e4eaf3] rounded-xl bg-white text-sm text-[#16233a] placeholder-[#9aa8bd] focus:outline-none focus:border-[#1e5fc4] focus:ring-1 focus:ring-[#1e5fc4] shadow-sm transition-all"
          placeholder="Search for stations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Segmented View Toggle */}
      <div className="flex bg-white border border-[#e4eaf3] p-1 rounded-xl shadow-sm">
        {filterOptions.map((option) => {
          const isActive = viewFilter === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setViewFilter(option.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1e5fc4] text-white shadow-sm'
                  : 'text-[#7b8aa1] hover:text-[#16233a] hover:bg-[#f2f6fb]'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
