'use client';

import { ReactNode, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { EASE, MOTION_OK } from '@/lib/animation/config';
import { cn } from '@/lib/utils';

/**
 * Curtain reveal: the container un-clips from the bottom while any inner
 * image settles from a slight over-scale. Purely compositable properties.
 */
export function ClipReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          defaults: { duration: 1.1, ease: EASE.reveal, delay },
        });
        tl.from(el, { clipPath: 'inset(0% 0% 100% 0%)' }, 0);
        const img = el.querySelector('img');
        if (img) tl.from(img, { scale: 1.15 }, 0);
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      {children}
    </div>
  );
}
