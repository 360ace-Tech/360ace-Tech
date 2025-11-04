'use client';

import { useMemo } from 'react';
import { useTheme } from 'next-themes';

const ORBIT_DURATIONS = [22, 30, 38, 46];

export function HeroOrbitScene() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const sparkles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1.5,
        delay: Math.random() * 4,
      })),
    []
  );

  const comets = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const angle = (Math.random() * 50 - 25).toFixed(1);
        return {
          id: i,
          delay: Math.random() * 6,
          duration: 3.6 + Math.random() * 3.8,
          top: `${Math.random() * 90 + 5}%`,
          angle,
          size: 1.8 + Math.random() * 1.2,
          length: 100 + Math.random() * 220,
          dir: Math.random() > 0.5 ? 1 : -1,
        };
      }),
    []
  );

  const NODE_COUNT = 14;
  const nodeAngles = useMemo(() => Array.from({ length: NODE_COUNT }, (_, i) => (360 / NODE_COUNT) * i), []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes comet {
          0% { transform: translateX(-100vw); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .sparkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .comet {
          animation: comet linear infinite;
        }
        .orbit-ring {
          animation: orbit linear infinite;
        }
      `}</style>

      {/* Aurora background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isLight
            ? 'radial-gradient(circle at 20% 20%, hsl(var(--muted) / 0.25), transparent 55%), radial-gradient(circle at 80% 30%, hsl(var(--muted) / 0.2), transparent 60%), linear-gradient(135deg, hsl(var(--background)), hsl(var(--background)))'
            : 'radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.35), transparent 55%), radial-gradient(circle at 80% 30%, hsl(var(--secondary) / 0.35), transparent 60%), linear-gradient(135deg, hsl(var(--background) / 0.9), hsl(var(--background) / 0.96))',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle absolute rounded-full"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: isLight ? 'hsl(var(--primary))' : 'hsl(var(--accent))',
            animationDelay: `${sparkle.delay}s`,
            opacity: 0.2,
          }}
        />
      ))}

      {/* Comets */}
      {comets.map((comet) => (
        <div
          key={comet.id}
          className="comet absolute"
          style={{
            top: comet.top,
            left: '-10%',
            width: `${comet.length}px`,
            height: `${comet.size}px`,
            background: isLight
              ? 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), transparent)'
              : 'linear-gradient(90deg, transparent, hsl(var(--accent) / 0.6), transparent)',
            transform: `rotate(${comet.angle}deg)`,
            animationDuration: `${comet.duration}s`,
            animationDelay: `${comet.delay}s`,
            borderRadius: '50%',
          }}
        />
      ))}

      {/* Orbit rings */}
      {ORBIT_DURATIONS.map((duration, orbitIndex) => (
        <div
          key={orbitIndex}
          className="orbit-ring absolute inset-0 flex items-center justify-center"
          style={{
            animationDuration: `${duration}s`,
          }}
        >
          <div
            className="rounded-full border"
            style={{
              width: `${180 + orbitIndex * 60}px`,
              height: `${180 + orbitIndex * 60}px`,
              borderColor: isLight ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--accent) / 0.15)',
              borderWidth: '1px',
            }}
          >
            {nodeAngles.slice(0, 3 + orbitIndex).map((angle, nodeIndex) => (
              <div
                key={nodeIndex}
                className="absolute rounded-full"
                style={{
                  width: '4px',
                  height: '4px',
                  backgroundColor: isLight ? 'hsl(var(--primary))' : 'hsl(var(--accent))',
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translateX(${90 + orbitIndex * 30}px) translateY(-50%)`,
                  boxShadow: isLight
                    ? '0 0 4px hsl(var(--primary) / 0.5)'
                    : '0 0 8px hsl(var(--accent) / 0.8)',
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Core cloud */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10">
          <svg
            width="220"
            height="150"
            viewBox="0 0 160 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={isLight ? 'drop-shadow-[0_2px_6px_rgba(59,130,246,0.25)]' : 'drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]'}
          >
            <defs>
              <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={isLight ? 'rgba(2,6,23,0.82)' : 'hsl(var(--primary) / 0.95)'} />
                <stop offset="100%" stopColor={isLight ? 'rgba(2,6,23,0.74)' : 'hsl(var(--accent) / 0.90)'} />
              </linearGradient>
            </defs>
            <path
              d="M115 47c0-17-14-31-31-31-15 0-27 10-30 24-10 1-18 10-18 20 0 12 10 22 22 22h68c12 0 22-10 22-22s-10-22-22-22h-1z"
              fill={isLight ? 'white' : 'url(#cloudGrad)'}
            />
            <path
              d="M115 47c0-17-14-31-31-31-15 0-27 10-30 24-10 1-18 10-18 20 0 12 10 22 22 22h68c12 0 22-10 22-22s-10-22-22-22h-1z"
              fill="none"
              stroke={isLight ? 'hsl(var(--primary))' : 'transparent'}
              strokeOpacity={isLight ? 0.7 : 0}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M55 60c3-10 13-17 24-17 9 0 17 4 22 10" stroke="white" strokeOpacity={isLight ? 0.45 : 0.35} strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
