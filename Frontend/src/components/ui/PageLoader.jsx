import React from 'react';

export default function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page contents"
      className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3 p-8"
    >
      <div className="w-10 h-10 border-3 border-[#2563eb]/20 border-t-[#2563eb] rounded-full animate-spin" />
      <span className="text-xs font-semibold text-[#64748b]">Loading dashboard...</span>
    </div>
  );
}
