import React from 'react';

export default function ErrorState({ onRetry, message = 'Something went wrong.' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-[#fdeceb] text-center shadow-sm">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-bold text-[#16233a] mb-2">Error Loading Data</h3>
      <p className="text-sm text-[#7b8aa1] mb-6">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-5 py-2.5 bg-[#1e5fc4] hover:bg-[#12377d] text-white rounded-lg font-medium text-sm transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
