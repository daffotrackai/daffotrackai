import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { getCurrentUser, hasCurrentUserSession } from '../lib/session';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentUser = getCurrentUser();
      navigate(hasCurrentUserSession(currentUser) ? '/dashboard' : '/login', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-(--bg-main)"
      style={{ zIndex: 9999 }}
    >
      {/* ── Background glows ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 520, height: 320,
          background: 'radial-gradient(ellipse at center, rgba(0,210,185,0.11) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 pointer-events-none rounded-full"
        style={{
          width: 360, height: 360,
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(0,210,185,0.07) 0%, transparent 65%)',
          animation: 'breathe 5s ease-in-out infinite',
        }}
      />

      {/* ── Orbital rings ── */}
      <OrbitalRing size={290} duration={22} />
      <OrbitalRing size={215} duration={16} reverse />

      {/* ── Main content ── */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        {/* Logo */}
        <div
          className="relative flex items-center justify-center mb-7"
          style={{ animation: 'logoIn 1.1s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          {/* Atmospheric glow */}
          <div
            className="absolute rounded-[28px] pointer-events-none"
            style={{
              inset: -20,
              background: 'radial-gradient(ellipse at center, rgba(0,210,185,0.22) 0%, transparent 65%)',
              filter: 'blur(20px)',
              animation: 'breathe 4s ease-in-out infinite',
            }}
          />

          {/* Pulse ring */}
          <div
            className="absolute rounded-[28px] pointer-events-none"
            style={{
              inset: -4,
              border: '1px solid rgba(0,210,185,0.18)',
              animation: 'ringPulse 3s ease-in-out infinite',
            }}
          />

          {/* Logo box — image fills the entire box */}
          <div
            className="relative w-[108px] h-[108px] rounded-[28px] overflow-hidden"
            style={{
              border: '1px solid rgba(0,210,185,0.28)',
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.04),
                0 20px 60px rgba(0,0,0,0.7),
                0 0 40px rgba(0,210,185,0.10),
                inset 0 1px 0 rgba(255,255,255,0.08)
              `,
            }}
          >
            {/* Logo image — fills full box */}
            <img
              src={logo}
              alt="DaffoTrack AI Logo"
              className="w-full h-full object-cover"
            />

            {/* Subtle teal overlay on top of image */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(160deg, rgba(0,210,185,0.06) 0%, transparent 60%)',
              }}
            />

            {/* Top-edge shimmer */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: 0, left: '8%', right: '8%', height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(0,255,220,0.5), transparent)',
                borderRadius: '50%',
              }}
            />
          </div>
        </div>

        {/* App name */}
        <div
          className="flex flex-col items-center text-center"
          style={{ animation: 'fadeUp 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          <h1
            className="font-extrabold leading-none"
            style={{ fontSize: 52, letterSpacing: '-0.03em', color: '#fff' }}
          >
            DaffoTrack
            <span
              style={{
                background: 'linear-gradient(135deg, #00ffe0 0%, #00c8b4 60%, #00a090 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {' '}Ai
            </span>
          </h1>

          {/* Divider */}
          <div
            className="flex items-center gap-2.5 mt-4"
            style={{ animation: 'fadeIn 0.8s 0.45s both' }}
          >
            <div style={{ height: 1, width: 36, background: 'linear-gradient(90deg, transparent, rgba(0,210,185,0.45), transparent)' }} />
            <div className="relative" style={{ width: 6, height: 6 }}>
              <div
                className="rounded-full"
                style={{
                  width: 6, height: 6,
                  background: '#00d8be',
                  boxShadow: '0 0 10px rgba(0,210,185,0.8)',
                }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'rgba(0,210,185,0.3)',
                  animation: 'dotPulse 2.2s ease-out infinite',
                }}
              />
            </div>
            <div style={{ height: 1, width: 36, background: 'linear-gradient(90deg, rgba(0,210,185,0.45), transparent)' }} />
          </div>

          <p
            className="mt-3 font-medium"
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              animation: 'fadeIn 0.8s 0.6s both',
            }}
          >
            Intelligent Fleet Intelligence
          </p>
        </div>

        {/* Loading bar */}
        <div
          style={{
            marginTop: 36,
            width: 160,
            animation: 'fadeIn 0.8s 0.8s both',
          }}
        >
          <div
            style={{
              height: 2,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0,
                height: '100%',
                width: '40%',
                background: 'linear-gradient(90deg, #00b8a4, #00ffe0, #00b8a4)',
                borderRadius: 2,
                boxShadow: '0 0 12px rgba(0,210,185,0.7)',
                animation: 'barMove 1.8s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="absolute bottom-8 flex flex-col items-center gap-1"
        style={{ animation: 'fadeIn 1s 1s both' }}
      >
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          Developed by
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 600 }}>
          Metamorph-X
        </p>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.6; transform: translate(-50%,-50%) scale(1); }
          50%       { opacity: 1;   transform: translate(-50%,-50%) scale(1.09); }
        }
        @keyframes spin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoIn {
          0%   { opacity: 0; transform: scale(0.82) translateY(16px); }
          65%  { transform: scale(1.03) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dotPulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes barMove {
          0%   { transform: translateX(-120%); }
          50%  { transform: translateX(80%); }
          100% { transform: translateX(280%); }
        }
        @keyframes ringPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%      { opacity: 0.7; transform: scale(1.03); }
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ── */

function OrbitalRing({ size, duration, reverse = false }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        top: '50%', left: '50%',
        width: size, height: size,
        border: '0.5px solid rgba(0,210,185,0.11)',
        transform: 'translate(-50%,-50%)',
        animation: `spin ${duration}s linear infinite${reverse ? ' reverse' : ''}`,
      }}
    />
  );
}
