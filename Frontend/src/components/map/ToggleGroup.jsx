import React from 'react';
import { Map, List } from 'lucide-react';

export default function ToggleGroup({ view, setView }) {
  return (
    <div className="flex bg-[#e4eaf3] p-1 rounded-lg">
      <button 
        onClick={() => setView('map')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          view === 'map' ? 'bg-white text-[#12377d] shadow-sm' : 'text-[#7b8aa1] hover:text-[#16233a]'
        }`}
      >
        <Map className="w-4 h-4" />
        Map View
      </button>
      <button 
        onClick={() => setView('list')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          view === 'list' ? 'bg-white text-[#12377d] shadow-sm' : 'text-[#7b8aa1] hover:text-[#16233a]'
        }`}
      >
        <List className="w-4 h-4" />
        List View
      </button>
    </div>
  );
}
