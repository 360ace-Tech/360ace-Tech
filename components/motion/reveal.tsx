'use client';

import { ElementType, ReactNode, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { DUR, EASE, MOTION_OK } from '@/lib/animation/config';

type Dir = 'up' | 'down' | 'left' | 'right';

const OFFSET: Record<Dir, { x?: number; y?: number }> = {
  up: { y: 32 },
  down: { y: -32 },
  left: { x: -32 },
  right: { x: 32 },
};

/**
 * Scroll-entrance reveal. Drop-in successor of the old IntersectionObserver
 * FadeIn — same prop surface. Content is fully visible in SSR output; the
 * hidden "from" state is only ever applied by JS, so nothing disappears if
 * scripts fail.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Comp = 'div',
  immediate = false,
  dir = 'up',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  immediate?: boolean;
  dir?: Dir;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(el, {
          autoAlpha: 0,
          ...OFFSET[dir],
          duration: DUR.md,
          ease: EASE.reveal,
          delay,
          clearProps: 'transform',
          ...(immediate
            ? {}
            : { scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
        });
      });
    },
    { scope: ref }
  );

  // Cast: R3F's JSX augmentation confuses generic ElementType rendering.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = Comp as any;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
