import React from 'react';

export default function PageHeader({ totalStations, totalZones, view, setView }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-[22px] font-bold text-[#16233a]">Facility Map</h1>
        <p className="text-[#7b8aa1] text-sm mt-0.5">{totalStations} stations · {totalZones} zones</p>
      </div>
      <div className="flex bg-white border border-[#e4eaf3] p-1 rounded-lg">
        <button
          onClick={() => setView('map')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
            view === 'map'
              ? 'bg-[#1e5fc4] text-white shadow-sm'
              : 'text-[#7b8aa1] hover:text-[#16233a] hover:bg-[#f2f6fb]'
          }`}
        >
          Map View
        </button>
        <button
          onClick={() => setView('list')}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
            view === 'list'
              ? 'bg-[#1e5fc4] text-white shadow-sm'
              : 'text-[#7b8aa1] hover:text-[#16233a] hover:bg-[#f2f6fb]'
          }`}
        >
          List View
        </button>
      </div>
    </div>
  );
}
