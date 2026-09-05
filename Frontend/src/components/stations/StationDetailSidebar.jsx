import { Droplets, Battery, Activity, ExternalLink, Video } from 'lucide-react';

export default function StationDetailSidebar({ station }) {
  if (!station) {
    return (
      <div className="w-[320px] bg-white rounded-xl border border-[#e4eaf3] p-6 text-center text-[#7b8aa1] text-sm shrink-0">
        Select a station to view details
      </div>
    );
  }

  const isAlert = station.status === 'critical';

  return (
    <div className="w-[320px] flex flex-col gap-4 shrink-0">
      {/* Top Card - Details & Live Feed */}
      <div className="bg-white rounded-xl border border-[#e4eaf3] p-5 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-[#16233a]">{station.code}</h2>
          <span
            className={`px-2.5 py-1 rounded text-xs font-bold ${
              isAlert ? 'bg-[#fdeceb] text-[#e2453f]' : 'bg-[#e8f0fc] text-[#1e5fc4]'
            }`}
          >
            {station.alertBadge || 'ALERT'}
          </span>
        </div>
        <p className="text-xs text-[#7b8aa1] mb-4 whitespace-pre-line leading-relaxed">
          {station.fullAddress || station.location}
        </p>

        {/* Live Camera Feed Preview */}
        <div className="relative bg-[#0f172a] rounded-lg h-36 flex flex-col items-center justify-center p-3 mb-4 overflow-hidden shadow-inner">
          {/* Live Tag */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            LIVE
          </div>

          {/* Camera Icon & Status Caption */}
          <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5">
            <Video className="w-6 h-6 text-slate-400" />
            <span className="text-[11px] font-medium text-slate-300">Night vision feed active</span>
          </div>

          {/* Detection Confidence Badge */}
          {station.aiConfidence && (
            <div className="absolute bottom-2.5 right-2.5 bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
              {station.aiConfidence}
            </div>
          )}
        </div>

        {/* 3 Mini Metric Tiles */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#fdf2df] border border-[#f0a52c]/20 rounded-lg p-2 flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-[#f0a52c] text-[11px] font-medium mb-0.5">
              <Droplets className="w-3 h-3" />
              <span>Bait</span>
            </div>
            <span className="text-sm font-bold text-[#16233a]">{station.baitPercent}%</span>
          </div>

          <div className="bg-[#e8f0fc] border border-[#1e5fc4]/20 rounded-lg p-2 flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-[#1e5fc4] text-[11px] font-medium mb-0.5">
              <Battery className="w-3 h-3" />
              <span>Battery</span>
            </div>
            <span className="text-sm font-bold text-[#16233a]">{station.batteryPercent}%</span>
          </div>

          <div className="bg-[#f2f6fb] border border-[#e4eaf3] rounded-lg p-2 flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-[#7b8aa1] text-[11px] font-medium mb-0.5">
              <Activity className="w-3 h-3" />
              <span>Detects</span>
            </div>
            <span className="text-sm font-bold text-[#16233a]">{station.detects}</span>
          </div>
        </div>

        {/* Key/Value Rows */}
        <div className="space-y-2 mb-5 text-xs">
          <div className="flex justify-between py-1.5 border-b border-[#e4eaf3]">
            <span className="text-[#7b8aa1]">Temperature</span>
            <span className="font-semibold text-[#16233a]">{station.temperature}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[#e4eaf3]">
            <span className="text-[#7b8aa1]">Humidity</span>
            <span className="font-semibold text-[#16233a]">{station.humidity}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[#7b8aa1]">Last Activity</span>
            <span className="font-semibold text-[#16233a]">{station.lastActivity}</span>
          </div>
        </div>

        {/* Outlined Action Button */}
        <button className="w-full bg-white border border-[#1e5fc4] text-[#1e5fc4] hover:bg-[#e8f0fc] font-semibold py-2.5 rounded-lg text-xs transition-colors cursor-pointer">
          View Detailed Log
        </button>
      </div>

      {/* Bottom Card - Floorplan Blueprint */}
      <div className="bg-white rounded-xl border border-[#e4eaf3] p-4 shadow-sm">
        <div className="relative bg-[#f0f4f8] rounded-lg h-32 border border-[#e4eaf3] overflow-hidden flex items-center justify-center mb-3">
          {/* Blueprint SVG overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Mock building walls */}
            <rect x="15%" y="15%" width="70%" height="70%" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
            <rect x="25%" y="25%" width="30%" height="40%" fill="none" stroke="#64748b" strokeWidth="1" />
            <rect x="60%" y="25%" width="20%" height="50%" fill="none" stroke="#64748b" strokeWidth="1" />
          </svg>

          {/* Station Pin */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10"
            style={{
              left: `${station.pinCoords?.x || 50}%`,
              top: `${station.pinCoords?.y || 50}%`,
            }}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 ring-4 ring-red-300/60 animate-ping absolute"></span>
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 ring-2 ring-white relative shadow-md"></span>
          </div>
        </div>

        {/* Caption & Link */}
        <div className="flex items-center justify-between text-xs text-[#7b8aa1]">
          <span className="font-medium text-[#16233a]">{station.floorplanName || 'Warehouse B Floorplan'}</span>
          <button className="flex items-center gap-1 text-[#1e5fc4] hover:underline cursor-pointer">
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
