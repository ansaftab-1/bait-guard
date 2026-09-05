import React from 'react';

export default function ReportsStationLedger({ rows }) {
  if (!rows || !rows.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0]/80 p-6 shadow-[0_4px_16px_rgba(16,24,40,0.03)] h-full flex flex-col justify-between">
      <h3 className="text-base font-bold text-[#101828] mb-4">Station Ledger</h3>

      <div className="flex flex-col divide-y divide-[#f1f5f9]">
        {rows.map((row) => (
          <div
            key={row.id}
            className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
          >
            {/* Station ID & Location */}
            <div className="w-36">
              <div className="text-xs font-bold text-[#101828]">{row.id}</div>
              <div className="text-[11px] font-medium text-[#94a3b8]">{row.location}</div>
            </div>

            {/* Detections & Refills */}
            <div className="flex items-center gap-6 text-xs text-[#64748b]">
              <div>
                Detections: <strong className="text-[#101828] font-bold">{row.detections}</strong>
              </div>
              <div>
                Refills: <strong className="text-[#101828] font-bold">{row.refills}</strong>
              </div>
            </div>

            {/* Uptime Progress Bar & Percentage */}
            <div className="flex items-center gap-3 w-36 justify-end">
              <div className="w-20 bg-[#e2e8f0] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${row.uptimePercent}%`,
                    background: row.color || '#10b981',
                  }}
                />
              </div>
              <span
                className="text-xs font-extrabold min-w-[36px] text-right"
                style={{ color: row.color || '#10b981' }}
              >
                {row.uptimePercent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
