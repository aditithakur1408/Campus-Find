import React, { useState, useEffect } from 'react';
import { Compass, BookOpen, Search, Pin } from 'lucide-react';

const CAMPUS_SEARCH_PROMPTS = [
  'Checking under cafeteria dining benches...',
  'Searching the 2nd floor library silent study hall...',
  'Asking the guard at Academic Block A security desk...',
  'Inspecting sports complex locker rooms...',
  'Flipping through the student lost & found registry...',
  'Scanning computer lab tables in Block B...',
];

export default function SketchLoader({ message }) {
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % CAMPUS_SEARCH_PROMPTS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-20 flex flex-col items-center justify-center text-center select-none animate-in fade-in duration-300">
      {/* Sketched Animated Notebook / Pin doodle */}
      <div className="relative mb-5">
        {/* Archival amber note container */}
        <div className="w-16 h-16 rounded-2xl border-2 border-[#18181b] bg-[#fef3c7] shadow-[3px_3px_0_#18181b] flex items-center justify-center animate-scribble">
          <Compass className="w-8 h-8 text-[#18181b] animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Floating Crimson Pushpin */}
        <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full border-2 border-[#18181b] bg-[#b91c1c] text-white flex items-center justify-center shadow-[2px_2px_0_#18181b] animate-pin">
          <Pin className="w-3.5 h-3.5 fill-white" />
        </div>
      </div>

      {/* Main title */}
      <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#18181b]">
        {message || 'Scanning Campus Noticeboards...'}
      </h3>

      {/* Cycling relatable campus prompt */}
      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dashed border-[#18181b]/30 bg-[#f1ede4] font-type text-xs text-[#52525b]">
        <Search className="w-3.5 h-3.5 text-[#b91c1c] animate-bounce" />
        <span className="font-type tracking-wide">{CAMPUS_SEARCH_PROMPTS[promptIndex]}</span>
      </div>
    </div>
  );
}
