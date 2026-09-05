import React from 'react';

export default function Chip({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
        isActive
          ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm'
          : 'bg-white text-[#64748b] border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#0f172a]'
      }`}
    >
      {label}
    </button>
  );
}
