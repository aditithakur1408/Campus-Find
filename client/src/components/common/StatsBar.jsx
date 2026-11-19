import React from 'react';
import { Pin, ShieldCheck, Clock } from 'lucide-react';

export default function StatsBar({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 my-10">
      {/* Note 1: Lost Items (Pink -> Morphs to Yellow on hover) */}
      <div className="sticky-note bg-[#ffc9dc] hover:bg-[#ffe45e] p-5 rounded-[180px_10px_160px_12px/12px_170px_10px_180px] transform -rotate-1 hover:rotate-0 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-[3px_4px_0_#191712] hover:shadow-[5px_7px_0_#191712] select-none group">
        <div className="flex items-center justify-between text-[#191712]">
          <span className="font-type text-xs text-[#d9584d] group-hover:text-[#191712] uppercase tracking-wider font-bold transition-colors">
            LOST NOTICES
          </span>
          <Pin className="w-4 h-4 text-[#d9584d] group-hover:rotate-12 transition-transform" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="font-hand font-bold text-5xl text-[#191712] leading-none">
            {stats.totalLost ?? 0}
          </strong>
          <span className="font-neat text-base text-[#5d5744]">items missing</span>
        </div>
      </div>

      {/* Note 2: Found Items (Yellow -> Morphs to Mint on hover) */}
      <div className="sticky-note bg-[#ffe45e] hover:bg-[#b8ecd0] p-5 rounded-[180px_10px_160px_12px/12px_170px_10px_180px] transform rotate-1 hover:rotate-0 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-[3px_4px_0_#191712] hover:shadow-[5px_7px_0_#191712] select-none group">
        <div className="flex items-center justify-between text-[#191712]">
          <span className="font-type text-xs text-[#5d5744] group-hover:text-[#191712] uppercase tracking-wider font-bold transition-colors">
            FOUND NOTICES
          </span>
          <Pin className="w-4 h-4 text-[#191712] group-hover:rotate-12 transition-transform" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="font-hand font-bold text-5xl text-[#191712] leading-none">
            {stats.totalFound ?? 0}
          </strong>
          <span className="font-neat text-base text-[#5d5744]">spotted safe</span>
        </div>
      </div>

      {/* Note 3: Returned / Handed Over (Mint -> Morphs to Sky Blue on hover) */}
      <div className="sticky-note bg-[#b8ecd0] hover:bg-[#c2e5f7] p-5 rounded-[180px_10px_160px_12px/12px_170px_10px_180px] transform -rotate-1.5 hover:rotate-0 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-[3px_4px_0_#191712] hover:shadow-[5px_7px_0_#191712] select-none group">
        <div className="flex items-center justify-between text-[#191712]">
          <span className="font-type text-xs text-[#2f6f46] group-hover:text-[#0157a0] uppercase tracking-wider font-bold transition-colors">
            HANDED OVER
          </span>
          <ShieldCheck className="w-4 h-4 text-[#2f6f46] group-hover:scale-110 transition-transform" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="font-hand font-bold text-5xl text-[#191712] leading-none">
            {stats.resolvedItems ?? 0}
          </strong>
          <span className="font-neat text-base text-[#5d5744]">reunited ({stats.recoveryRate}%)</span>
        </div>
      </div>

      {/* Note 4: Active Claims (Blue -> Morphs to Pink on hover) */}
      <div className="sticky-note bg-[#c2e5f7] hover:bg-[#ffc9dc] p-5 rounded-[180px_10px_160px_12px/12px_170px_10px_180px] transform rotate-1.5 hover:rotate-0 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-[3px_4px_0_#191712] hover:shadow-[5px_7px_0_#191712] select-none group">
        <div className="flex items-center justify-between text-[#191712]">
          <span className="font-type text-xs text-[#0157a0] group-hover:text-[#d9584d] uppercase tracking-wider font-bold transition-colors">
            PROOF CLAIMS
          </span>
          <Clock className="w-4 h-4 text-[#0157a0] group-hover:rotate-45 transition-transform" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="font-hand font-bold text-5xl text-[#191712] leading-none">
            {stats.pendingClaims ?? 0}
          </strong>
          <span className="font-neat text-base text-[#5d5744]">under review</span>
        </div>
      </div>
    </div>
  );
}
