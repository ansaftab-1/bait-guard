import React from 'react';
import { Moon, RefreshCw, Clock } from 'lucide-react';

export default function DisplayGroupCard({ display, onChange }) {
  const handleToggle = (key) => {
    if (!onChange) return;
    onChange({
      ...display,
      [key]: !display[key],
    });
  };

  const handleSelectInterval = (val) => {
    if (!onChange) return;
    onChange({
      ...display,
      refreshInterval: val,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[#e4eaf3] p-4 shadow-sm mb-4">
      <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3 px-1">
        Display & Polling
      </h3>

      <div className="divide-y divide-[#e4eaf3]">
        {/* Dark Mode Toggle */}
        <div
          onClick={() => handleToggle('darkMode')}
          className="py-3 flex items-center justify-between gap-4 cursor-pointer group px-1"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f8fafc] group-hover:bg-[#eff6ff] text-[#64748b] group-hover:text-[#2563eb] flex items-center justify-center transition-colors shrink-0">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#16233a]">Dark mode</div>
              <div className="text-[11px] text-[#64748b] font-medium">
                Switch dashboard theme appearance
              </div>
            </div>
          </div>
          <button
            type="button"
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${display?.darkMode ? 'bg-[#2563eb]' : 'bg-[#cbd5e1]'
              }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${display?.darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
          </button>
        </div>

        {/* Auto Refresh Toggle */}
        <div
          onClick={() => handleToggle('autoRefresh')}
          className="py-3 flex items-center justify-between gap-4 cursor-pointer group px-1"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f8fafc] group-hover:bg-[#eff6ff] text-[#64748b] group-hover:text-[#2563eb] flex items-center justify-center transition-colors shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#16233a]">Auto refresh</div>
              <div className="text-[11px] text-[#64748b] font-medium">
                Automatically fetch live telemetry updates
              </div>
            </div>
          </div>
          <button
            type="button"
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${display?.autoRefresh ? 'bg-[#2563eb]' : 'bg-[#cbd5e1]'
              }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${display?.autoRefresh ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
          </button>
        </div>

        {/* Refresh Interval Dropdown */}
        <div className="py-3 flex items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#64748b] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#16233a]">Refresh interval</div>
              <div className="text-[11px] text-[#64748b] font-medium">
                Polling frequency for live data
              </div>
            </div>
          </div>

          <select
            value={display?.refreshInterval || '30s'}
            onChange={(e) => handleSelectInterval(e.target.value)}
            className="bg-[#f8fafc] border border-[#e4eaf3] text-[#16233a] text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#2563eb] cursor-pointer"
          >
            <option value="15s">15 seconds</option>
            <option value="30s">30 seconds</option>
            <option value="60s">60 seconds</option>
            <option value="5m">5 minutes</option>
          </select>
        </div>
      </div>
    </div>
  );
}
