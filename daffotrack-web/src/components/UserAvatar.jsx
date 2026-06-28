import { User } from 'lucide-react';
import { buildApiUrl } from '../lib/api';

const sizeClasses = {
  sm: {
    wrapper: 'w-9 h-9',
    icon: 'w-4 h-4',
  },
  md: {
    wrapper: 'w-9 h-9',
    icon: 'w-4.5 h-4.5',
  },
};

function resolveImageUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) {
    return path;
  }

  return buildApiUrl(path);
}

export default function UserAvatar({ user, size = 'sm', className = '' }) {
  const classes = sizeClasses[size] ?? sizeClasses.sm;
  const hasActualImage = user?.hasProfileImage === true || user?.hasProfileImage === 'true';
  const imageUrl = hasActualImage ? resolveImageUrl(user?.profileImageUrl) : null;
  const isGuest = !user?.userId;

  return (
    <div
      className={`${classes.wrapper} rounded-full flex items-center justify-center overflow-hidden shrink-0 transition-all ${
        imageUrl
          ? 'bg-transparent border border-(--border-main)'
          : isGuest
            ? 'bg-slate-500/10 border border-slate-500/20 text-slate-400'
            : 'bg-teal-500/10 border border-teal-500/20 text-teal-400'
      } ${className}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={user?.fullName || 'User profile'}
          className="w-full h-full object-cover"
        />
      ) : (
        <User className={classes.icon} />
      )}
    </div>
  );
}
