import React from 'react';

export default function ReportsKPIGrid({ kpis }) {
  if (!kpis || !kpis.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-white rounded-2xl border border-[#e2e8f0]/80 p-5 shadow-[0_4px_16px_rgba(16,24,40,0.03)] flex flex-col justify-between"
        >
          {/* Top Row: Label & Change Badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-[#64748b]">{kpi.label}</span>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: kpi.badgeBg || '#ecfdf5',
                color: kpi.badgeColor || '#10b981',
              }}
            >
              {kpi.change}
            </span>
          </div>

          {/* Bottom Row: Big Value */}
          <div
            className="text-[28px] font-extrabold tracking-tight"
            style={{ color: kpi.color || '#101828' }}
          >
            {kpi.value}
          </div>
        </div>
      ))}
    </div>
  );
}
