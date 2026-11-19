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
        {/* Vibrant golden sticky note */}
        <div className="w-20 h-20 rounded-[180px_10px_160px_12px/12px_170px_10px_180px] border-[2.5px] border-[#191712] bg-[#ffd32a] shadow-[4px_5px_0_#191712] flex items-center justify-center animate-scribble">
          <Compass className="w-10 h-10 text-[#191712] animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Floating Vibrant Red Pushpin */}
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full border-2 border-[#191712] bg-[#eb4d4b] text-white flex items-center justify-center shadow-[2px_2px_0_#191712] animate-pin">
          <Pin className="w-4 h-4 fill-white" />
        </div>
      </div>

      {/* Main handwritten title */}
      <h3 className="font-hand font-bold text-3xl sm:text-4xl text-[#191712]">
        {message || 'Scanning Campus Pinboards...'}
      </h3>

      {/* Cycling relatable campus prompt */}
      <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-dashed border-[#191712]/40 bg-[#f2ead4] font-type text-xs text-[#5d5744]">
        <Search className="w-3.5 h-3.5 text-[#eb4d4b] animate-bounce" />
        <span className="font-type tracking-wide">{CAMPUS_SEARCH_PROMPTS[promptIndex]}</span>
      </div>
    </div>
  );
}
