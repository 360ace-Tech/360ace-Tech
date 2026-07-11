"use client";

import { useEffect, useMemo, useState } from 'react';
import { company } from '@/lib/site-content';

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Soft accent pulse */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl motion-safe:animate-pulse"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <p className="chapter-label justify-center">
          <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-ping" aria-hidden />
          Scheduled maintenance
        </p>
        <h1 className="mt-6 font-display text-4xl font-semibold tracking-[-0.02em] sm:text-6xl">
          We’re making improvements
        </h1>
        <p className="mt-4 text-muted-foreground">
          Our site is undergoing scheduled maintenance. We’ll be back soon.
        </p>
        <div className="mt-10 grid grid-cols-4 gap-3 text-center">
          {[
            { label: 'Days', val: d },
            { label: 'Hours', val: h },
            { label: 'Minutes', val: m },
            { label: 'Seconds', val: s },
          ].map((t) => (
            <div key={t.label} className="rounded-lg border border-border bg-card p-4">
              <div className="font-display text-3xl font-bold tabular-nums">
                {mounted ? String(t.val).padStart(2, '0') : '00'}
              </div>
              <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
                {t.label}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
          {company.name}
        </p>
      </div>
    </section>
  );
}
