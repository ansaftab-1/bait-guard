import React from 'react';

export default function CategoryBreakdownWidget({ categories }) {
  const items = categories || [
    { id: 'rodent', label: 'Rodent detections', count: 14, color: '#e2453f', max: 14 },
    { id: 'lowBait', label: 'Low bait warnings', count: 8, color: '#f0a52c', max: 14 },
    { id: 'tamper', label: 'Tamper alerts', count: 3, color: '#fb7185', max: 14 },
    { id: 'offline', label: 'Offline events', count: 2, color: '#38bdf8', max: 14 },
  ];

  const maxVal = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="bg-white rounded-xl border border-[#e4eaf3] p-5 shadow-sm">
      <h3 className="text-base font-bold text-[#16233a] mb-4">This week by type</h3>

      <div className="space-y-4">
        {items.map((item) => {
          const percent = (item.count / maxVal) * 100;
          return (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#16233a]">{item.label}</span>
                <span className="text-sm font-bold text-[#7b8aa1]">{item.count}</span>
              </div>
              <div className="w-full bg-[#f2f6fb] rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: item.color || '#1e5fc4',
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
