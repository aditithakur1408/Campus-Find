import React from 'react';
import { MapPin, Calendar, Shield, HelpCircle, Laptop, Wallet, CreditCard, Key, Backpack, Book, Shirt, Coffee } from 'lucide-react';

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

export default function ItemCard({ item, onClick }) {
  const isFound = item.itemType === 'FOUND';
  const primaryImage = item.images && item.images.length > 0 ? item.images[0].imageUrl : null;
  const CategoryIcon = iconMap[item.category?.iconName] || HelpCircle;

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={() => onClick(item)}
      className="notebook-card p-4 cursor-pointer flex flex-col justify-between group select-none min-h-[340px]"
    >
      {/* Masking tape on top of the card */}
      <div className="tape-sticker" />

      <div>
        {/* Top Header: Category and Status Stamp */}
        <div className="flex items-center justify-between gap-2 pt-1 pb-3 border-b border-dashed border-[#18181b]/20">
          <div className="flex items-center gap-1.5 font-sans font-semibold text-sm text-[#52525b]">
            <CategoryIcon className="w-4 h-4 text-[#18181b]" />
            <span className="truncate max-w-[130px]">{item.category?.name || 'Item'}</span>
          </div>

          <div className="flex items-center gap-1">
            {item.status === 'RESOLVED' ? (
              <span className="stamp-badge bg-[#18181b] text-white border-[#18181b]">
                HANDED OVER
              </span>
            ) : item.status === 'CLAIM_PENDING' ? (
              <span className="stamp-badge bg-[#fef3c7] text-[#92400e] border-[#fbbf24]">
                CLAIM PENDING
              </span>
            ) : isFound ? (
              <span className="stamp-badge bg-[#dcfce7] text-[#166534] border-[#4ade80]">
                FOUND NOTICE
              </span>
            ) : (
              <span className="stamp-badge bg-[#fee2e2] text-[#991b1b] border-[#f87171]">
                LOST NOTICE
              </span>
            )}
          </div>
        </div>

        {/* Polaroid Picture Frame or Sketch Icon Preview */}
        <div className="my-3 aspect-video w-full rounded-xl border-2 border-[#18181b] bg-[#f4efe4] overflow-hidden flex items-center justify-center relative shadow-[2px_2px_0_#18181b]">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-[#71717a]">
              <CategoryIcon className="w-9 h-9 opacity-70 group-hover:scale-110 transition-transform" />
              <span className="font-type text-[10px] uppercase tracking-wider text-[#71717a]">No photo pinned</span>
            </div>
          )}

          {/* Custody pill */}
          {isFound && item.custodyType === 'AT_SECURITY_DESK' && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-[#18181b] text-[#fef08a] text-[10px] font-type px-2 py-0.5 rounded-md border border-[#18181b]">
              <Shield className="w-3 h-3 text-[#fef08a]" />
              <span>Security Desk</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-xl text-[#18181b] line-clamp-1 group-hover:text-[#b91c1c] transition-colors leading-snug">
          {item.title}
        </h3>

        {/* Description */}
        <p className="font-sans text-sm text-[#52525b] line-clamp-2 mt-1 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Card Footer: Location & Date */}
      <div className="mt-4 pt-3 border-t border-dashed border-[#18181b]/20 flex items-center justify-between font-type text-[11px] text-[#71717a]">
        <div className="flex items-center gap-1 truncate max-w-[65%]" title={`${item.location?.buildingName} - ${item.location?.zoneFloor}`}>
          <MapPin className="w-3.5 h-3.5 text-[#b91c1c] shrink-0" />
          <span className="truncate">{item.location?.buildingName}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Calendar className="w-3.5 h-3.5 text-[#18181b]" />
          <span>{formatDate(item.incidentDate)}</span>
        </div>
      </div>
    </div>
  );
}
