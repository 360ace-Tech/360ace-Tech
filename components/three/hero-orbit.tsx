'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

const ORBIT_DURATIONS = [26, 34, 42];

export function HeroOrbitScene() {
  const reduceMotion = useReducedMotion();

  const sparkles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 4,
      })),
    []
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.35),transparent_60%),linear-gradient(135deg,rgba(15,23,42,0.85),rgba(2,6,23,0.95))]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-32 w-32 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="absolute h-24 w-24 rounded-full bg-sky-400/40 blur-2xl" />
        <div className="absolute h-14 w-14 rounded-full bg-sky-300/80 shadow-[0_0_120px_rgba(56,189,248,0.6)]" />
      </div>

      {!reduceMotion && (
        <div className="absolute inset-0">
          {ORBIT_DURATIONS.map((duration, index) => (
            <motion.div
              key={duration}
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration, ease: 'linear', delay: index * 4 }}
            >
              <div
                className="absolute left-1/2 top-1/2 rounded-full border border-white/10"
                style={{
                  height: '140%',
                  width: '140%',
                  transform: `translate(-50%, -50%) rotate(${index * 8}deg)`,
                }}
              >
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.9)]"
                  style={{ height: 12, width: 12 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="absolute inset-0">
        {sparkles.map((sparkle) => (
          <motion.span
            key={sparkle.id}
            className="pointer-events-none absolute rounded-full bg-white/70"
            style={{ top: sparkle.top, left: sparkle.left, height: sparkle.size, width: sparkle.size }}
            animate={
              reduceMotion
                ? {}
                : {
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.6, 1],
                  }
            }
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: sparkle.delay }}
          />
        ))}
      </div>
    </div>
  );
}
