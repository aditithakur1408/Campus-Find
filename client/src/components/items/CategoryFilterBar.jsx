import React from 'react';
import { Laptop, Wallet, CreditCard, Key, Backpack, Book, Shirt, Coffee, HelpCircle, Layers } from 'lucide-react';

const iconMap = {
  Laptop,
  Wallet,
  CreditCard,
  Key,
  Backpack,
  Book,
  Shirt,
  Coffee,
  HelpCircle,
};

// Vibrant, energetic color pairs that pop
const COLOR_PAIRS = [
  { base: 'bg-[#ffd32a]', hover: 'hover:bg-[#ffa801]', active: 'bg-[#191712] text-[#ffd32a]' },
  { base: 'bg-[#ff7979]', hover: 'hover:bg-[#ff5252]', active: 'bg-[#191712] text-[#ff7979]' },
  { base: 'bg-[#2ed573]', hover: 'hover:bg-[#0be881]', active: 'bg-[#191712] text-[#2ed573]' },
  { base: 'bg-[#70a1ff]', hover: 'hover:bg-[#4bcffa]', active: 'bg-[#191712] text-[#70a1ff]' },
  { base: 'bg-[#c56cf0]', hover: 'hover:bg-[#a55eea]', active: 'bg-[#191712] text-[#c56cf0]' },
];

export default function CategoryFilterBar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="py-2">
      {/* Category Pills Row */}
      <div className="flex items-center gap-2.5 overflow-x-auto py-2 scrollbar-none">
        {/* All Categories Chip */}
        <button
          onClick={() => onSelectCategory('')}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-[180px_10px_160px_12px/12px_170px_10px_180px] border-2 border-[#191712] font-hand font-bold text-xl transition-all duration-200 cursor-pointer select-none shadow-[2px_3px_0_#191712] hover:shadow-[4px_5px_0_#191712] hover:-translate-y-0.5 ${
            selectedCategory === ''
              ? 'bg-[#191712] text-[#ffd32a] scale-105'
              : 'bg-[#fbf6e6] hover:bg-[#ffd32a] text-[#191712]'
          }`}
        >
          <Layers className="w-5 h-5 shrink-0" />
          <span>All Categories</span>
        </button>

        {/* Dynamic Category Chips with Vibrant Colors */}
        {categories.map((cat, idx) => {
          const Icon = iconMap[cat.iconName] || HelpCircle;
          const isSelected = String(selectedCategory) === String(cat.id);
          const colorPair = COLOR_PAIRS[idx % COLOR_PAIRS.length];

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? '' : cat.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-[180px_10px_160px_12px/12px_170px_10px_180px] border-2 border-[#191712] font-hand font-bold text-xl transition-all duration-200 cursor-pointer select-none shadow-[2px_3px_0_#191712] hover:shadow-[4px_5px_0_#191712] hover:-translate-y-0.5 ${
                isSelected
                  ? colorPair.active + ' scale-105 transform -rotate-1'
                  : colorPair.base + ' ' + colorPair.hover + ' text-[#191712]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{cat.name}</span>
              {cat._count?.items !== undefined && cat._count.items > 0 && (
                <span className="font-type text-[10px] bg-[#191712]/15 px-1.5 py-0.5 rounded-full">
                  {cat._count.items}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
