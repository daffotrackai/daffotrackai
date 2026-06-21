import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Menu, Cpu, Bell, User as UserIcon } from 'lucide-react';

export default function PageTopBar({
  title,
  subtitle,
  showBack = true,
  backLabel = 'Back',
  backTo = -1,
  drawerOpen,
  setDrawerOpen,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backTo);
  };

  return (
    <div 
      className={`fixed top-0 right-0 z-[55] h-16 border-b border-white/6 bg-[#060e1a]/90 backdrop-blur-xl transition-all duration-300 ease-in-out ${
        drawerOpen ? 'left-0 lg:left-[280px]' : 'left-0'
      }`}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left Side: Toggle Button + Back/Title */}
        <div className="flex items-center gap-3 min-w-0">
          
          {/* Menu Hamburger Icon */}
          <button
            type="button"
            onClick={() => setDrawerOpen(v => !v)}
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            className="w-10 h-10 rounded-xl border border-white/8 bg-white/4 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/8 transition-all shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Back Button (Hidden on very small screens to save space) */}
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-teal-500/30 hover:bg-teal-500/5 transition-all shrink-0"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {backLabel}
            </button>
          ) : (
            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-teal-500/30 hover:bg-teal-500/5 transition-all shrink-0"
            >
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              DaffoTrack
            </Link>
          )}

          {/* Title Area */}
          <div className="min-w-0 ml-1">
            <p className="truncate text-sm font-bold text-white">{title}</p>
            {subtitle && <p className="truncate hidden md:block text-[10px] text-slate-500">{subtitle}</p>}
          </div>
        </div>

        {/* Right Side: Icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-9 h-9 rounded-xl border border-white/8 bg-white/3 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-500/20 transition-all"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full border border-white/8 bg-white/3 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-500/20 transition-all"
          >
            <UserIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}