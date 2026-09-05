import React, { useState } from 'react';
import { Lock, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../services/authService';
import ExportReportModal from './ExportReportModal';

export default function ReportsExporterGrid({ exporters }) {
  const { user } = useAuth();
  const isViewer = !user || user.role === ROLES.VIEWER || user.role === 'VIEWER';
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleDownload = () => {
    if (isViewer) return;
    setIsExportModalOpen(true);
  };

  if (!exporters || !exporters.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0]/80 p-6 shadow-[0_4px_16px_rgba(16,24,40,0.03)] h-full flex flex-col">
      <h3 className="text-base font-bold text-[#101828] mb-5">Generate Report</h3>

      <div className="flex flex-col gap-3.5 flex-1 justify-between">
        {exporters.map((exp) => (
          <div
            key={exp.id}
            className="bg-white rounded-xl border border-[#e2e8f0] p-4 flex items-center justify-between gap-3 hover:border-[#2563eb]/40 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              {/* Square Rounded Icon Box */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs"
                style={{
                  background: exp.iconBg || '#eff6ff',
                  color: exp.iconColor || '#2563eb',
                }}
              >
                {exp.letter || 'D'}
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#101828] leading-tight">
                  {exp.title}
                </h4>
                <p className="text-[11px] font-medium text-[#94a3b8] mt-0.5">
                  {exp.subtitle}
                </p>
              </div>
            </div>

            {/* Format / Download Action Pill */}
            {isViewer ? (
              <span
                title="Viewer role: Read-only"
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#f1f5f9] text-[#94a3b8] flex items-center gap-1 cursor-not-allowed"
              >
                <Lock className="w-3 h-3" />
                {exp.format}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleDownload}
                className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{exp.format}</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
