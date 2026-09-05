import React from 'react';
import ZoneTag from './ZoneTag';
import StationMarker from './StationMarker';
import MapLegend from './MapLegend';

export default function FacilityMapCanvas({ zones, stations, selectedStation, onSelectStation }) {
  return (
    <div className="flex-1 bg-[#f0f4f8] rounded-xl relative overflow-hidden border border-[#e4eaf3] min-h-[500px]">
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'linear-gradient(to right, #d4dde8 1px, transparent 1px), linear-gradient(to bottom, #d4dde8 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Render Zone boundaries */}
      {zones.map(zone => (
        <div 
          key={zone.id}
          className="absolute pointer-events-none"
          style={{
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            width: `${zone.width}%`,
            height: `${zone.height}%`
          }}
        >
          <ZoneTag label={zone.label} />
        </div>
      ))}

      {/* Render Station markers */}
      {stations.map(station => (
        <StationMarker 
          key={station.id} 
          station={station} 
          isSelected={selectedStation?.id === station.id}
          onClick={() => onSelectStation(station)}
        />
      ))}

      <MapLegend />
    </div>
  );
}
