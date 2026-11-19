import React from 'react';
import { Compass, PlusCircle, Activity, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onOpenAuth, onOpenReport, onOpenActivity, activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#fbf6e6]/90 backdrop-blur-md border-b-[2.5px] border-[#191712]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group select-none" 
            onClick={() => setActiveTab('ALL')}
          >
            <div className="w-10 h-10 rounded-full border-[2.5px] border-[#191712] bg-[#ffe45e] hover:bg-[#b8ecd0] flex items-center justify-center font-hand font-bold text-2xl text-[#191712] transform -rotate-6 group-hover:rotate-6 transition-all duration-300 shadow-[2px_3px_0_#191712] hover:shadow-[4px_5px_0_#191712]">
              CF
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-hand font-bold text-3xl sm:text-4xl text-[#191712] tracking-tight">
                Campus<span className="underline decoration-wavy decoration-[#d9584d] decoration-2">Find</span>
              </span>
            </div>
          </div>

          {/* Paper Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-2">
            {[
              { id: 'ALL', label: 'All Notices' },
              { id: 'LOST', label: 'Lost Belongings' },
              { id: 'FOUND', label: 'Found Belongings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-hand font-bold text-xl px-3.5 py-1 rounded-lg border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#d9584d] text-[#191712] bg-[#ffe45e]/50'
                    : 'border-transparent text-[#5d5744] hover:text-[#191712] hover:bg-[#f2ead4]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Activity Log Button */}
            <button
              onClick={onOpenActivity}
              title="View Who Logged In & Registry Activity"
              className="sketch-button-secondary text-sm !py-1.5 !px-3"
            >
              <Activity className="w-4 h-4 text-[#d9584d]" />
              <span className="hidden sm:inline">Logbook</span>
            </button>

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
              <div className="flex items-center gap-2 pl-2 border-l-2 border-dashed border-[#191712]/30">
                <div className="flex items-center gap-2 bg-[#f2ead4] px-3 py-1 rounded-xl border-2 border-[#191712] shadow-[2px_2px_0_#191712]">
                  <div className="w-6 h-6 rounded-full bg-[#ffe45e] border border-[#191712] text-[#191712] flex items-center justify-center font-hand font-bold text-xs">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="font-hand font-bold text-base text-[#191712] hidden lg:inline">
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
      </div>
    </header>
  );
}
