import React from 'react';

export default function StatusBadge({ status }) {
  const badgeProps = {
    active: { label: 'Active', bg: 'bg-[#e5f7ed]', text: 'text-[#25b26b]' },
    alert: { label: 'Rodent Detected', bg: 'bg-[#fdeceb]', text: 'text-[#e2453f]' },
    lowBait: { label: 'Low Bait', bg: 'bg-[#fdf2df]', text: 'text-[#f0a52c]' },
    offline: { label: 'Offline', bg: 'bg-[#eef2f7]', text: 'text-[#9fb0c4]' },
  };

  const props = badgeProps[status] || badgeProps.offline;

  return (
    <div className={`px-2.5 py-1 rounded text-xs font-bold ${props.bg} ${props.text}`}>
      {props.label}
    </div>
  );
}
