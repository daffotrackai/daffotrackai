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
  const imageUrl = resolveImageUrl(user?.profileImageUrl);

  return (
    <div
      className={`${classes.wrapper} rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 overflow-hidden shrink-0 ${className}`}
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
