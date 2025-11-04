"use client";

import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

function useCountdown(target?: string) {
  const targetMs = useMemo(() => (target ? Date.parse(target) : Date.now() + 7 * 24 * 3600 * 1000), [target]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const d = Math.floor(diff / (24 * 3600 * 1000));
  const h = Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000));
  const m = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
  const s = Math.floor((diff % (60 * 1000)) / 1000);
  return { d, h, m, s };
}

export function UnderConstruction() {
  const { d, h, m, s } = useCountdown(process.env.NEXT_PUBLIC_REOPEN_AT);
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Pointer‑parallax values for subtle 3D feeling
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useTransform(my, [0, 1], [8, -8]);
  const rotY = useTransform(mx, [0, 1], [-10, 10]);
  const tFarX = useTransform(mx, [0, 1], [12, -12]);
  const tFarY = useTransform(my, [0, 1], [8, -8]);
  const tNearX = useTransform(mx, [0, 1], [24, -24]);
  const tNearY = useTransform(my, [0, 1], [16, -16]);

  type Comet = { id: number; delay: number; duration: number; top: string; angle: string; dir: 1 | -1 };
  type Cloud = { id: number; top: number; left: number; scale: number; delay: number; layer: 'near' | 'far'; amp: number; dir: 1 | -1 };
  const [comets, setComets] = useState<Comet[]>([]);

  // Generate a few floating clouds with spacing rules (not center, not close)
  const [clouds, setClouds] = useState<Cloud[]>([]);

  useEffect(() => {
    // Generate client-only to avoid hydration mismatch
    const cs: Comet[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      delay: Math.random() * 6,
      duration: 5 + Math.random() * 7,
      top: `${10 + Math.random() * 80}%`,
      angle: (Math.random() * 30 - 15).toFixed(1),
      dir: Math.random() > 0.5 ? 1 : -1,
    }));
    setComets(cs);

    const placed: Cloud[] = [];
    const count = 10; // even more clouds
    const minDist = 15;
    const minCenter = 25;
    let tries = 0;
    while (placed.length < count && tries < 400) {
      tries++;
      const top = 10 + Math.random() * 70;
      const left = 5 + Math.random() * 80;
      const distCenter = Math.hypot(left - 50, top - 50);
      if (distCenter < minCenter) continue;
      let ok = true;
      for (const p of placed) {
        const d = Math.hypot(left - p.left, top - p.top);
        if (d < minDist) { ok = false; break; }
      }
      if (!ok) continue;
      const layer = Math.random() > 0.5 ? 'near' : 'far';
      const amp = layer === 'near' ? 22 + Math.random() * 10 : 12 + Math.random() * 8; // in vw
      placed.push({ id: placed.length, top, left, scale: 0.45 + Math.random() * 0.55, delay: Math.random() * 2, layer, amp, dir: Math.random() > 0.5 ? 1 : -1 });
    }
    setClouds(placed);
  }, []);

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background"
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mx.set((e.clientX - rect.left) / rect.width);
        my.set((e.clientY - rect.top) / rect.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      {/* animated background */}
      <motion.div
        className="absolute inset-0"
        animate={reduceMotion ? undefined : { backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, hsl(var(--primary)/0.15), transparent 55%), radial-gradient(circle at 80% 30%, hsl(var(--secondary)/0.15), transparent 60%), linear-gradient(135deg, hsl(var(--background)), hsl(var(--background)))',
          backgroundSize: '200% 200%'
        }}
      />

      {/* floating 3D orbs (interactive) */}
      <motion.div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-primary/25 blur-2xl" style={reduceMotion ? undefined : { x: tFarX, y: tFarY }} />
      <motion.div className="pointer-events-none absolute right-0 bottom-16 h-44 w-44 rounded-full bg-secondary/25 blur-2xl" style={reduceMotion ? undefined : { x: tFarX, y: tFarY }} />
      <motion.div className="pointer-events-none absolute left-1/3 top-1/4 h-20 w-20 rounded-full bg-accent/40 shadow-[0_0_80px_hsl(var(--accent)/0.6)]" style={reduceMotion ? undefined : { x: tNearX, y: tNearY }} />

      {/* Decorative clouds */}
      {!reduceMotion && mounted && (
        <div className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }}>
          {clouds.map((c) => (
            <motion.svg
              key={c.id}
              width={180}
              height={120}
              viewBox="0 0 160 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute"
              style={{
                top: `${c.top}%`,
                left: `${c.left}%`,
                filter: 'drop-shadow(0 0 18px hsl(var(--primary) / 0.55))',
                scale: c.scale,
              }}
              initial={{ x: 0, opacity: 0.92, rotate: 0 }}
              animate={{ x: [ -c.amp * c.dir + 'vw', c.amp * c.dir + 'vw', -c.amp * c.dir + 'vw' ], opacity: 0.95, rotate: [0, 1.2, 0] }}
              transition={{ repeat: Infinity, duration: (c.layer === 'near' ? 16 : 22) + c.delay, ease: 'easeInOut', delay: c.delay }}
            >
              <path d="M115 47c0-17-14-31-31-31-15 0-27 10-30 24-10 1-18 10-18 20 0 12 10 22 22 22h68c12 0 22-10 22-22s-10-22-22-22h-1z" fill="hsl(var(--primary) / 0.25)" />
              <path d="M115 47c0-17-14-31-31-31-15 0-27 10-30 24-10 1-18 10-18 20 0 12 10 22 22 22h68c12 0 22-10 22-22s-10-22-22-22h-1z" stroke="hsl(var(--primary))" strokeOpacity={0.85} strokeWidth={2} strokeLinejoin="round" />
            </motion.svg>
          ))}
        </div>
      )}

      {/* comet sweeps */}
      {mounted && (
        <div className="pointer-events-none absolute inset-0" style={{ zIndex: 4 }}>
          {comets.map((c) => (
            <motion.span
              key={c.id}
              className="absolute"
              style={{
                top: c.top,
                width: 220,
                height: 4,
                transform: 'none',
                background: 'linear-gradient(to left, transparent, hsl(var(--primary) / 0.85), hsl(var(--primary)))',
                boxShadow: '0 0 20px hsl(var(--primary) / 0.6)'
              }}
              initial={{ left: c.dir === 1 ? '-20%' : '120%', opacity: 0 }}
              animate={{ left: c.dir === 1 ? (reduceMotion ? '40%' : '120%') : (reduceMotion ? '60%' : '-20%'), opacity: [0, 1, 0.85, 0] }}
              transition={{ repeat: Infinity, duration: c.duration, ease: 'easeOut', delay: c.delay }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <motion.div style={reduceMotion ? undefined : { rotateX: rotX, rotateY: rotY }}>
          <motion.h1 className="text-4xl font-semibold sm:text-5xl" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            We’re making improvements
          </motion.h1>
          <motion.p className="mt-3 text-muted-foreground" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
            Our site is undergoing scheduled maintenance. We’ll be back soon.
          </motion.p>
          <motion.div className="mt-8 grid grid-cols-4 gap-3 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {[{ label: 'Days', val: d }, { label: 'Hours', val: h }, { label: 'Minutes', val: m }, { label: 'Seconds', val: s }].map((t) => (
              <div key={t.label} className="rounded-xl border border-white/10 bg-card/60 p-4 shadow">
                <div className="text-3xl font-bold">{mounted ? String(t.val).padStart(2, '0') : '00'}</div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{t.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
