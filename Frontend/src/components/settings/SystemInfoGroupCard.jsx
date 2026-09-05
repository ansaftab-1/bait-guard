import React from 'react';
import { Info, Monitor, RefreshCcw } from 'lucide-react';

export default function SystemInfoGroupCard({ system, lastSaved }) {
  const syncTime = lastSaved || system?.lastSync || 'Just now';

  return (
    <div className="bg-white rounded-xl border border-[#e4eaf3] p-4 shadow-sm mb-4">
      <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3 px-1">
        System Read-Only Info
      </h3>

      <div className="space-y-2.5 text-xs px-1">
        <div className="flex items-center justify-between py-1.5 border-b border-[#e4eaf3]">
          <div className="flex items-center gap-2 text-[#64748b]">
            <Info className="w-3.5 h-3.5" />
            <span>App version</span>
          </div>
          <span className="font-bold text-[#16233a]">{system?.version || 'v1.4.2'}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-[#e4eaf3]">
          <div className="flex items-center gap-2 text-[#64748b]">
            <Monitor className="w-3.5 h-3.5" />
            <span>Device / Browser</span>
          </div>
          <span className="font-semibold text-[#16233a]">
            {system?.deviceBrowser || 'Chrome / Windows'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2 text-[#64748b]">
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Last sync</span>
          </div>
          <span className="font-semibold text-[#059669]">{syncTime}</span>
        </div>
      </div>
    </div>
  );
}
