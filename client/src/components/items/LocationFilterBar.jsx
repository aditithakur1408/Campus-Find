import React from 'react';
import { MapPin, Shield } from 'lucide-react';

const LOCATION_COLORS = [
  { base: 'bg-[#4bcffa]', hover: 'hover:bg-[#ffd32a]' },
  { base: 'bg-[#2ed573]', hover: 'hover:bg-[#ff7979]' },
  { base: 'bg-[#ffd32a]', hover: 'hover:bg-[#2ed573]' },
  { base: 'bg-[#70a1ff]', hover: 'hover:bg-[#4bcffa]' },
];

export default function LocationFilterBar({ locations, selectedLocation, onSelectLocation }) {
  return (
    <div className="py-2">
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {/* All Locations Chip */}
        <button
          onClick={() => onSelectLocation('')}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border-2 border-[#191712] font-type text-xs transition-all duration-200 cursor-pointer shadow-[2px_2px_0_#191712] hover:shadow-[3px_4px_0_#191712] hover:-translate-y-0.5 ${
            selectedLocation === ''
              ? 'bg-[#191712] text-[#ffd32a] font-bold'
              : 'bg-[#fbf6e6] hover:bg-[#ffd32a] text-[#191712]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>ALL CAMPUS SPOTS</span>
        </button>

        {/* Dynamic Location Chips with Vibrant Transitions */}
        {locations.map((loc, idx) => {
          const isSelected = String(selectedLocation) === String(loc.id);
          const color = LOCATION_COLORS[idx % LOCATION_COLORS.length];

          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(isSelected ? '' : loc.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#191712] font-type text-xs transition-all duration-200 cursor-pointer shadow-[2px_2px_0_#191712] hover:shadow-[3px_4px_0_#191712] hover:-translate-y-0.5 ${
                isSelected
                  ? 'bg-[#191712] text-[#ffd32a] font-bold scale-105'
                  : color.base + ' ' + color.hover + ' text-[#191712]'
              }`}
              title={`${loc.buildingName} - ${loc.zoneFloor}`}
            >
              <span>{loc.buildingName}</span>
              <span className="opacity-80 text-[10px]">({loc.zoneFloor.split(' - ')[0]})</span>
              {loc.hasSecurityDesk && (
                <Shield className="w-3 h-3 text-[#eb4d4b]" title="Has Security Desk" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
