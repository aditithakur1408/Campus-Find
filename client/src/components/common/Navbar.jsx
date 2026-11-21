import React from 'react';
import { Compass, PlusCircle, Activity, User, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({
  onOpenAuth,
  onOpenReport,
  onOpenActivity,
  onOpenNotifications,
  unreadCount = 0,
  activeTab,
  setActiveTab,
}) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#fbf6e6]/90 backdrop-blur-md border-b-[2.5px] border-[#191712]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 lg:gap-8 h-18 py-2">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0" 
            onClick={() => setActiveTab('ALL')}
          >
            <div className="w-10 h-10 rounded-full border-[2.5px] border-[#191712] bg-[#ffe45e] hover:bg-[#b8ecd0] flex items-center justify-center font-hand font-bold text-2xl text-[#191712] transform -rotate-6 group-hover:rotate-6 transition-all duration-300 shadow-[2px_3px_0_#191712] hover:shadow-[4px_5px_0_#191712] shrink-0">
              CF
            </div>
            <div className="flex items-baseline gap-2 shrink-0">
              <span className="font-hand font-bold text-3xl sm:text-4xl text-[#191712] tracking-tight whitespace-nowrap">
                CampusFind
              </span>
            </div>
          </div>

          {/* Paper Navigation Tabs - Centered & Evenly Spaced */}
          <nav className="hidden md:flex items-center justify-center gap-2 lg:gap-4 flex-1 mx-2 lg:mx-6">
            {[
              { id: 'ALL', label: 'All Notices' },
              { id: 'LOST', label: 'Lost Belongings' },
              { id: 'FOUND', label: 'Found Belongings' },
              ...(user ? [{ id: 'MY_NOTICES', label: 'My Notices' }] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-hand font-bold text-lg lg:text-xl px-3.5 lg:px-4 py-1.5 rounded-lg border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#d9584d] text-[#191712] bg-[#ffe45e]/50 shadow-[1px_2px_0_#191712]'
                    : 'border-transparent text-[#5d5744] hover:text-[#191712] hover:bg-[#f2ead4]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons - Balanced Spacing */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Activity Log Button */}
            <button
              onClick={onOpenActivity}
              title="View Who Logged In & Registry Activity"
              className="sketch-button-secondary text-sm !py-1.5 !px-3"
            >
              <Activity className="w-4 h-4 text-[#d9584d]" />
              <span className="hidden sm:inline">Logbook</span>
            </button>

            {/* Notification Inbox Button for logged-in users */}
            {user && (
              <button
                onClick={onOpenNotifications}
                title="View Handover Codes & Notice Updates"
                className="sketch-button-secondary text-sm !py-1.5 !px-3 relative"
              >
                <Bell className="w-4 h-4 text-[#d9584d]" />
                <span className="hidden sm:inline">Inbox</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#d9584d] text-[#fbf6e6] text-[10px] font-type font-bold px-1.5 py-0.5 rounded-full border border-[#191712] leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Report Item CTA */}
            <button
              onClick={onOpenReport}
              className="sketch-button text-sm !py-1.5 !px-3.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Notice</span>
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center gap-2.5 pl-3 border-l-2 border-dashed border-[#191712]/30">
                <div className="flex items-center gap-2 bg-[#f2ead4] px-3 py-1 rounded-xl border-2 border-[#191712] shadow-[2px_2px_0_#191712]">
                  <div className="w-6 h-6 rounded-full bg-[#ffe45e] border border-[#191712] text-[#191712] flex items-center justify-center font-hand font-bold text-xs">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="font-hand font-bold text-base text-[#191712] hidden xl:inline">
                    {user.fullName}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-[#5d5744] hover:text-[#d9584d] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="sketch-button-secondary text-sm !py-1.5 !px-3.5"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs - Evenly Distributed */}
        <div className="flex md:hidden items-center justify-around gap-1.5 pb-2.5 overflow-x-auto scrollbar-none pt-1.5 border-t border-dashed border-[#191712]/20">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'LOST', label: 'Lost' },
            { id: 'FOUND', label: 'Found' },
            ...(user ? [{ id: 'MY_NOTICES', label: 'My Notices' }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 font-hand font-bold text-base px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#d9584d] text-[#191712] bg-[#ffe45e] shadow-[1px_2px_0_#191712]'
                  : 'border-transparent text-[#5d5744] hover:bg-[#f2ead4]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
