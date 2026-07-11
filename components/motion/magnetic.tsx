'use client';

import { ReactNode, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION_OK } from '@/lib/animation/config';
import { cn } from '@/lib/utils';

/**
 * Magnetic hover wrapper — the element leans toward the pointer and springs
 * back on leave. No-ops on touch devices and under reduced motion.
 */
export function Magnetic({
  children,
  className,
  strength = 0.32,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      if (!window.matchMedia(MOTION_OK).matches) return;
      if (!window.matchMedia('(pointer: fine)').matches) return;

      const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });

      const onMove = contextSafe((event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
      });
      const onLeave = contextSafe(() => {
        xTo(0);
        yTo(0);
      });

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn('inline-block', className)}>
      {children}
    </div>
  );
}
