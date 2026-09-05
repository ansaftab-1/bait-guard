import React from 'react';

export default function OverviewSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
      
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-48 bg-gray-200 rounded-xl"></div>
        <div className="h-48 bg-gray-200 rounded-xl"></div>
      </div>
      
      <div className="h-16 bg-gray-200 rounded-xl"></div>
      
      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        <div className="h-64 bg-gray-200 rounded-xl"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
      
      <div className="h-48 bg-gray-200 rounded-xl"></div>
    </div>
  );
}
