import React from 'react';
import { ChevronRight, Info, ShieldCheck, FileText } from 'lucide-react';

export default function AboutGroupCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0]/80 p-5 shadow-[0_4px_16px_rgba(16,24,40,0.03)] mb-6">
      <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3 px-1">
        About & Legal
      </h3>

      <div className="divide-y divide-[#f1f5f9]">
        {/* App Version & Up to date status */}
        <div className="py-3 flex items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#334155] flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-[#2563eb]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#101828]">RatGuard AI Console</div>
              <div className="text-[11px] text-[#64748b] font-medium">Version v1.4.2 (Production)</div>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Up to date
          </span>
        </div>

        {/* Privacy Policy */}
        <div
          onClick={() => alert('Opening Privacy Policy...')}
          className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#f8fafc] px-2 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#334155] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#64748b]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#101828]">Privacy Policy</div>
              <div className="text-[11px] text-[#64748b] font-medium">Enterprise telemetry data handling policy</div>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
        </div>

        {/* Terms & Conditions */}
        <div
          onClick={() => alert('Opening Terms & Conditions...')}
          className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#f8fafc] px-2 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#334155] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-[#64748b]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#101828]">Terms & Conditions</div>
              <div className="text-[11px] text-[#64748b] font-medium">Service usage agreement</div>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
        </div>
      </div>
    </div>
  );
}
