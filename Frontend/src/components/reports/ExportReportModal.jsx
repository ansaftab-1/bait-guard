import React, { useState } from 'react';
import { X, Check, FileText, ChevronDown, Download, CheckCircle2 } from 'lucide-react';
import DownloadSuccessModal from './DownloadSuccessModal';

export default function ExportReportModal({ isOpen, onClose }) {
  const [step, setStep] = useState('config'); // 'config' | 'complete'
  const [fileFormat, setFileFormat] = useState('pdf'); // 'pdf' | 'csv'
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [sections, setSections] = useState({
    detectionSummary: true,
    stationMetrics: true,
    speciesBreakdown: true,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState('');

  if (!isOpen && !showSuccessOverlay) return null;

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportNow = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsExporting(false);
    setStep('complete');
  };

  const handleDownloadFile = () => {
    const isPdf = fileFormat === 'pdf';
    const fileName = isPdf ? 'Monthly_Activity_June2026.pdf' : 'Monthly_Activity_June2026.csv';
    const mimeType = isPdf ? 'application/pdf' : 'text/csv';

    const content = isPdf
      ? `%PDF-1.4\n% RatGuard AI Automated Facility Report\nDate Range: ${dateRange}\nFormat: PDF Document\nSections: ${Object.keys(sections).filter(k => sections[k]).join(', ')}\nStatus: Certified Compliant`
      : `Station,Facility,Zone,Detections,Status,Date\nRB-01,Warehouse A,Zone A,3,Healthy,Jun 2026\nRB-07,Warehouse B,Zone A,22,Alert,Jun 2026\n`;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadedFileName(fileName);
    setShowSuccessOverlay(true);
    onClose();
  };

  const handleClose = () => {
    setStep('config');
    setFileFormat('pdf');
    setIsExporting(false);
    onClose();
  };

  if (showSuccessOverlay) {
    return (
      <DownloadSuccessModal
        isOpen={showSuccessOverlay}
        onClose={() => {
          setShowSuccessOverlay(false);
          setStep('config');
        }}
        fileName={downloadedFileName}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Blurred Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[4px] transition-all animate-fadeIn"
      />

      {/* Modal Container Card */}
      <div className="relative bg-white rounded-3xl border border-[#e2e8f0] shadow-2xl w-full max-w-md p-7 z-10 transition-all font-sans animate-scaleIn">
        {/* Close X Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 text-[#94a3b8] hover:text-[#101828] p-1 rounded-full hover:bg-[#f1f5f9] transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* ─── STEP 1: CONFIGURATION (export-confirmation) ─── */}
        {step === 'config' && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-extrabold text-[#101828]">Export Report</h2>
              <p className="text-xs font-medium text-[#64748b] mt-1">
                Configure report parameters and format below
              </p>
            </div>

            {/* File Format Segmented Pills */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#374151]">File Format</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFileFormat('pdf')}
                  className={`h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    fileFormat === 'pdf'
                      ? 'border-2 border-[#2563eb] bg-[#eff6ff] text-[#2563eb]'
                      : 'border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f8fafc]'
                  }`}
                >
                  PDF Document
                </button>

                <button
                  type="button"
                  onClick={() => setFileFormat('csv')}
                  className={`h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    fileFormat === 'csv'
                      ? 'border-2 border-[#2563eb] bg-[#eff6ff] text-[#2563eb]'
                      : 'border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f8fafc]'
                  }`}
                >
                  CSV Spreadsheet
                </button>
              </div>
            </div>

            {/* Date Range Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#374151]">Date Range</label>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full h-11 px-3.5 pr-8 rounded-xl border border-[#e2e8f0] text-xs font-bold text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] appearance-none cursor-pointer"
                >
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 90 Days">Last 90 Days</option>
                  <option value="Year to Date">Year to Date</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none" />
              </div>
            </div>

            {/* Include Sections Checkboxes */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#374151]">Include Sections</label>
              <div className="flex flex-col gap-2.5">
                {[
                  { key: 'detectionSummary', label: 'Detection summary' },
                  { key: 'stationMetrics', label: 'Station metrics' },
                  { key: 'speciesBreakdown', label: 'Species breakdown' },
                ].map((sec) => (
                  <label
                    key={sec.key}
                    className="flex items-center gap-2.5 text-xs font-bold text-[#101828] cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={sections[sec.key]}
                      onChange={() => toggleSection(sec.key)}
                      className="w-4 h-4 rounded accent-[#2563eb] cursor-pointer"
                    />
                    <span>{sec.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleExportNow}
                disabled={isExporting}
                className="flex-1 h-11 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-blue-200"
              >
                {isExporting ? 'Generating Report...' : 'Export Now'}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="flex-1 h-11 rounded-xl border border-[#e2e8f0] bg-white text-[#475569] text-xs font-bold hover:bg-[#f8fafc] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: RESULT / COMPLETE (export-result) ─── */}
        {step === 'complete' && (
          <div className="flex flex-col items-center text-center gap-5 py-2">
            {/* Green Check Circle */}
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-500 flex items-center justify-center shadow-sm">
              <Check size={28} strokeWidth={2.5} />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#101828]">Export Complete</h2>
              <p className="text-xs font-medium text-[#64748b] mt-1 max-w-[260px] mx-auto">
                Your custom facility report has been generated successfully.
              </p>
            </div>

            {/* File Badge Card */}
            <div className="w-full p-3.5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center gap-2.5 text-xs font-bold text-[#101828]">
              <FileText size={18} className="text-[#2563eb] shrink-0" />
              <span>
                Monthly_Activity_June2026.{fileFormat} · {fileFormat === 'pdf' ? '2.4 MB' : '420 KB'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleDownloadFile}
                className="w-full h-11 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] transition-all cursor-pointer shadow-md shadow-blue-200 flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download Report
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] transition-colors cursor-pointer py-1"
              >
                View in Reports History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
