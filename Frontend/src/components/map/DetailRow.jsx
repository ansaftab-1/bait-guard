import React from 'react';

export default function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-[#e4eaf3] last:border-0">
      <span className="text-sm text-[#7b8aa1]">{label}</span>
      <span className="text-sm font-medium text-[#16233a]">{value}</span>
    </div>
  );
}
