import React from 'react';
import { Search, RefreshCw, PlusCircle, Pin, Layers, MapPin, X } from 'lucide-react';
import StatsBar from '../components/common/StatsBar';
import ItemCard from '../components/items/ItemCard';
import CategoryFilterBar from '../components/items/CategoryFilterBar';
import LocationFilterBar from '../components/items/LocationFilterBar';
import SketchLoader from '../components/common/SketchLoader';

export default function HomePage({
  items,
  categories,
  locations,
  stats,
  loading,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  filterMode,
  setFilterMode,
  onSearchSubmit,
  onCardClick,
  onOpenReport,
  onRefresh,
}) {
  const selectedCategoryName = categories.find((c) => String(c.id) === String(selectedCategory))?.name;
  const selectedLocationName = locations.find((l) => String(l.id) === String(selectedLocation))?.buildingName;

  return (
    <div>
      {/* Spacious Hero Section */}
      <section className="relative max-w-6xl w-full mx-auto px-4 sm:px-6 pt-12 pb-10">
        {/* Floating Circular Rubber Stamp */}
        <div 
          title="Campus Verified Handover Station"
          className="hidden lg:grid place-items-center absolute right-8 top-12 w-28 h-28 rounded-full border-2 border-dashed border-[#b91c1c] bg-[#fef2f2] text-[#b91c1c] text-center leading-tight transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 shadow-[3px_3px_0_#b91c1c] cursor-pointer select-none group"
        >
          <div className="text-[10px] uppercase tracking-widest font-type font-bold text-[#b91c1c]">CAMPUS</div>
          <div className="text-xl font-display font-black tracking-wider text-[#b91c1c]">VERIFIED</div>
          <div className="text-[9px] font-type uppercase tracking-wider text-[#71717a] mt-0.5">SAFE RETURN</div>
        </div>

        <div className="max-w-2xl">
          <p className="font-type text-xs text-[#b91c1c] uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b91c1c] animate-ping" />
            <span>CAMPUS LOST & FOUND REGISTRY</span>
          </p>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-[#18181b] leading-[1.08] tracking-tight">
            Lost it on campus? <br />
            Spot it <span className="highlight-pen font-hand text-5xl sm:text-7xl font-bold">before</span> it's gone.
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#52525b] mt-4 max-w-xl leading-relaxed">
            Report misplaced belongings, verify true ownership with secret anti-fraud questions, and hand over items securely at physical campus security stations.
          </p>

          {/* Search Box */}
          <form onSubmit={onSearchSubmit} className="mt-7 flex items-center gap-3 max-w-xl">
            <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-white border-2 border-[#18181b] rounded-xl shadow-[3px_3px_0_#18181b] focus-within:shadow-[4px_5px_0_#18181b] transition-shadow">
              <Search className="w-4 h-4 text-[#71717a]" />
              <input
                type="text"
                placeholder="Search lost IDs, laptops, keys, wallets, bags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent font-sans text-sm text-[#18181b] placeholder-[#71717a] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="sketch-button !py-2.5 !px-5"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-20">
        {/* Section 1: Recovery Overview */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-1 font-type text-xs text-[#71717a] uppercase tracking-wider">
            <span>[1] CAMPUS RECOVERY SNAPSHOT</span>
          </div>
          <StatsBar stats={stats} />
        </section>

        {/* Section 2: Pinboard Feed */}
        <section className="pt-8 border-t border-dashed border-[#18181b]/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 font-type text-xs text-[#b91c1c] uppercase tracking-wider">
                <span>[2] THE LIVE NOTICEBOARD</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#18181b] mt-1 tracking-tight">
                Browse Campus Notices
              </h2>
            </div>

            {/* Filter Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#f1ede4] p-1 rounded-xl border-2 border-[#18181b] shadow-[2px_2px_0_#18181b] self-start md:self-auto">
              <button
                type="button"
                onClick={() => setFilterMode('CATEGORIES')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans font-semibold text-xs transition-all duration-200 cursor-pointer ${
                  filterMode === 'CATEGORIES'
                    ? 'bg-[#18181b] text-white shadow-[1px_1px_0_#18181b]'
                    : 'text-[#52525b] hover:text-[#18181b]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Categories</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterMode('LOCATIONS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans font-semibold text-xs transition-all duration-200 cursor-pointer ${
                  filterMode === 'LOCATIONS'
                    ? 'bg-[#18181b] text-white shadow-[1px_1px_0_#18181b]'
                    : 'text-[#52525b] hover:text-[#18181b]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Campus Spots</span>
              </button>
            </div>
          </div>

          {/* Active Filter Drawer */}
          <div className="bg-[#f1ede4]/70 p-3.5 rounded-2xl border-2 border-[#18181b] mb-6 shadow-[3px_3px_0_rgba(24,24,27,0.08)]">
            {filterMode === 'CATEGORIES' ? (
              <CategoryFilterBar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            ) : (
              <LocationFilterBar
                locations={locations}
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
              />
            )}
          </div>

          {/* Active Filters Pill Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-dashed border-[#18181b]/20 font-type text-xs text-[#52525b]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-type text-xs text-[#18181b] uppercase tracking-wider font-semibold">
                SHOWING: <strong>{items.length}</strong> NOTICES PINNED
              </span>

              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 bg-[#fef3c7] px-2.5 py-1 rounded-lg border-2 border-[#18181b] text-[#92400e] font-sans font-semibold text-xs shadow-[1px_2px_0_#18181b]">
                  <span>Category: {selectedCategoryName || selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('')} className="hover:text-[#b91c1c]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedLocation && (
                <span className="inline-flex items-center gap-1.5 bg-[#e0e7ff] px-2.5 py-1 rounded-lg border-2 border-[#18181b] text-[#3730a3] font-sans font-semibold text-xs shadow-[1px_2px_0_#18181b]">
                  <span>Spot: {selectedLocationName || selectedLocation}</span>
                  <button onClick={() => setSelectedLocation('')} className="hover:text-[#b91c1c]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 bg-[#fee2e2] px-2.5 py-1 rounded-lg border-2 border-[#18181b] text-[#991b1b] font-sans font-semibold text-xs shadow-[1px_2px_0_#18181b]">
                  <span>"{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-[#b91c1c]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {(selectedCategory || selectedLocation || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedLocation('');
                    setSearchQuery('');
                  }}
                  className="font-sans font-semibold text-xs text-[#b91c1c] hover:underline px-2"
                >
                  Clear all filters
                </button>
              )}
            </div>

            <button
              onClick={onRefresh}
              title="Refresh Noticeboard"
              className="sketch-button-secondary text-xs !py-1.5 !px-3"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#18181b]" />
              <span>Refresh Feed</span>
            </button>
          </div>

          {/* Item Cards Grid / Themed Loader */}
          {loading ? (
            <SketchLoader message="Searching campus noticeboard for records..." />
          ) : items.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-[#18181b] p-8 max-w-md mx-auto shadow-[3px_3px_0_#18181b]">
              <div className="w-14 h-14 rounded-xl border-2 border-[#18181b] bg-[#fef3c7] text-[#18181b] flex items-center justify-center mx-auto mb-4 animate-pin shadow-[2px_2px_0_#18181b]">
                <Pin className="w-7 h-7 text-[#d97706]" />
              </div>
              <h3 className="font-display font-bold text-2xl text-[#18181b]">No notices pinned here yet</h3>
              <p className="font-sans text-sm text-[#52525b] mt-2 max-w-xs mx-auto leading-relaxed">
                Did you lose or find something? Pin the first notice to help your fellow students recover it.
              </p>
              <button
                onClick={onOpenReport}
                className="sketch-button mt-5 text-sm !py-2 !px-4"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Pin a Notice Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} onClick={onCardClick} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
