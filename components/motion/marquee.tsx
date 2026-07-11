'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION_OK } from '@/lib/animation/config';
import { cn } from '@/lib/utils';

/**
 * Infinite keyword marquee. Content is duplicated once and translated by
 * -50%, which loops seamlessly. Static under prefers-reduced-motion.
 */
export function Marquee({
  items,
  className,
  duration = 28,
}: {
  items: string[];
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const track = ref.current?.querySelector('[data-marquee-track]');
      if (!track) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.to(track, { xPercent: -50, ease: 'none', duration, repeat: -1 });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn('overflow-hidden whitespace-nowrap', className)} aria-hidden>
      <div data-marquee-track className="flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {items.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="flex items-center gap-6 pr-6 font-mono text-xs uppercase tracking-[0.3em]"
              >
                {item}
                <span className="inline-block h-1 w-1 rounded-full bg-current opacity-60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
