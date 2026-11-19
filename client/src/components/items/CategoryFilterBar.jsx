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

export default function CategoryFilterBar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="py-1">
      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-none">
        {/* All Categories Chip */}
        <button
          onClick={() => onSelectCategory('')}
          className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-[#18181b] font-sans font-semibold text-sm transition-all duration-200 cursor-pointer select-none ${
            selectedCategory === ''
              ? 'bg-[#18181b] text-white shadow-[2px_2px_0_#18181b] scale-[1.02]'
              : 'bg-white hover:bg-[#f4efe4] text-[#18181b] shadow-[2px_2px_0_#18181b] hover:shadow-[3px_3px_0_#18181b] hover:-translate-y-0.5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Categories</span>
        </button>

        {/* Dynamic Category Chips */}
        {categories.map((cat) => {
          const Icon = iconMap[cat.iconName] || HelpCircle;
          const isSelected = String(selectedCategory) === String(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? '' : cat.id)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-[#18181b] font-sans font-semibold text-sm transition-all duration-200 cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#18181b] text-white shadow-[2px_2px_0_#18181b] scale-[1.02]'
                  : 'bg-white hover:bg-[#f4efe4] text-[#18181b] shadow-[2px_2px_0_#18181b] hover:shadow-[3px_3px_0_#18181b] hover:-translate-y-0.5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 text-current opacity-80" />
              <span>{cat.name}</span>
              {cat._count?.items !== undefined && cat._count.items > 0 && (
                <span
                  className={`font-type text-[10px] px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#18181b]/10 text-[#18181b]'
                  }`}
                >
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
