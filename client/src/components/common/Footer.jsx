import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t-[2.5px] border-[#191712] bg-[#f2ead4]/80 py-6 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p className="font-neat text-base text-[#5d5744]">
          © 2026 CampusFind — Campus Lost and Found Recovery Platform.
        </p>
        <span className="font-type text-xs text-[#5d5744] uppercase tracking-wider">
          All rights reserved.
        </span>
      </div>
    </footer>
  );
}
