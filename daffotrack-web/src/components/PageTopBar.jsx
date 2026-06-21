import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Menu, X, Cpu, Bell, User as UserIcon } from 'lucide-react';

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
    if (typeof backTo === 'number') navigate(backTo);
    else navigate(backTo);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[55] border-b border-white/6 bg-[#060e1a]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-teal-500/30 hover:bg-teal-500/5 transition-all shrink-0"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {backLabel}
            </button>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-teal-500/30 hover:bg-teal-500/5 transition-all shrink-0"
            >
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              DaffoTrack
            </Link>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{title}</p>
            {subtitle && <p className="truncate text-[10px] text-slate-500">{subtitle}</p>}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="w-9 h-9 rounded-xl border border-white/8 bg-white/3 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-500/20 transition-all"
          >
            <Bell className="w-4 h-4" />
          </button>

          <button
            type="button"
            aria-label="Profile"
            className="w-9 h-9 rounded-full border border-white/8 bg-white/3 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-500/20 transition-all"
          >
            <UserIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen(v => !v)}
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            className="w-10 h-10 rounded-xl border border-teal-500/20 bg-teal-500/8 flex items-center justify-center text-teal-400 hover:bg-teal-500/15 hover:scale-105 transition-all"
          >
            {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
