import React, { useState, useMemo, useCallback } from 'react';
import PageHeader from '../components/map/PageHeader';
import FilterBar from '../components/map/FilterBar';
import FacilityMapCanvas from '../components/map/FacilityMapCanvas';
import StationDetailPanel from '../components/map/StationDetailPanel';
import ZoneSummaryBar from '../components/map/ZoneSummaryBar';
import useMapData from '../hooks/useMapData';

export default function FacilityMapPage() {
  const { data, isLoading } = useMapData();
  const [view, setView] = useState('map');
  const [activeZone, setActiveZone] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);

  // Filter stations based on criteria (memoized to avoid re-filtering on station selection)
  const filteredStations = useMemo(() => {
    if (!data?.stations) return [];
    return data.stations.filter(station => {
      if (activeZone !== 'All' && station.zone !== activeZone) return false;
      
      if (activeStatus !== 'All') {
        const statusMap = {
          'Active': 'active',
          'Alert': 'alert',
          'Low Bait': 'lowBait',
          'Offline': 'offline'
        };
        if (station.status !== statusMap[activeStatus]) return false;
      }
      
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        if (
          !station.id.toLowerCase().includes(q) &&
          !station.code.toLowerCase().includes(q) &&
          !station.location.toLowerCase().includes(q)
        ) return false;
      }
      
      return true;
    });
  }, [data?.stations, activeZone, activeStatus, searchQuery]);

  if (isLoading || !data) {
    return (
      <div className="p-6 animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 rounded w-1/3"></div>
        <div className="h-20 bg-gray-200 rounded w-full"></div>
        <div className="h-[500px] bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6">
      <PageHeader 
        totalStations={data.meta.totalStations} 
        totalZones={data.meta.totalZones} 
        view={view} 
        setView={setView} 
      />
      
      <FilterBar 
        zones={data.zones}
        activeZone={activeZone}
        setActiveZone={setActiveZone}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex flex-1 gap-0 min-h-[500px]">
        <FacilityMapCanvas 
          zones={data.zones}
          stations={filteredStations}
          selectedStation={selectedStation}
          onSelectStation={setSelectedStation}
        />
        
        {selectedStation && (
          <StationDetailPanel 
            station={selectedStation} 
            onClose={() => setSelectedStation(null)} 
          />
        )}
      </div>

      <ZoneSummaryBar zoneSummaries={data.zoneSummaries} />
    </div>
  );
}
