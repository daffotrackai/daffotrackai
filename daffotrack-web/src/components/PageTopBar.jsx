import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, User as UserIcon, LogOut, IdCard, Sun, Moon } from 'lucide-react';
import UserAvatar from './UserAvatar';
import useCurrentUserProfile from '../lib/useCurrentUserProfile';
import { clearCurrentUser, hasCurrentUserSession } from '../lib/session';
import { useTheme } from '../lib/ThemeContext';

export default function PageTopBar({
  title,
  subtitle,
  showBack = true,
  drawerOpen,
  setDrawerOpen,
}) {
  const navigate = useNavigate();
  const currentUser = useCurrentUserProfile();
  const hasSession = hasCurrentUserSession(currentUser);
  const { theme, toggleTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const closeTimerRef = useRef(null);

  const openProfileMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setProfileMenuOpen(true);
  };

  const closeProfileMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setProfileMenuOpen(false);
      closeTimerRef.current = null;
    }, 180);
  };

  const handleLogout = () => {
    clearCurrentUser();
    setProfileMenuOpen(false);
    navigate('/login');
  };

  return (
    <div 
      className={`fixed top-0 right-0 z-[55] h-16 border-b border-(--border-main) bg-(--bg-header) backdrop-blur-xl transition-all duration-300 ease-in-out ${
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
            className="w-10 h-10 rounded-xl border border-(--border-main) bg-(--bg-card) flex items-center justify-center text-(--text-muted) hover:text-(--text-main) hover:bg-(--bg-main) transition-all shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Title Area */}
          <div className="min-w-0 ml-1">
            <p className="truncate text-sm font-bold text-(--text-main)">{title}</p>
            {subtitle && <p className="truncate hidden md:block text-[10px] text-(--text-muted)">{subtitle}</p>}
          </div>
        </div>

        {/* Right Side: Icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl border border-(--border-main) bg-(--bg-card) flex items-center justify-center text-(--text-muted) hover:text-teal-400 hover:border-teal-500/20 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-xl border border-(--border-main) bg-(--bg-card) flex items-center justify-center text-(--text-muted) hover:text-teal-400 hover:border-teal-500/20 transition-all"
          >
            <Bell className="w-4 h-4" />
          </button>
          <div
            className="relative pb-3 -mb-3"
            onMouseEnter={openProfileMenu}
            onMouseLeave={closeProfileMenu}
            onFocus={openProfileMenu}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setProfileMenuOpen(false);
              }
            }}
          >
            <button
              type="button"
              onClick={() => setProfileMenuOpen((value) => !value)}
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              className="w-9 h-9 rounded-full border border-(--border-main) bg-(--bg-card) flex items-center justify-center text-(--text-muted) hover:text-teal-400 hover:border-teal-500/20 transition-all"
            >
              {currentUser?.profileImageUrl ? (
                <UserAvatar user={currentUser} size="sm" className="border-0 bg-transparent" />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
            </button>

            {profileMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1 w-64 rounded-2xl border border-(--border-main) bg-(--bg-card) p-3 shadow-2xl shadow-black/10"
              >
                {hasSession ? (
                  <>
                    <div className="flex items-center gap-3 rounded-xl bg-(--bg-main) p-3 border border-(--border-main)">
                      <UserAvatar user={currentUser} size="md" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-(--text-main)">{currentUser.fullName || 'Student'}</p>
                        <p className="mt-0.5 truncate text-[10px] text-(--text-muted)">{currentUser.studentId || 'DIU Portal'}</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <Link
                        to="/profile"
                        role="menuitem"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex w-full items-center gap-2 rounded-xl border border-(--border-main) bg-(--bg-main) px-3 py-2.5 text-sm font-semibold text-(--text-muted) transition-all hover:border-teal-500/25 hover:bg-teal-500/8 hover:text-(--text-main)"
                      >
                        <IdCard className="w-4 h-4 text-teal-400" />
                        My Profile
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl border border-red-500/15 bg-red-500/8 px-3 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/15"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/login"
                    role="menuitem"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 px-3 py-2.5 text-sm font-semibold text-teal-400 transition-all hover:bg-teal-500/20"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
