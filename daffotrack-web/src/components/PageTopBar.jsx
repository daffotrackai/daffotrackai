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
    if (typeof backTo === 'number') {
      navigate(backTo);
      return;
    }

    navigate(backTo);
  };

  return (
    <div className="sticky top-0 z-[55] border-b border-[#1E3A5F] bg-[#0B1A30]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#1E3A5F] bg-[#13253F] px-3 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-[#00E5FF]/30 hover:text-[#00E5FF]"
            >
              <ChevronLeft className="h-4 w-4" />
              {backLabel}
            </button>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#1E3A5F] bg-[#13253F] px-3 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-[#00E5FF]/30 hover:text-[#00E5FF]"
            >
              <Cpu className="h-4 w-4" />
              DaffoTrack
            </Link>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{title}</p>
            {subtitle ? <p className="truncate text-[11px] text-slate-400">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#1E3A5F] bg-[#0B1A30] text-slate-300 hover:text-[#00E5FF] transition-colors"
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Profile"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#1E3A5F] bg-[#0B1A30] text-slate-300 hover:text-[#00E5FF] transition-colors"
          >
            <UserIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#1E3A5F] bg-[#13253F] text-[#00E5FF] transition-all hover:scale-105 hover:border-[#00E5FF]/30"
            aria-label={drawerOpen ? 'Hide navigation drawer' : 'Show navigation drawer'}
          >
            {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}