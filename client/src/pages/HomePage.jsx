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
  activeTab = 'ALL',
  onSearchSubmit,
  onCardClick,
  onOpenReport,
  onRefresh,
}) {
  const selectedCategoryName = categories.find((c) => String(c.id) === String(selectedCategory))?.name;
  const selectedLocationName = locations.find((l) => String(l.id) === String(selectedLocation))?.buildingName;

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Spacious Hero Section */}
      <section className="relative max-w-6xl w-full mx-auto px-4 sm:px-6 pt-14 pb-12">
        {/* Floating Circular Rubber Stamp */}
        <div 
          title="Campus Verified Handover Station"
          className="hidden lg:grid place-items-center absolute right-8 top-12 w-32 h-32 rounded-full border-[3px] border-[#191712] bg-[#b8ecd0] hover:bg-[#ffe45e] text-[#191712] font-hand font-bold text-center leading-none transform rotate-12 hover:rotate-3 hover:scale-105 transition-all duration-300 shadow-[4px_6px_0_rgba(25,23,18,0.2)] cursor-pointer select-none group"
        >
          <div className="text-xs uppercase tracking-wider font-type text-[#5d5744] group-hover:text-[#d9584d] transition-colors">CAMPUS</div>
          <div className="text-3xl mt-1 text-[#191712]">VERIFIED</div>
          <div className="text-[11px] font-type text-[#d9584d] mt-1 group-hover:text-[#191712] transition-colors">SAFE RETURN</div>
        </div>

        <div className="max-w-2xl">
          <p className="font-type text-xs text-[#d9584d] uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d9584d] animate-ping" />
            <span>CAMPUS LOST & FOUND PLATFORM</span>
          </p>

          <h1 className="font-hand font-bold text-5xl sm:text-7xl text-[#191712] leading-[0.92] tracking-tight">
            Lost it on campus? <br />
            Spot it <span className="highlight-pen">before</span> it's gone.
          </h1>

          <p className="font-neat text-xl sm:text-2xl text-[#5d5744] mt-5 max-w-xl leading-relaxed">
            Report misplaced belongings, verify true ownership with secret anti-fraud questions, and hand over items securely at physical campus security stations.
          </p>

          {/* Search Box */}
          <form onSubmit={onSearchSubmit} className="mt-8 flex items-center gap-3 max-w-xl">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-[#fbf6e6] border-[2.5px] border-[#191712] rounded-[180px_10px_160px_12px/12px_170px_10px_180px] shadow-[3px_4px_0_rgba(25,23,18,0.15)] focus-within:shadow-[4px_6px_0_#191712] transition-shadow">
              <Search className="w-5 h-5 text-[#5d5744]" />
              <input
                type="text"
                placeholder="Search lost IDs, laptops, keys, wallets, calculators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent font-sans text-base sm:text-lg text-[#191712] placeholder-[#5d5744]/60 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="sketch-button"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-20">
        {/* Section 1: Recovery Overview */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-2 font-type text-xs text-[#5d5744] uppercase tracking-wider">
            <span>[1] CAMPUS RECOVERY SNAPSHOT</span>
          </div>
          <StatsBar stats={stats} />
        </section>

        {/* Section 2: Pinboard Feed */}
        <section className="pt-8 border-t-2 border-dashed border-[#191712]/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 font-type text-xs text-[#d9584d] uppercase tracking-wider">
                <span>[2] {activeTab === 'MY_NOTICES' ? 'YOUR PERSONAL NOTICES' : 'THE LIVE PINBOARD'}</span>
              </div>
              <h2 className="font-hand font-bold text-4xl text-[#191712] mt-1">
                {activeTab === 'MY_NOTICES'
                  ? 'Your Pinned Notices'
                  : activeTab === 'LOST'
                  ? 'Lost Belongings Feed'
                  : activeTab === 'FOUND'
                  ? 'Found Belongings Feed'
                  : 'Browse Campus Notices'}
              </h2>
            </div>

            {/* Filter Mode Switcher */}
            <div className="flex items-center gap-2 bg-[#f2ead4] p-1.5 rounded-2xl border-2 border-[#191712] shadow-[2px_2px_0_#191712] self-start md:self-auto">
              <button
                type="button"
                onClick={() => setFilterMode('CATEGORIES')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-hand font-bold text-lg transition-all duration-200 cursor-pointer ${
                  filterMode === 'CATEGORIES'
                    ? 'bg-[#ffe45e] text-[#191712] shadow-[2px_2px_0_#191712]'
                    : 'text-[#5d5744] hover:text-[#191712]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Categories</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterMode('LOCATIONS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-hand font-bold text-lg transition-all duration-200 cursor-pointer ${
                  filterMode === 'LOCATIONS'
                    ? 'bg-[#c2e5f7] text-[#191712] shadow-[2px_2px_0_#191712]'
                    : 'text-[#5d5744] hover:text-[#191712]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Campus Spots</span>
              </button>
            </div>
          </div>

          {/* Active Filter Drawer */}
          <div className="bg-[#f2ead4]/60 p-4 rounded-[255px_14px_225px_16px/16px_225px_14px_255px] border-2 border-[#191712] mb-8 shadow-[3px_4px_0_rgba(25,23,18,0.1)]">
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
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b-2 border-dashed border-[#191712]/20 font-type text-xs text-[#5d5744]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-type text-xs text-[#191712] uppercase tracking-wider">
                SHOWING: <strong>{items.length}</strong> NOTICES PINNED
              </span>

              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 bg-[#ffe45e] px-2.5 py-1 rounded-lg border-2 border-[#191712] text-[#191712] font-hand font-bold text-base shadow-[1px_2px_0_#191712]">
                  <span>Category: {selectedCategoryName || selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('')} className="hover:text-[#d9584d]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedLocation && (
                <span className="inline-flex items-center gap-1.5 bg-[#c2e5f7] px-2.5 py-1 rounded-lg border-2 border-[#191712] text-[#191712] font-hand font-bold text-base shadow-[1px_2px_0_#191712]">
                  <span>Spot: {selectedLocationName || selectedLocation}</span>
                  <button onClick={() => setSelectedLocation('')} className="hover:text-[#d9584d]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 bg-[#ffc9dc] px-2.5 py-1 rounded-lg border-2 border-[#191712] text-[#191712] font-hand font-bold text-base shadow-[1px_2px_0_#191712]">
                  <span>"{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-[#d9584d]">
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
                  className="font-hand font-bold text-lg text-[#d9584d] hover:underline px-2"
                >
                  Clear all filters
                </button>
              )}
            </div>

            <button
              onClick={onRefresh}
              title="Refresh Pinboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#191712] bg-[#fbf6e6] hover:bg-[#ffe45e] transition-all duration-200 cursor-pointer shadow-[2px_2px_0_#191712]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#191712]" />
              <span className="font-hand font-bold text-base text-[#191712]">Refresh Feed</span>
            </button>
          </div>

          {/* Item Cards Grid / Themed Loader */}
          {loading ? (
            <SketchLoader message="Searching campus pinboard for notices..." />
          ) : items.length === 0 ? (
            <div className="py-24 text-center bg-[#f2ead4] rounded-[255px_14px_225px_16px/16px_225px_14px_255px] border-[2.5px] border-dashed border-[#191712] p-8 max-w-lg mx-auto shadow-[4px_5px_0_rgba(25,23,18,0.1)]">
              <div className="w-16 h-16 rounded-full border-[2.5px] border-[#191712] bg-[#ffe45e] text-[#191712] flex items-center justify-center mx-auto mb-4 animate-pin shadow-[3px_3px_0_#191712]">
                <Pin className="w-8 h-8" />
              </div>
              <h3 className="font-hand font-bold text-4xl text-[#191712]">
                {activeTab === 'MY_NOTICES' ? "You haven't pinned any notices yet" : 'No notices pinned here yet'}
              </h3>
              <p className="font-neat text-xl text-[#5d5744] mt-2 max-w-sm mx-auto leading-relaxed">
                {activeTab === 'MY_NOTICES'
                  ? "Report lost items or items you've spotted on campus to track them all in one place."
                  : 'Did you lose or find something? Pin the first notice to help your fellow students recover it.'}
              </p>
              <button
                onClick={onOpenReport}
                className="sketch-button mt-6 !text-xl !py-2.5 !px-5"
              >
                <PlusCircle className="w-5 h-5" />
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
