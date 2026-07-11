'use client';

import { ElementType, ReactNode, useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/animation/gsap';
import { DUR, EASE, MOTION_OK, STAGGER } from '@/lib/animation/config';

/**
 * Masked-line SplitText reveal for headings. SplitText's `aria: 'auto'`
 * keeps the heading readable to assistive tech, and `autoSplit` re-splits
 * on font load / resize with the animation re-applied via onSplit.
 */
export function SplitHeading({
  children,
  className,
  as: Comp = 'h2',
  unit = 'chars',
  delay = 0,
  start = 'top 85%',
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  unit?: 'chars' | 'words' | 'lines';
  delay?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, {
          // chars always nest inside words so text never wraps mid-word
          type: unit === 'lines' ? 'lines' : unit === 'words' ? 'lines,words' : 'lines,words,chars',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(unit === 'lines' ? self.lines : unit === 'words' ? self.words : self.chars, {
              yPercent: 115,
              duration: DUR.md,
              ease: EASE.reveal,
              delay,
              stagger: unit === 'chars' ? STAGGER.chars : unit === 'words' ? STAGGER.words : 0.1,
              scrollTrigger: { trigger: el, start, once: true },
            }),
        });
        return () => split.revert();
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
