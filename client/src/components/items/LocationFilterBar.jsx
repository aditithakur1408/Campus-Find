import React from 'react';
import { MapPin, Shield } from 'lucide-react';

const LOCATION_COLORS = [
  { base: 'bg-[#c2e5f7]', hover: 'hover:bg-[#ffe45e]' },
  { base: 'bg-[#b8ecd0]', hover: 'hover:bg-[#ffc9dc]' },
  { base: 'bg-[#ffeaa0]', hover: 'hover:bg-[#b8ecd0]' },
  { base: 'bg-[#ffc9dc]', hover: 'hover:bg-[#c2e5f7]' },
];

export default function LocationFilterBar({ locations, selectedLocation, onSelectLocation }) {
  return (
    <div className="py-2">
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {/* All Locations Chip */}
        <button
          onClick={() => onSelectLocation('')}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#191712] font-type text-xs transition-all duration-200 cursor-pointer shadow-[2px_2px_0_#191712] hover:shadow-[3px_4px_0_#191712] hover:-translate-y-0.5 ${
            selectedLocation === ''
              ? 'bg-[#191712] text-[#ffe45e] font-bold'
              : 'bg-[#fbf6e6] hover:bg-[#c2e5f7] text-[#191712]'
          }`}
        >
          <span>📍 ALL CAMPUS SPOTS</span>
        </button>

        {/* Dynamic Location Chips with Hover Color Transitions */}
        {locations.map((loc, idx) => {
          const isSelected = String(selectedLocation) === String(loc.id);
          const color = LOCATION_COLORS[idx % LOCATION_COLORS.length];

          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(isSelected ? '' : loc.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#191712] font-type text-xs transition-all duration-200 cursor-pointer shadow-[2px_2px_0_#191712] hover:shadow-[3px_4px_0_#191712] hover:-translate-y-0.5 ${
                isSelected
                  ? 'bg-[#191712] text-[#ffe45e] font-bold scale-105'
                  : color.base + ' ' + color.hover + ' text-[#191712]'
              }`}
              title={`${loc.buildingName} - ${loc.zoneFloor}`}
            >
              <span>{loc.buildingName}</span>
              <span className="opacity-70 text-[10px]">({loc.zoneFloor.split(' - ')[0]})</span>
              {loc.hasSecurityDesk && (
                <Shield className="w-3 h-3 text-[#d9584d]" title="Has Security Desk" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
