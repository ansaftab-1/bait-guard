import React from 'react';

export default function ZoneTag({ label }) {
  return (
    <div className="inline-block bg-[#1e5fc4] text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm uppercase tracking-wider m-2">
      {label}
    </div>
  );
}
