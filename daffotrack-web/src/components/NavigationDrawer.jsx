import { NavLink, useNavigate } from 'react-router-dom';
import { Home, LogIn, UserPlus, LayoutDashboard, MessageSquare, User, LogOut, X, BookOpenCheck, Calculator, FileText } from 'lucide-react';
import { clearCurrentUser, hasCurrentUserSession } from '../lib/session';
import useCurrentUserProfile from '../lib/useCurrentUserProfile';
import AppLogo from './AppLogo';
import UserAvatar from './UserAvatar';

const NAV_ITEMS = [
  { to: '/home',      label: 'Home',      icon: Home,            access: 'public' },
  { to: '/login',     label: 'Login',     icon: LogIn,           access: 'guest' },
  { to: '/register',  label: 'Register',  icon: UserPlus,        access: 'guest' },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, access: 'auth' },
  { to: '/courses',   label: 'Courses',   icon: BookOpenCheck,   access: 'auth' },
  { to: '/planner',   label: 'Planner',   icon: Calculator,      access: 'auth' },
  { to: '/chat',      label: 'AI Chat',   icon: MessageSquare,   access: 'auth' },
  { to: '/policies',  label: 'Policies',  icon: FileText,        access: 'auth' },
  { to: '/profile',   label: 'Profile',   icon: User,            access: 'auth' },
];

export default function NavigationDrawer({ open, setOpen }) {
  const navigate = useNavigate();
  const currentUser = useCurrentUserProfile();
  const isLoggedIn = hasCurrentUserSession(currentUser);
  const visibleNavItems = NAV_ITEMS.filter(({ access, label }) => {
    if (label === 'Home' && isLoggedIn) return false;
    if (access === 'public') return true;
    if (access === 'auth') return isLoggedIn;
    if (access === 'guest') return !isLoggedIn;
    return false;
  });

  const handleLogout = () => {
    clearCurrentUser();
    setOpen(false);
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop: শুধু মোবাইলেই ড্রয়ার ওপেন হলে কালো ব্যাকগ্রাউন্ড আসবে */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] bg-[#060e1a]/80 backdrop-blur-sm lg:hidden cursor-pointer transition-opacity"
        />
      )}

      {/* Drawer / Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-[70] h-screen w-[280px] flex flex-col bg-(--bg-card) border-r border-(--border-main) transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-(--border-main)">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(isLoggedIn ? '/dashboard' : '/home')}>
            <AppLogo size="md" />
            <div>
              <span className="font-bold text-(--text-main) text-sm">DaffoTrack AI</span>
              <span className="block text-[9px] text-teal-400 font-semibold uppercase tracking-widest">by Metamorph X</span>
            </div>
          </div>

          {/* Close button for Mobile only */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Card (If logged in) */}
        {isLoggedIn && (
          <div className="p-4 border-b border-(--border-main) bg-white/2">
            <div className="flex items-center gap-3">
              <UserAvatar user={currentUser} size="md" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-(--text-main) truncate">{currentUser.fullName || 'Student'}</p>
                <p className="text-[10px] text-(--text-muted)">{currentUser.studentId || 'DIU Portal'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {visibleNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20'
                  : 'text-(--text-muted) hover:text-teal-500 hover:bg-teal-500/5 border border-transparent'
              }`}
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-4 h-4" />
                  {label}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_5px_#2dd4bf]" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-(--border-main) space-y-3">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/15"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-teal-500/20 bg-teal-500/10 px-4 py-2.5 text-sm font-semibold text-teal-400 transition-all hover:bg-teal-500/20"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
          <p className="text-[9px] text-center text-slate-600 tracking-wider">VERSION 4.0.0</p>
        </div>
      </aside>
    </>
  );
}
