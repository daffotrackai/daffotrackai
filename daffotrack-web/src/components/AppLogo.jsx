import logo from '../assets/logo.png';

const sizeClasses = {
  sm: {
    outer: 'w-7 h-7 rounded-lg p-[1px]',
    inner: 'rounded-[7px]',
  },
  md: {
    outer: 'w-8 h-8 rounded-xl p-[1.5px]',
    inner: 'rounded-[10px]',
  },
  lg: {
    outer: 'w-9 h-9 rounded-xl p-[1.5px]',
    inner: 'rounded-[10px]',
  },
  xl: {
    outer: 'w-12 h-12 rounded-2xl p-[2px]',
    inner: 'rounded-[14px]',
  },
  '2xl': {
    outer: 'w-14 h-14 rounded-2xl p-[2px]',
    inner: 'rounded-[14px]',
  },
};

export default function AppLogo({ size = 'md', className = '' }) {
  const classes = sizeClasses[size] ?? sizeClasses.md;

  return (
    <div
      className={`${classes.outer} bg-gradient-to-br from-teal-400/80 to-teal-600/70 shadow-[0_0_20px_rgba(45,212,191,0.28)] shrink-0 ${className}`}
    >
      <div
        className={`relative w-full h-full overflow-hidden border border-teal-500/25 bg-[#060e1a] ${classes.inner}`}
      >
        <img
          src={logo}
          alt="DaffoTrack AI Logo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(160deg,rgba(0,210,185,0.08)_0%,transparent_60%)]" />
      </div>
    </div>
  );
}
