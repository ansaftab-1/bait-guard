import React from 'react';
import Chip from '../ui/Chip';
import { Search } from 'lucide-react';

export default function FilterBar({ 
  zones, activeZone, setActiveZone, 
  activeStatus, setActiveStatus,
  searchQuery, setSearchQuery 
}) {
  const statuses = ['All', 'Active', 'Alert', 'Low Bait'];
  const allZones = ['All', ...zones.map(z => z.id)];

  return (
    <div className="flex flex-col gap-4 mb-5">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#7b8aa1] uppercase tracking-wider mr-1">Zones</span>
          {allZones.map(z => (
            <Chip 
              key={z}
              label={z === 'All' ? 'All Zones' : `Zone ${z}`}
              isActive={activeZone === z}
              colorType="blue"
              onClick={() => setActiveZone(z)}
            />
          ))}
        </div>
        
        <div className="h-6 w-px bg-[#e4eaf3]"></div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#7b8aa1] uppercase tracking-wider mr-1">Status</span>
          {statuses.map(s => (
            <Chip 
              key={s}
              label={s}
              isActive={activeStatus === s}
              colorType="dot"
              onClick={() => setActiveStatus(s)}
            />
          ))}
        </div>
      </div>
      
      <div className="relative max-w-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[#9aa8bd]" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-[#e4eaf3] rounded-lg bg-white text-sm placeholder-[#9aa8bd] focus:outline-none focus:border-[#1e5fc4] focus:ring-1 focus:ring-[#1e5fc4] transition-colors"
          placeholder="Search by Station ID, Building..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
