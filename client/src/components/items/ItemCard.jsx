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
        <div className="flex items-center justify-between gap-2 pt-1 pb-3 border-b-2 border-dashed border-[#191712]/20">
          <div className="flex items-center gap-1.5 font-hand font-bold text-xl text-[#5d5744]">
            <CategoryIcon className="w-4 h-4 text-[#191712]" />
            <span className="truncate max-w-[130px]">{item.category?.name || 'Item'}</span>
          </div>

          <div className="flex items-center gap-1">
            {item.status === 'RESOLVED' ? (
              <span className="stamp-badge bg-[#191712] text-[#fbf6e6]">
                HANDED OVER
              </span>
            ) : item.status === 'CLAIM_PENDING' ? (
              <span className="stamp-badge bg-[#ffd32a] text-[#191712]">
                CLAIM PENDING
              </span>
            ) : isFound ? (
              <span className="stamp-badge bg-[#2ed573] text-[#191712]">
                FOUND NOTICE
              </span>
            ) : (
              <span className="stamp-badge bg-[#ff7979] text-[#191712] border-[#eb4d4b]">
                LOST NOTICE
              </span>
            )}
          </div>
        </div>

        {/* Polaroid Picture Frame or Sketch Icon Preview */}
        <div className="my-3 aspect-video w-full rounded-xl border-2 border-[#191712] bg-[#f2ead4] overflow-hidden flex items-center justify-center relative shadow-[2px_2px_0_#191712]">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-[#5d5744]">
              <CategoryIcon className="w-10 h-10 opacity-70 group-hover:scale-110 transition-transform" />
              <span className="font-type text-[10px] uppercase tracking-wider text-[#5d5744]">No photo pinned</span>
            </div>
          )}

          {/* Custody pill */}
          {isFound && item.custodyType === 'AT_SECURITY_DESK' && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-[#191712] text-[#ffd32a] text-[10px] font-type px-2 py-0.5 rounded-md border border-[#191712]">
              <Shield className="w-3 h-3 text-[#ffd32a]" />
              <span>Security Desk</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-hand font-bold text-3xl text-[#191712] line-clamp-1 group-hover:text-[#eb4d4b] transition-colors leading-snug">
          {item.title}
        </h3>

        {/* Description */}
        <p className="font-neat text-lg text-[#5d5744] line-clamp-2 mt-1 leading-snug">
          {item.description}
        </p>
      </div>

      {/* Card Footer: Location & Date */}
      <div className="mt-4 pt-3 border-t-2 border-dashed border-[#191712]/20 flex items-center justify-between font-type text-xs text-[#5d5744]">
        <div className="flex items-center gap-1 truncate max-w-[65%]" title={`${item.location?.buildingName} - ${item.location?.zoneFloor}`}>
          <MapPin className="w-3.5 h-3.5 text-[#eb4d4b] shrink-0" />
          <span className="truncate">{item.location?.buildingName}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Calendar className="w-3.5 h-3.5 text-[#191712]" />
          <span>{formatDate(item.incidentDate)}</span>
        </div>
      </div>
    </div>
  );
}
