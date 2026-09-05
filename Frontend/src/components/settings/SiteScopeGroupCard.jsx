import React from 'react';
import { MapPin } from 'lucide-react';

export default function SiteScopeGroupCard({ site, onChange }) {
  const sites = site?.sites || [
    { id: 'all', label: 'All facilities' },
    { id: 'fac-1', label: 'Facility 1 — Warehouse' },
    { id: 'fac-2', label: 'Facility 2 — Admin Wing' },
  ];

  const handleChangeSite = (val) => {
    if (!onChange) return;
    onChange({
      ...site,
      activeSite: val,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[#e4eaf3] p-4 shadow-sm mb-4">
      <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3 px-1">
        Site Scope
      </h3>

      <div className="flex items-center justify-between gap-4 px-1 py-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#64748b] flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#16233a]">Active site scope</div>
            <div className="text-[11px] text-[#64748b] font-medium">
              Filter telemetry & alerts scope
            </div>
          </div>
        </div>

        <select
          value={site?.activeSite || 'all'}
          onChange={(e) => handleChangeSite(e.target.value)}
          className="bg-[#f8fafc] border border-[#e4eaf3] text-[#16233a] text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#2563eb] cursor-pointer"
        >
          {sites.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
