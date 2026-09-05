import React from 'react';
import AlertRow from './AlertRow';

export default function AlertGroup({ title, items, onSelectAlert }) {
  if (!items || items.length === 0) return null;

  const isEarlier = title.toLowerCase().includes('earlier');

  return (
    <div className="mb-6">
      {/* Group Title */}
      <h2 className="text-sm font-bold text-[#0f172a] mb-3.5 m-0">
        {title}
      </h2>

      {/* Alert Rows */}
      {isEarlier ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] divide-y divide-[#f1f5f9] overflow-hidden shadow-sm">
          {items.map((alert) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              isCard={false}
              onClick={() => onSelectAlert && onSelectAlert(alert)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((alert) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              isCard={true}
              onClick={() => onSelectAlert && onSelectAlert(alert)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
