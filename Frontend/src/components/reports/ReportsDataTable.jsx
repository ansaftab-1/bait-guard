import React, { useState } from 'react';
import { Search, Filter, Download, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../services/authService';

export default function ReportsDataTable({ rows }) {
  const { user } = useAuth();
  const isViewer = !user || user.role === ROLES.VIEWER || user.role === 'VIEWER';

  const [searchQuery, setSearchQuery] = useState('');

  const filteredRows = (rows || []).filter((row) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return row.id.toLowerCase().includes(q) || row.location.toLowerCase().includes(q);
  });

  const handleExportFiltered = () => {
    if (isViewer || !filteredRows.length) return;
    const headers = ['Station ID', 'Location', 'Detections', 'Refills', 'Uptime %'];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...filteredRows.map((r) => [r.id, `"${r.location}"`, r.detections, r.refills, `${r.uptime}%`].join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encodedUri;
    a.download = 'station_status_report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white rounded-xl border border-[#e4eaf3] shadow-sm flex flex-col overflow-hidden">
      {/* Controls Bar */}
      <div className="px-5 py-4 border-b border-[#e4eaf3] flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Station ID or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#e4eaf3] rounded-lg text-xs text-[#16233a] placeholder-[#94a3b8] focus:outline-none focus:border-[#2563eb]"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-[#e4eaf3] rounded-lg text-xs font-semibold text-[#64748b] hover:text-[#16233a] hover:bg-[#f8fafc] transition-colors cursor-pointer">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>

        {isViewer ? (
          <span className="text-xs font-semibold text-[#94a3b8] flex items-center gap-1.5 bg-[#f8fafc] px-3 py-1.5 rounded-lg border border-[#e2e8f0]">
            <Lock className="w-3.5 h-3.5 text-[#94a3b8]" />
            <span>Export View (Disabled for Viewer)</span>
          </span>
        ) : (
          <button
            onClick={handleExportFiltered}
            className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export View</span>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-[#e4eaf3] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
              <th className="py-3 px-5">Station ID</th>
              <th className="py-3 px-5">Location</th>
              <th className="py-3 px-5 text-center">Detections</th>
              <th className="py-3 px-5 text-center">Refills</th>
              <th className="py-3 px-5">System Uptime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e4eaf3] text-xs">
            {filteredRows.map((r) => (
              <tr key={r.id} className="hover:bg-[#f8fafc] transition-colors">
                <td className="py-3.5 px-5 font-bold text-[#16233a]">{r.id}</td>
                <td className="py-3.5 px-5 font-medium text-[#64748b]">{r.location}</td>
                <td className="py-3.5 px-5 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fef2f2] text-[#ef4444]">
                    {r.detections}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-center font-bold text-[#16233a]">
                  {r.refills}
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3 w-40">
                    <div className="flex-1 bg-[#e2e8f0] rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          r.uptime >= 99
                            ? 'bg-[#10b981]'
                            : r.uptime >= 97
                            ? 'bg-[#2563eb]'
                            : 'bg-[#f59e0b]'
                        }`}
                        style={{ width: `${r.uptime}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-[#16233a] w-10">
                      {r.uptime}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-[#64748b]">
                  No matching station records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
