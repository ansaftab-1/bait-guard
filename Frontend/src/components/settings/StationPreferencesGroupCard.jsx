import React from 'react';
import { ChevronRight, Building, Map, Filter } from 'lucide-react';

export default function StationPreferencesGroupCard({ site, onChange: _onChange }) {
  const defaultFacility = site?.activeFacility || 'Warehouse A';
  const defaultView = site?.defaultView || 'Map';
  const defaultFilter = site?.defaultFilter || 'All Alerts';

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0]/80 p-5 shadow-[0_4px_16px_rgba(16,24,40,0.03)] mb-6">
      <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3 px-1">
        Station Preferences
      </h3>

      <div className="divide-y divide-[#f1f5f9]">
        {/* Default Facility */}
        <div
          onClick={() => alert('Change default facility')}
          className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#f8fafc] px-2 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#101828]">Default Facility</div>
              <div className="text-[11px] text-[#64748b] font-medium">Default location scope on login</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#334155]">
            <span>{defaultFacility}</span>
            <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
          </div>
        </div>

        {/* Default View */}
        <div
          onClick={() => alert('Change default view')}
          className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#f8fafc] px-2 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0">
              <Map className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#101828]">Default View</div>
              <div className="text-[11px] text-[#64748b] font-medium">Initial layout mode</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#334155]">
            <span>{defaultView}</span>
            <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
          </div>
        </div>

        {/* Default Alert Filter */}
        <div
          onClick={() => alert('Change default alert filter')}
          className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#f8fafc] px-2 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#101828]">Default Alert Filter</div>
              <div className="text-[11px] text-[#64748b] font-medium">Preset telemetry filter</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#334155]">
            <span>{defaultFilter}</span>
            <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
          </div>
        </div>
      </div>
    </div>
  );
}
