'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { DUR, EASE, MOTION_OK } from '@/lib/animation/config';

export type FeatureRow = {
  index: string;
  title: string;
  description: string;
};

/**
 * Editorial index list: full-width rows separated by hairline rules that
 * draw in on scroll. Hover tints the row and nudges the title toward an
 * accent arrow.
 */
export function FeatureRows({ rows, ariaLabel }: { rows: FeatureRow[]; ariaLabel: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-feature-row]', root).forEach((row, index) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: 'top 85%', once: true },
            defaults: { ease: EASE.reveal },
          });
          tl.from(row.querySelector('[data-row-rule]'), {
            scaleX: 0,
            duration: DUR.md,
            delay: index * 0.06,
          }).from(
            row.querySelectorAll('[data-row-content] > *'),
            { autoAlpha: 0, y: 26, duration: DUR.md, stagger: 0.07 },
            '<0.15'
          );
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} role="list" aria-label={ariaLabel}>
      {rows.map((row) => (
        <div key={row.index} role="listitem" data-feature-row className="group relative">
          <div data-row-rule className="hairline origin-left" aria-hidden />
          <div
            data-row-content
            className="grid gap-4 py-10 transition-colors duration-300 group-hover:bg-card/70 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[6rem_minmax(0,1.1fr)_minmax(0,1fr)] lg:py-14"
          >
            <p className="font-mono text-sm text-primary">{row.index}</p>
            <h3 className="flex items-start gap-4 font-display text-2xl font-semibold tracking-[-0.01em] transition-transform duration-300 group-hover:translate-x-2 sm:text-3xl lg:text-4xl">
              {row.title}
              <span
                className="mt-1 hidden text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:inline"
                aria-hidden
              >
                →
              </span>
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:justify-self-end">
              {row.description}
            </p>
          </div>
        </div>
      ))}
      <div className="hairline" aria-hidden />
    </div>
  );
}
