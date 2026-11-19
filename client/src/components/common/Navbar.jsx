import React from 'react';
import { Compass, PlusCircle, Activity, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onOpenAuth, onOpenReport, onOpenActivity, activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b-2 border-[#18181b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 py-2">
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group select-none" 
            onClick={() => setActiveTab('ALL')}
          >
            <div className="w-9 h-9 rounded-xl border-2 border-[#18181b] bg-[#18181b] flex items-center justify-center font-display font-bold text-base text-white shadow-[2px_2px_0_#18181b] group-hover:scale-105 transition-transform">
              CF
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-2xl sm:text-3xl text-[#18181b] tracking-tight">
                Campus<span className="text-[#b91c1c]">Find</span>
              </span>
            </div>
          </div>

          {/* Paper Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5">
            {[
              { id: 'ALL', label: 'All Notices' },
              { id: 'LOST', label: 'Lost Belongings' },
              { id: 'FOUND', label: 'Found Belongings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-sans font-semibold text-sm px-3.5 py-1.5 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'border-2 border-[#18181b] bg-[#18181b] text-white shadow-[2px_2px_0_#18181b]'
                    : 'border-2 border-transparent text-[#52525b] hover:text-[#18181b] hover:bg-[#f1ede4]'
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
              title="View Registry Logbook"
              className="sketch-button-secondary text-xs !py-1.5 !px-3"
            >
              <Activity className="w-3.5 h-3.5 text-[#b91c1c]" />
              <span className="hidden sm:inline">Logbook</span>
            </button>

            {/* Report Item CTA */}
            <button
              onClick={onOpenReport}
              className="sketch-button text-xs !py-1.5 !px-3.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Notice</span>
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-dashed border-[#18181b]/30">
                <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border-2 border-[#18181b] shadow-[2px_2px_0_#18181b]">
                  <div className="w-5 h-5 rounded-md bg-[#18181b] text-white flex items-center justify-center font-display font-bold text-xs">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="font-sans font-semibold text-xs text-[#18181b] hidden lg:inline">
                    {user.fullName}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1 text-[#71717a] hover:text-[#b91c1c] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="sketch-button-secondary text-xs !py-1.5 !px-3.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
