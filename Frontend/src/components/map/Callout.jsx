import React from 'react';
import { Info } from 'lucide-react';

export default function Callout({ message }) {
  return (
    <div className="bg-[#e8f0fc] border border-[#c9dcf7] rounded-lg p-3 flex items-start gap-2.5 mt-4">
      <Info className="w-4 h-4 text-[#1e5fc4] mt-0.5 flex-shrink-0" />
      <p className="text-sm text-[#12377d]">{message}</p>
    </div>
  );
}
