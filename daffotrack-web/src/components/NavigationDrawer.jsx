import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Cpu, Home, LogIn, UserPlus, LayoutDashboard, MessageSquare, User, LogOut } from 'lucide-react';
import { clearCurrentUser, getCurrentUser } from '../lib/session';

export default function NavigationDrawer({ open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    clearCurrentUser();
    setOpen(false);
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/login', label: 'Login', icon: LogIn },
    { to: '/register', label: 'Register', icon: UserPlus },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/chat', label: 'Chat', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed left-4 top-4 z-[80] inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1E3A5F] bg-[#13253F] text-[#00E5FF] shadow-2xl shadow-black/25 transition-transform hover:scale-105"
        aria-label={open ? 'Close navigation drawer' : 'Open navigation drawer'}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <button
          type="button"
          aria-label="Close navigation backdrop"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] cursor-default bg-black/50 backdrop-blur-[2px]"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-[70] h-screen w-[290px] border-r border-[#1E3A5F] bg-[#13253F] shadow-2xl shadow-black/35 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-[#1E3A5F] p-6 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00E5FF] to-blue-600 p-[2px]">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0B1A30]">
                  <Cpu className="h-5 w-5 text-[#00E5FF]" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white">DaffoTrack AI</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#00E5FF]">by Metamorph X</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#1E3A5F] bg-[#0B1A30]/70 p-4">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Current User</p>
              <p className="mt-2 text-sm font-semibold text-white">{currentUser?.studentName || currentUser?.fullName || 'Guest DIU Student'}</p>
              <p className="mt-1 text-xs text-slate-400">{currentUser?.studentId || '221-15-XXXX'}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${active ? 'border-[#00E5FF]/25 bg-[#0B1A30] text-[#00E5FF]' : 'border-transparent text-slate-300 hover:border-[#1E3A5F] hover:bg-[#0B1A30]/70 hover:text-white'}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-[#1E3A5F] p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition-all hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}