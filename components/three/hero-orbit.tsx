'use client';

import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';

const ORBIT_DURATIONS = [22, 30, 38, 46];

export function HeroOrbitScene() {
  const reduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme !== 'dark';
  // Glow palette used for light-mode moving elements
  const glowColor = 'rgba(186,230,253,0.95)';
  // const glowMid = 'rgba(186,230,253,0.8)';
  // const glowSoft = 'rgba(186,230,253,0.6)';
  const glowShadow = '0 0 12px rgba(56,189,248,0.9)';

  // Pointer parallax for subtle 3D tilt
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useTransform(my, [0, 1], [8, -8]);
  const rotY = useTransform(mx, [0, 1], [-10, 10]);
  const scale = useTransform(mx, [0, 1], [0.99, 1.01]);
  // Parallax layers
  const xFar = useTransform(mx, [0, 1], [4, -4]);
  const yFar = useTransform(my, [0, 1], [3, -3]);
  const xMid = useTransform(mx, [0, 1], [8, -8]);
  const yMid = useTransform(my, [0, 1], [6, -6]);
  const xNear = useTransform(mx, [0, 1], [14, -14]);
  const yNear = useTransform(my, [0, 1], [10, -10]);

  const rootRef = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

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
  const [farSparkles, midSparkles, nearSparkles] = useMemo(() => {
    const far = sparkles.filter((_, i) => i % 3 === 0);
    const mid = sparkles.filter((_, i) => i % 3 === 1);
    const near = sparkles.filter((_, i) => i % 3 === 2);
    return [far, mid, near];
  }, [sparkles]);

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

  const streaks = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const angle = (Math.random() * 40 - 20).toFixed(1);
        return {
          id: i,
          delay: Math.random() * 8,
          duration: 8 + Math.random() * 8,
          top: `${Math.random() * 100}%`,
          angle,
          thickness: 1,
          length: 140 + Math.random() * 260,
          dir: Math.random() > 0.5 ? 1 : -1,
          opacity: 0.10 + Math.random() * 0.15,
          nodeSpeed: 3.6 + Math.random() * 3.2,
        };
      }),
    []
  );

  return (
    <motion.div
      ref={rootRef}
      onMouseMove={!reduceMotion ? onMove : undefined}
      onMouseLeave={!reduceMotion ? onLeave : undefined}
      style={!reduceMotion ? { perspective: 1000 } : undefined}
      className="relative h-full w-full overflow-hidden"
    >
      {/* Aurora background */}
      <motion.div
        className="absolute inset-0"
        animate={!reduceMotion ? { backgroundPosition: ['0% 0%', '100% 100%'] } : undefined}
        transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
        style={{
          backgroundImage: isLight
            ? 'radial-gradient(circle at 20% 20%, hsl(var(--muted) / 0.25), transparent 55%), radial-gradient(circle at 80% 30%, hsl(var(--muted) / 0.2), transparent 60%), linear-gradient(135deg, hsl(var(--background)), hsl(var(--background)))'
            : 'radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.35), transparent 55%), radial-gradient(circle at 80% 30%, hsl(var(--secondary) / 0.35), transparent 60%), linear-gradient(135deg, hsl(var(--background) / 0.9), hsl(var(--background) / 0.96))',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Core cloud */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={!reduceMotion ? { rotateX: rotX, rotateY: rotY, scale } : undefined}
      >
        <motion.div
          animate={!reduceMotion ? { y: [-2, 2, -2], scale: [1, 1.01, 1] } : undefined}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="relative"
        >
          {/* Cloud glows removed in light mode for contrast */}
          {/* Cloud shape (SVG) */}
          <motion.svg
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
            {/* Outline for light mode to separate cloud from background */}
            <path
              d="M115 47c0-17-14-31-31-31-15 0-27 10-30 24-10 1-18 10-18 20 0 12 10 22 22 22h68c12 0 22-10 22-22s-10-22-22-22h-1z"
              fill="none"
              stroke={isLight ? 'hsl(var(--primary))' : 'transparent'}
              strokeOpacity={isLight ? 0.7 : 0}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* No white overlay in light mode now (darker cloud) */}
            {/* subtle highlight */}
            <path d="M55 60c3-10 13-17 24-17 9 0 17 4 22 10" stroke="white" strokeOpacity={isLight ? 0.45 : 0.35} strokeWidth="3" strokeLinecap="round" />
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* Orbits with multiple packets */}
      {!reduceMotion && (
        <motion.div className="absolute inset-0" style={{ rotateX: rotX, rotateY: rotY, scale }}>
          {ORBIT_DURATIONS.map((duration, index) => (
            <motion.div
              key={duration}
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration, ease: 'linear', delay: index * 3 }}
            >
              <div
                className="absolute left-1/2 top-1/2 rounded-full border"
                style={{
                  height: `${120 + index * 14}%`,
                  width: `${120 + index * 14}%`,
                  transform: `translate(-50%, -50%) rotate(${index * 10}deg)`,
                  borderColor: isLight ? 'hsl(var(--primary) / 0.25)' : 'rgba(255,255,255,0.1)',
                }}
              >
                {[0, 120, 240].map((a) => (
                  <div key={a} className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%, -50%) rotate(${a}deg) translate(0, -50%)` }}>
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: isLight ? 'hsl(var(--primary))' : 'rgba(186,230,253,0.95)',
                        boxShadow: isLight ? '0 0 8px hsl(var(--primary) / 0.35)' : '0 0 12px rgba(56,189,248,0.9)',
                      }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Neural network spokes + nodes */}
      {!reduceMotion && (
        <motion.div className="absolute inset-0" style={{ x: xMid, y: yMid }}>
          <div
            className="absolute left-1/2 top-1/2"
            style={{ height: '130%', width: '130%', transform: 'translate(-50%, -50%)' }}
          >
            {nodeAngles.map((ang, i) => (
              <div key={`ng-${i}`} className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%, -50%) rotate(' + ang + 'deg)' }}>
                {/* spoke */}
                <span
      	          className="block origin-left"
                  style={{
                    width: '40%',
                    height: 1,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.55) 60%, rgba(56,189,248,0.8) 100%)',
                    opacity: 0.5,
                  }}
                />
                {/* node */}
                <motion.span
                  className="absolute left-[40%] top-1/2 -translate-y-1/2 rounded-full bg-white"
                  style={{ width: 6, height: 6, boxShadow: '0 0 12px rgba(56,189,248,0.7)' }}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2.6 + (i % 5) * 0.2, ease: 'easeInOut', delay: (i % 7) * 0.1 }}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Sparkles with parallax layers */}
      <motion.div className="absolute inset-0" style={!reduceMotion ? { x: xFar, y: yFar } : undefined}>
        {farSparkles.map((s) => (
          <motion.span
            key={`far-${s.id}`}
            className="pointer-events-none absolute rounded-full"
            style={{
              top: s.top,
              left: s.left,
              height: s.size,
              width: s.size,
              backgroundColor: isLight ? 'hsl(var(--primary) / 0.55)' : 'rgba(255,255,255,0.6)',
            }}
            animate={reduceMotion ? {} : { opacity: [0.15, 0.7, 0.15], scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 5.6, ease: 'easeInOut', delay: s.delay }}
          />
        ))}
      </motion.div>
      <motion.div className="absolute inset-0" style={!reduceMotion ? { x: xMid, y: yMid } : undefined}>
        {midSparkles.map((s) => (
          <motion.span
            key={`mid-${s.id}`}
            className="pointer-events-none absolute rounded-full"
            style={{
              top: s.top,
              left: s.left,
              height: s.size + 0.5,
              width: s.size + 0.5,
              backgroundColor: isLight ? 'hsl(var(--primary) / 0.7)' : 'rgba(255,255,255,0.7)',
            }}
            animate={reduceMotion ? {} : { opacity: [0.2, 0.9, 0.2], scale: [1, 1.6, 1] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: s.delay }}
          />
        ))}
      </motion.div>
      <motion.div className="absolute inset-0" style={!reduceMotion ? { x: xNear, y: yNear } : undefined}>
        {nearSparkles.map((s) => (
          <motion.span
            key={`near-${s.id}`}
            className="pointer-events-none absolute rounded-full"
            style={{
              top: s.top,
              left: s.left,
              height: s.size + 1,
              width: s.size + 1,
              backgroundColor: isLight ? 'hsl(var(--primary))' : 'rgba(255,255,255,1)',
            }}
            animate={reduceMotion ? {} : { opacity: [0.25, 1, 0.25], scale: [1, 1.8, 1] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: s.delay }}
          />
        ))}
      </motion.div>

      {/* Light sweep beams */}
      {!reduceMotion && (
        <>
          <motion.div
            className={isLight ? 'pointer-events-none absolute -left-1/5 top-1/5 h-2/3 w-1/3 -rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent' : 'pointer-events-none absolute -left-1/5 top-1/5 h-2/3 w-1/3 -rotate-12 bg-gradient-to-r from-transparent via-white/15 to-transparent blur-sm'}
            animate={{ x: ['-20%', '120%'] }}
            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 0.8 }}
          />
          <motion.div
            className={isLight ? 'pointer-events-none absolute left-0 top-0 h-2/3 w-1/4 rotate-6 bg-gradient-to-r from-transparent via-primary/25 to-transparent' : 'pointer-events-none absolute left-0 top-0 h-2/3 w-1/4 rotate-6 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-[2px]'}
            animate={{ x: ['-30%', '110%'] }}
            transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut', delay: 2.2 }}
          />
        </>
      )}

      {/* Streaks (faint moving lines) with moving nodes */}
      {!reduceMotion && (
        <div className="absolute inset-0" style={{ zIndex: 5 }}>
          {streaks.map((s) => (
            <motion.div
              key={`st-${s.id}`}
              className="pointer-events-none absolute"
              style={{ top: s.top, left: s.dir === 1 ? '-25%' : '125%', transform: `rotate(${s.angle}deg)` }}
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: s.dir === 1 ? '170%' : '-170%', opacity: [0, 1, 0.85, 0] }}
              transition={{ repeat: Infinity, duration: s.duration, ease: 'easeOut', delay: s.delay }}
            >
              <span
                className="block"
                style={{
                  width: s.length,
                  height: isLight ? 2 : s.thickness,
                  background: isLight
                    ? 'linear-gradient(to left, transparent, hsl(var(--primary) / 0.6), hsl(var(--primary)))'
                    : 'linear-gradient(to left, transparent, hsl(var(--muted) / 0.6), hsl(var(--primary)))',
                  opacity: isLight ? Math.min(1, s.opacity + 0.15) : s.opacity,
                }}
              />
              {isLight && (
                <span
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    left: '25%',
                    width: '35%',
                    height: 1,
                    background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.6), transparent)',
                  }}
                />
              )}
              {/* moving node along the line */}
              <motion.span
                className="absolute top-1/2 -translate-y-1/2 rounded-full"
                style={{ height: 6, width: 6, backgroundColor: isLight ? 'hsl(var(--primary))' : glowColor, boxShadow: isLight ? '0 0 8px hsl(var(--primary) / 0.35)' : glowShadow }}
                initial={{ x: '-10%' }}
                animate={{ x: '110%' }}
                transition={{ repeat: Infinity, duration: s.nodeSpeed, ease: 'linear', delay: s.delay + 0.4 }}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Comets (brighter, longer, across full width) */}
      {!reduceMotion && (
        <div className="absolute inset-0">
          {comets.map((c) => (
            <motion.div
              key={`cm-${c.id}`}
              className="pointer-events-none absolute"
              style={{
                top: c.top,
                left: c.dir === 1 ? '-25%' : '125%',
                width: c.length,
                height: isLight ? Math.max(2.5, c.size + 1) : c.size,
                transform: `rotate(${c.angle}deg)`,
              }}
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: c.dir === 1 ? '170%' : '-170%', opacity: [0, 1, 0.9, 0] }}
              transition={{ repeat: Infinity, duration: c.duration, ease: 'easeOut', delay: c.delay }}
            >
              {/* comet body */}
              <span
                className="block h-full"
                style={{
                  width: '100%',
                  background: isLight
                    ? 'linear-gradient(to left, transparent, hsl(var(--primary) / 0.8), hsl(var(--primary)))'
                    : 'linear-gradient(to left, transparent, hsl(var(--primary) / 0.8), hsl(var(--primary)))',
                  boxShadow: isLight ? '0 0 10px hsl(var(--primary) / 0.35)' : '0 0 16px hsla(var(--primary) / 0.6)',
                }}
              />
              {isLight && (
                <span
                  className="pointer-events-none absolute top-1/2 -translate-y-1/2"
                  style={{
                    right: '20%',
                    width: '30%',
                    height: Math.max(1, (c.size - 0.5)),
                    background: 'linear-gradient(to left, rgba(255,255,255,0.7), rgba(255,255,255,0))',
                    filter: 'blur(0.2px)',
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Subtle grain overlay removed per request */}
    </motion.div>
  );
}
