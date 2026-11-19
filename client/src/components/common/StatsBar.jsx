import React from 'react';
import { Pin, ShieldCheck, Clock } from 'lucide-react';

export default function StatsBar({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
      {/* Note 1: Lost Items (Terracotta Crimson Archive) */}
      <div className="sticky-note bg-[#fef2f2] hover:bg-[#fee2e2] p-5 rounded-2xl border-2 border-[#18181b] transition-all duration-200 cursor-pointer shadow-[3px_3px_0_#18181b] hover:shadow-[4px_5px_0_#18181b] hover:-translate-y-0.5 select-none group">
        <div className="flex items-center justify-between">
          <span className="font-type text-xs text-[#991b1b] uppercase tracking-wider font-bold">
            LOST NOTICES
          </span>
          <div className="w-6 h-6 rounded-md bg-[#fee2e2] border border-[#f87171] flex items-center justify-center">
            <Pin className="w-3.5 h-3.5 text-[#dc2626]" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="font-display font-extrabold text-4xl sm:text-5xl text-[#18181b] leading-none">
            {stats.totalLost ?? 0}
          </strong>
          <span className="font-sans text-sm text-[#71717a]">items missing</span>
        </div>
      </div>

      {/* Note 2: Found Items (Warm Amber Archive) */}
      <div className="sticky-note bg-[#fffbeb] hover:bg-[#fef3c7] p-5 rounded-2xl border-2 border-[#18181b] transition-all duration-200 cursor-pointer shadow-[3px_3px_0_#18181b] hover:shadow-[4px_5px_0_#18181b] hover:-translate-y-0.5 select-none group">
        <div className="flex items-center justify-between">
          <span className="font-type text-xs text-[#92400e] uppercase tracking-wider font-bold">
            FOUND NOTICES
          </span>
          <div className="w-6 h-6 rounded-md bg-[#fef3c7] border border-[#fbbf24] flex items-center justify-center">
            <Pin className="w-3.5 h-3.5 text-[#d97706]" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="font-display font-extrabold text-4xl sm:text-5xl text-[#18181b] leading-none">
            {stats.totalFound ?? 0}
          </strong>
          <span className="font-sans text-sm text-[#71717a]">spotted safe</span>
        </div>
      </div>

      {/* Note 3: Returned / Handed Over (Botanical Sage Archive) */}
      <div className="sticky-note bg-[#f0fdf4] hover:bg-[#dcfce7] p-5 rounded-2xl border-2 border-[#18181b] transition-all duration-200 cursor-pointer shadow-[3px_3px_0_#18181b] hover:shadow-[4px_5px_0_#18181b] hover:-translate-y-0.5 select-none group">
        <div className="flex items-center justify-between">
          <span className="font-type text-xs text-[#166534] uppercase tracking-wider font-bold">
            HANDED OVER
          </span>
          <div className="w-6 h-6 rounded-md bg-[#dcfce7] border border-[#4ade80] flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="font-display font-extrabold text-4xl sm:text-5xl text-[#18181b] leading-none">
            {stats.resolvedItems ?? 0}
          </strong>
          <span className="font-sans text-sm text-[#71717a]">reunited ({stats.recoveryRate}%)</span>
        </div>
      </div>

      {/* Note 4: Active Claims (Oxford Slate Archive) */}
      <div className="sticky-note bg-[#eef2ff] hover:bg-[#e0e7ff] p-5 rounded-2xl border-2 border-[#18181b] transition-all duration-200 cursor-pointer shadow-[3px_3px_0_#18181b] hover:shadow-[4px_5px_0_#18181b] hover:-translate-y-0.5 select-none group">
        <div className="flex items-center justify-between">
          <span className="font-type text-xs text-[#3730a3] uppercase tracking-wider font-bold">
            PROOF CLAIMS
          </span>
          <div className="w-6 h-6 rounded-md bg-[#e0e7ff] border border-[#818cf8] flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-[#4f46e5]" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="font-display font-extrabold text-4xl sm:text-5xl text-[#18181b] leading-none">
            {stats.pendingClaims ?? 0}
          </strong>
          <span className="font-sans text-sm text-[#71717a]">under review</span>
        </div>
      </div>
    </div>
  );
}
