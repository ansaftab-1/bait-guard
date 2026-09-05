import React from 'react';
import { X, Battery, Droplets, ArrowRight, Info } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function StationDetailPanel({ station, onClose }) {
  if (!station) return null;

  const baitPercent = station.baitPercent ?? 0;
  const batteryPercent = station.battery ?? 0;

  // Battery color
  let batteryColor = '#25b26b'; // green
  if (batteryPercent < 30) batteryColor = '#f0a52c';
  if (batteryPercent < 15) batteryColor = '#e2453f';

  // Bait color
  let baitColor = '#25b26b';
  if (baitPercent < 30) baitColor = '#f0a52c';
  if (baitPercent < 10) baitColor = '#e2453f';

  // Callout message based on status
  const calloutMessages = {
    alert: 'Technician dispatch recommended within 24 hours to clear station and replenish bait.',
    lowBait: 'Bait level is critically low. Schedule a refill soon to maintain coverage.',
  };

  const calloutMessage = station.calloutMessage || calloutMessages[station.status] || null;

  return (
    <div className="w-[300px] bg-white border border-[#e4eaf3] p-5 flex flex-col shrink-0 overflow-y-auto rounded-r-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-xl font-bold text-[#16233a]">{station.code}</h2>
        <div className="flex items-center gap-2">
          <StatusBadge status={station.status} />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close detail panel"
              className="p-1 text-[#7b8aa1] hover:text-[#16233a] rounded-lg transition-colors cursor-pointer border-none bg-transparent"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-[#7b8aa1] mb-5 leading-relaxed">{station.location}</p>

      {/* Battery Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-sm text-[#7b8aa1]">
            <Battery className="w-3.5 h-3.5" />
            <span>Battery Level</span>
          </div>
          <span className="text-sm font-bold" style={{ color: batteryColor }}>{batteryPercent}%</span>
        </div>
        <div className="w-full bg-[#e4eaf3] rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${batteryPercent}%`, backgroundColor: batteryColor }}
          ></div>
        </div>
      </div>

      {/* Bait Quantity */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-sm text-[#7b8aa1]">
            <Droplets className="w-3.5 h-3.5" />
            <span>Bait Quantity</span>
          </div>
          <span className="text-sm font-bold" style={{ color: baitColor }}>{baitPercent}%</span>
        </div>
        <div className="w-full bg-[#e4eaf3] rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${baitPercent}%`, backgroundColor: baitColor }}
          ></div>
        </div>
      </div>

      {/* Detail Rows */}
      <div className="space-y-0 mb-5">
        <div className="flex justify-between items-center py-2.5 border-b border-[#e4eaf3]">
          <span className="text-sm text-[#7b8aa1]">Current Status</span>
          <span className="text-sm font-bold text-[#16233a]">{station.currentStatus}</span>
        </div>
        <div className="flex justify-between items-center py-2.5 border-b border-[#e4eaf3]">
          <span className="text-sm text-[#7b8aa1]">Last Detection</span>
          <span className="text-sm font-medium text-[#16233a]">{station.lastDetection}</span>
        </div>
        <div className="flex justify-between items-center py-2.5">
          <span className="text-sm text-[#7b8aa1]">Last Refill</span>
          <span className="text-sm font-medium text-[#16233a]">{station.lastRefill}</span>
        </div>
      </div>

      {/* Callout */}
      {calloutMessage && (
        <div className="bg-[#f2f6fb] border border-[#e4eaf3] rounded-lg p-3.5 flex items-start gap-2.5 mb-5">
          <Info className="w-4 h-4 text-[#7b8aa1] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-[#7b8aa1] leading-relaxed">{calloutMessage}</p>
        </div>
      )}

      {/* CTA Button */}
      <div className="mt-auto pt-2">
        <button className="w-full bg-[#1e5fc4] hover:bg-[#12377d] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
          View full station details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
