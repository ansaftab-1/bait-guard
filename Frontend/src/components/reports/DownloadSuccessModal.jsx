import React, { useEffect } from 'react';
import { FileText, CheckCircle2, X } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

/**
 * DownloadSuccessModal Component
 * Renders an enlarged, borderless Lottie celebration animation directly over the Reports page.
 * The Reports page remains clearly visible in the background with a soft transparent overlay.
 * Lottie URL: https://lottie.host/140394f7-1ec1-4176-9c50-42a34432439c/JBM2uncYNF.lottie
 */
export default function DownloadSuccessModal({ isOpen, onClose, fileName = 'Monthly_Activity_June2026.pdf' }) {
  // Auto-dismiss floating overlay after 4 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Light Transparent Backdrop so background Reports Page is CLEARLY VISIBLE */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/25 backdrop-blur-[2px] transition-all animate-fadeIn"
      />

      {/* Transparent Floating Animation & Sleek Pill Badge (NO solid white box) */}
      <div className="relative z-10 flex flex-col items-center justify-center animate-scaleIn pointer-events-none select-none">
        {/* Close Button top-right floating */}
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto absolute -top-8 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg"
          title="Close animation"
        >
          <X size={18} />
        </button>

        {/* ─── ENLARGED Lottie Animation Player (340px x 340px) ─── */}
        <div className="w-[320px] sm:w-[360px] h-[320px] sm:h-[360px] flex items-center justify-center filter drop-shadow-2xl">
          <DotLottieReact
            src="https://lottie.host/140394f7-1ec1-4176-9c50-42a34432439c/JBM2uncYNF.lottie"
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Floating Glassmorphism Status Badge below animation */}
        <div
          onClick={onClose}
          className="pointer-events-auto mt-2 px-5 py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-[0_12px_32px_rgba(16,24,40,0.18)] flex items-center gap-3 cursor-pointer hover:bg-white transition-all transform hover:-translate-y-0.5"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-[#101828]">Download Complete!</div>
            <div className="text-[11px] font-semibold text-[#64748b] flex items-center gap-1 mt-0.5">
              <FileText size={12} className="text-[#2563eb]" />
              <span className="truncate max-w-[220px]">{fileName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
