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

// Pastel color pairs: [baseColor, hoverColor, textColor]
const COLOR_PAIRS = [
  { base: 'bg-[#ffe45e]', hover: 'hover:bg-[#b8ecd0]', active: 'bg-[#191712] text-[#ffe45e]' },
  { base: 'bg-[#ffc9dc]', hover: 'hover:bg-[#ffe45e]', active: 'bg-[#191712] text-[#ffc9dc]' },
  { base: 'bg-[#b8ecd0]', hover: 'hover:bg-[#c2e5f7]', active: 'bg-[#191712] text-[#b8ecd0]' },
  { base: 'bg-[#c2e5f7]', hover: 'hover:bg-[#ffc9dc]', active: 'bg-[#191712] text-[#c2e5f7]' },
  { base: 'bg-[#ffeaa0]', hover: 'hover:bg-[#b8ecd0]', active: 'bg-[#191712] text-[#ffeaa0]' },
];

export default function CategoryFilterBar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="py-2">
      {/* Category Pills Row */}
      <div className="flex items-center gap-2.5 overflow-x-auto py-2 scrollbar-none">
        {/* All Categories Chip */}
        <button
          onClick={() => onSelectCategory('')}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-[180px_10px_160px_12px/12px_170px_10px_180px] border-2 border-[#191712] font-hand font-bold text-lg transition-all duration-200 cursor-pointer select-none shadow-[2px_3px_0_#191712] hover:shadow-[4px_5px_0_#191712] hover:-translate-y-0.5 ${
            selectedCategory === ''
              ? 'bg-[#191712] text-[#ffe45e] scale-105'
              : 'bg-[#fbf6e6] hover:bg-[#ffe45e] text-[#191712]'
          }`}
        >
          <span>🏷️ All Categories</span>
        </button>

        {/* Dynamic Category Chips with Hover Color Transitions */}
        {categories.map((cat, idx) => {
          const Icon = iconMap[cat.iconName] || HelpCircle;
          const isSelected = String(selectedCategory) === String(cat.id);
          const colorPair = COLOR_PAIRS[idx % COLOR_PAIRS.length];

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? '' : cat.id)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-[180px_10px_160px_12px/12px_170px_10px_180px] border-2 border-[#191712] font-hand font-bold text-lg transition-all duration-200 cursor-pointer select-none shadow-[2px_3px_0_#191712] hover:shadow-[4px_5px_0_#191712] hover:-translate-y-0.5 ${
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
