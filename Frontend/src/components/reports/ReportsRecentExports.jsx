import React, { useState } from 'react';
import { Download } from 'lucide-react';
import DownloadSuccessModal from './DownloadSuccessModal';

export default function ReportsRecentExports({ items, onSeeAll }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  if (!items || !items.length) return null;

  const handleReDownload = (item) => {
    const fileName = `${item.title.replace(/\s+/g, '_')}.pdf`;
    const content = `%PDF-1.4\n% RatGuard AI Export File: ${item.title}\nSubtitle: ${item.subtitle}\nStatus: Completed`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSelectedFile(fileName);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0]/80 p-6 shadow-[0_4px_16px_rgba(16,24,40,0.03)] h-full flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-base font-bold text-[#101828]">Recent Exports</h3>
        <button
          type="button"
          onClick={onSeeAll}
          className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] cursor-pointer"
        >
          See All
        </button>
      </div>

      {/* Item List */}
      <div className="flex flex-col gap-3.5 flex-1 justify-between">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#f8fafc] transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Square Rounded Icon Box */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs"
                style={{
                  background: item.iconBg || '#eff6ff',
                  color: item.iconColor || '#2563eb',
                }}
              >
                {item.letter || 'D'}
              </div>

              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#101828] leading-tight truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] font-medium text-[#94a3b8] mt-0.5 truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleReDownload(item)}
              className="p-2 rounded-lg bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe] transition-colors cursor-pointer shrink-0"
              title="Download File"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <DownloadSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        fileName={selectedFile || 'Monthly_Activity_June2026.pdf'}
      />
    </div>
  );
}
