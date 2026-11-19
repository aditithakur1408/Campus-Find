import React from 'react';
import { Pin, ShieldCheck, Clock } from 'lucide-react';

export default function StatsBar({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 my-8">
      {/* Note 1: Lost Items (Vibrant Coral Poppy) */}
      <div className="sticky-note bg-[#ff7979] hover:bg-[#ff5252] p-5 rounded-[180px_10px_160px_12px/12px_170px_10px_180px] transform -rotate-1 hover:rotate-0 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-[4px_5px_0_#191712] hover:shadow-[6px_8px_0_#191712] select-none group border-[2.5px] border-[#191712]">
        <div className="flex items-center justify-between text-[#191712]">
          <span className="font-type text-xs uppercase tracking-wider font-bold">
            LOST NOTICES
          </span>
          <Pin className="w-4 h-4 text-[#191712] group-hover:rotate-12 transition-transform" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="font-hand font-bold text-5xl sm:text-6xl text-[#191712] leading-none">
            {stats.totalLost ?? 0}
          </strong>
          <span className="font-neat text-lg text-[#191712]/90 font-bold">items missing</span>
        </div>
      </div>

      {/* Note 2: Found Items (Vibrant Golden Sun) */}
      <div className="sticky-note bg-[#ffd32a] hover:bg-[#ffa801] p-5 rounded-[180px_10px_160px_12px/12px_170px_10px_180px] transform rotate-1 hover:rotate-0 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-[4px_5px_0_#191712] hover:shadow-[6px_8px_0_#191712] select-none group border-[2.5px] border-[#191712]">
        <div className="flex items-center justify-between text-[#191712]">
          <span className="font-type text-xs uppercase tracking-wider font-bold">
            FOUND NOTICES
          </span>
          <Pin className="w-4 h-4 text-[#191712] group-hover:rotate-12 transition-transform" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="font-hand font-bold text-5xl sm:text-6xl text-[#191712] leading-none">
            {stats.totalFound ?? 0}
          </strong>
          <span className="font-neat text-lg text-[#191712]/90 font-bold">spotted safe</span>
        </div>
      </div>

      {/* Note 3: Returned / Handed Over (Vibrant Emerald Mint) */}
      <div className="sticky-note bg-[#2ed573] hover:bg-[#0be881] p-5 rounded-[180px_10px_160px_12px/12px_170px_10px_180px] transform -rotate-1.5 hover:rotate-0 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-[4px_5px_0_#191712] hover:shadow-[6px_8px_0_#191712] select-none group border-[2.5px] border-[#191712]">
        <div className="flex items-center justify-between text-[#191712]">
          <span className="font-type text-xs uppercase tracking-wider font-bold">
            HANDED OVER
          </span>
          <ShieldCheck className="w-4 h-4 text-[#191712] group-hover:scale-110 transition-transform" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="font-hand font-bold text-5xl sm:text-6xl text-[#191712] leading-none">
            {stats.resolvedItems ?? 0}
          </strong>
          <span className="font-neat text-lg text-[#191712]/90 font-bold">reunited ({stats.recoveryRate}%)</span>
        </div>
      </div>

      {/* Note 4: Active Claims (Vibrant Azure Sky) */}
      <div className="sticky-note bg-[#70a1ff] hover:bg-[#1e90ff] p-5 rounded-[180px_10px_160px_12px/12px_170px_10px_180px] transform rotate-1.5 hover:rotate-0 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer shadow-[4px_5px_0_#191712] hover:shadow-[6px_8px_0_#191712] select-none group border-[2.5px] border-[#191712]">
        <div className="flex items-center justify-between text-[#191712]">
          <span className="font-type text-xs uppercase tracking-wider font-bold">
            PROOF CLAIMS
          </span>
          <Clock className="w-4 h-4 text-[#191712] group-hover:rotate-45 transition-transform" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <strong className="font-hand font-bold text-5xl sm:text-6xl text-[#191712] leading-none">
            {stats.pendingClaims ?? 0}
          </strong>
          <span className="font-neat text-lg text-[#191712]/90 font-bold">under review</span>
        </div>
      </div>
    </div>
  );
}
