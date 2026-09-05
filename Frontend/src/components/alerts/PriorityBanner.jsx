import React from 'react';
import { ArrowRight } from 'lucide-react';
import AnimatedLottieIcon from '../ui/AnimatedLottieIcon';

export default function PriorityBanner({ title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#fff1f2] border border-[#ffe4e6] rounded-2xl px-5 py-4 mb-6 flex items-center justify-between gap-4 shadow-sm hover:border-[#fecdd3] transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ffe4e6] flex items-center justify-center shrink-0">
          <AnimatedLottieIcon type="alert" size={40} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#e11d48] mb-0.5 m-0 leading-snug">{title}</h3>
          <p className="text-xs text-[#9f1239] font-medium m-0">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
        }}
        className="px-4 py-2 rounded-xl bg-[#f43f5e] hover:bg-[#e11d48] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm border-none"
      >
        <span>View All</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
