'use client';

import * as React from 'react';

import { services } from '@/lib/site-content';

// Progress thresholds at which each card flips (0–1 scroll range).
// Staggered so cards flip one after another as the user scrolls.
const FLIP_AT = [0.52, 0.62, 0.72, 0.82] as const;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function easeInOut(t: number) {
  const c = clamp(t);
  return c < 0.5 ? 2 * c * c : -1 + (4 - 2 * c) * c;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp(t);
}

export function ServiceScrollCards() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [vw, setVw] = React.useState(1200);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      setVw(window.innerWidth);
      setProgress(clamp(-rect.top / total));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ── Animation values ────────────────────────────────────────────────────────
  // 0.00–0.04  initial merged state
  // 0.04–0.36  cards split apart
  // 0.36–0.52  hold split (fronts visible)
  // 0.52–0.84  cards flip one by one
  // 0.84–1.00  hold final (backs visible)

  const introLift  = clamp(progress / 0.18);
  const split      = easeInOut(clamp((progress - 0.04) / 0.32));
  const detail     = clamp((progress - 0.84) / 0.14);
  const masterOpacity = clamp(1 - (progress - 0.42) / 0.14);

  const n = services.length;  // 4

  // Card widths
  const mergedW    = Math.min(vw - 80, 920);
  const splitMaxW  = Math.min(vw - 80, 1180);
  const splitGap   = 16;
  const mergedCardW  = Math.floor(mergedW / n);
  const splitCardW   = Math.floor((splitMaxW - splitGap * (n - 1)) / n);
  const cardWidth    = Math.round(lerp(mergedCardW, splitCardW, split));
  const gap          = Math.round(lerp(0, splitGap, split));

  return (
    <div ref={sectionRef} className="services-scroll-scene">
      <div className="services-scroll-sticky">

        {/* ── Intro label ── */}
        <div
          className="services-frame-intro"
          style={{ '--services-intro-lift': introLift } as React.CSSProperties}
        >
          <div>
            <p className="chapter-label">Capabilities</p>
          </div>
          <p>
            Proven playbooks for platform engineering, DevOps, and AI-ready
            architectures—customised for your mission, industry, and compliance needs.
          </p>
        </div>

        {/* ── Card stage ── */}
        <div
          className="services-card-stage"
          aria-label="Capabilities"
          style={{
            '--services-gap':           `${gap}px`,
            '--services-card-width':    `${cardWidth}px`,
            '--services-master-opacity': masterOpacity,
            '--services-split':          split,
          } as React.CSSProperties}
        >
          {/* Large title that sits over the merged card block */}
          <div className="services-stage-title" aria-hidden={masterOpacity < 0.05}>
            What we deliver
          </div>

          {services.map((service, index) => {
            // Border-radius: outer corners stay at 24px; inner corners open as cards split
            const r          = Math.round(lerp(0, 24, split));
            const leftRadius = index === 0     ? 24 : r;
            const rightRadius = index === n - 1 ? 24 : r;

            // Panoramic image slice: each card reveals 1/n of the image
            // background-size: n*100% makes the image span all n card widths combined.
            // background-position shifts to the correct horizontal slice.
            const bgPosX = n === 1 ? '50%' : `${(index / (n - 1)) * 100}%`;

            // Flip this card once the user has scrolled past its threshold
            const isFlipped = progress >= FLIP_AT[index];

            return (
              <article
                key={service.name}
                className={`services-flip-card${isFlipped ? ' is-flipped' : ''}`}
                style={{
                  '--service-radius':  `${leftRadius}px ${rightRadius}px ${rightRadius}px ${leftRadius}px`,
                  '--service-detail':  detail,
                } as React.CSSProperties}
                tabIndex={0}
                aria-label={service.name}
              >
                <div className="services-flip-card__inner">

                  {/* Front — single globe panorama, each card shows 1/n of the image */}
                  <div
                    className="services-flip-card__face services-flip-card__front"
                    aria-hidden="true"
                    style={{
                      // CSS variable --globe-url switches between light/dark images via :root/.dark
                      // — same value on SSR and client, eliminating the hydration mismatch.
                      backgroundImage:    'var(--globe-url)',
                      // n*100% width preserves proportional height (no vertical stretch)
                      backgroundSize:     `${n * 100}% auto`,
                      backgroundPosition: `${bgPosX} center`,
                      backgroundRepeat:   'no-repeat',
                      padding:            0,
                      border:             'none',
                    }}
                  />

                  {/* Back — service details */}
                  <div className="services-flip-card__face services-flip-card__back">
                    {/* Watermark number — delivery-rhythm style */}
                    <span className="services-card-number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <h3 className="mt-0 text-xl font-bold tracking-tight leading-snug">
                      {service.name}
                    </h3>
                    <p className="mt-3 text-sm font-medium leading-6">
                      {service.summary}
                    </p>
                    <ul className="mt-4 space-y-2 text-sm font-medium">
                      {service.outcomes.map((outcome) => (
                        <li key={outcome} className="flex gap-2 leading-relaxed">
                          <span className="mt-[0.2em] flex-shrink-0 text-primary">•</span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

      </div>
    </div>
  );
}
