import React from 'react';
import { Calendar, ChevronDown, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../services/authService';

export default function ReportsHeader({ activeTimeframe, setActiveTimeframe }) {
  const { user } = useAuth();
  const isViewer = !user || user.role === ROLES.VIEWER || user.role === 'VIEWER';

  const timeframes = ['Week', 'Month', 'Quarter', 'Year'];

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-[28px] font-extrabold text-[#101828] tracking-tight">Reports</h1>
          {isViewer && (
            <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              Viewer Mode (Read-Only)
            </span>
          )}
        </div>
        <p className="text-[#64748b] text-sm mt-0.5 font-medium">Audits & compliance</p>
      </div>

      {/* Top Right Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Segmented Time Range Pill Selector */}
        <div className="bg-[#e2e8f0]/60 p-1 rounded-xl flex items-center gap-1">
          {timeframes.map((tf) => {
            const isActive = activeTimeframe === tf;
            return (
              <button
                key={tf}
                type="button"
                onClick={() => setActiveTimeframe && setActiveTimeframe(tf)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#101828] shadow-sm'
                    : 'text-[#64748b] hover:text-[#101828]'
                }`}
              >
                {tf}
              </button>
            );
          })}
        </div>

        {/* Month Dropdown Button */}
        <button
          type="button"
          className="bg-white border border-[#e2e8f0] px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#101828] flex items-center gap-2 hover:bg-[#f8fafc] shadow-sm transition-all cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-[#64748b]" />
          <span>Jun</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
        </button>
      </div>
    </div>
  );
}
