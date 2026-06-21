import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { X, Cpu, Home, LogIn, UserPlus, LayoutDashboard, MessageSquare, User, LogOut } from 'lucide-react';
import { clearCurrentUser, getCurrentUser } from '../lib/session';

const NAV_ITEMS = [
  { to: '/',          label: 'Home',      icon: Home },
  { to: '/login',     label: 'Login',     icon: LogIn },
  { to: '/register',  label: 'Register',  icon: UserPlus },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat',      label: 'AI Chat',   icon: MessageSquare },
  { to: '/profile',   label: 'Profile',   icon: User },
];

export default function NavigationDrawer({ open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    clearCurrentUser();
    setOpen(false);
    navigate('/login');
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close drawer"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm cursor-default"
        />
      )}

      {/* Drawer */}
      <aside className={`fixed left-0 top-0 z-[70] h-screen w-[280px] bg-[#0a1525] border-r border-white/8 shadow-2xl shadow-black/50 transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">

          {/* Header */}
          <div className="p-5 pt-7 border-b border-white/6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 p-[1.5px] shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                  <div className="w-full h-full bg-[#060e1a] rounded-[10px] flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-teal-400" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">DaffoTrack AI</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-teal-400">by Metamorph X</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-xl border border-white/8 bg-white/4 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/15 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User badge */}
            <div className="mt-4 bg-white/3 border border-white/6 rounded-xl p-3.5">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-2">Logged in as</p>
              <p className="text-sm font-bold text-white truncate">
                {currentUser?.studentName || currentUser?.fullName || 'Guest DIU Student'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                {currentUser?.studentId || '221-15-XXXX'}
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <p className="text-[9px] uppercase tracking-widest text-slate-600 px-2 mb-2 font-bold">Navigation</p>
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/4 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/6 space-y-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/15"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            <p className="text-[9px] text-center text-slate-600 tracking-wider">
              DaffoTrack AI • Metamorph X © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
