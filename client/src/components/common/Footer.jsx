import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t-2 border-[#18181b] bg-[#f1ede4]/90 py-6 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p className="font-sans text-xs text-[#71717a]">
          © 2026 CampusFind — Campus Lost and Found Recovery Platform.
        </p>
        <span className="font-type text-[11px] text-[#71717a] uppercase tracking-wider">
          All rights reserved.
        </span>
      </div>
    </footer>
  );
}
