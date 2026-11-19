import React from 'react';
import { MapPin, Shield } from 'lucide-react';

export default function LocationFilterBar({ locations, selectedLocation, onSelectLocation }) {
  return (
    <div className="py-1">
      <div className="flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-none">
        {/* All Locations Chip */}
        <button
          onClick={() => onSelectLocation('')}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-[#18181b] font-type text-xs transition-all duration-200 cursor-pointer select-none ${
            selectedLocation === ''
              ? 'bg-[#18181b] text-white font-bold shadow-[2px_2px_0_#18181b]'
              : 'bg-white hover:bg-[#f4efe4] text-[#18181b] shadow-[2px_2px_0_#18181b] hover:shadow-[3px_3px_0_#18181b] hover:-translate-y-0.5'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>ALL CAMPUS LOCATIONS</span>
        </button>

        {/* Dynamic Location Chips */}
        {locations.map((loc) => {
          const isSelected = String(selectedLocation) === String(loc.id);

          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(isSelected ? '' : loc.id)}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-[#18181b] font-type text-xs transition-all duration-200 cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#18181b] text-white font-bold shadow-[2px_2px_0_#18181b] scale-[1.02]'
                  : 'bg-white hover:bg-[#f4efe4] text-[#18181b] shadow-[2px_2px_0_#18181b] hover:shadow-[3px_3px_0_#18181b] hover:-translate-y-0.5'
              }`}
              title={`${loc.buildingName} - ${loc.zoneFloor}`}
            >
              <span>{loc.buildingName}</span>
              <span className={`text-[10px] ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                ({loc.zoneFloor.split(' - ')[0]})
              </span>
              {loc.hasSecurityDesk && (
                <Shield className="w-3 h-3 text-[#b91c1c]" title="Has Security Desk" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
