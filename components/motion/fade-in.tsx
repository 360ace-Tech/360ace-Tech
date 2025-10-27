'use client';

import { ReactNode, ElementType, useEffect, useRef } from 'react';

export function FadeIn({
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
  dir?: 'up' | 'down' | 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (immediate) {
      el.classList.add('is-visible');
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            obs.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [immediate]);

  const style: React.CSSProperties = { '--reveal-delay': `${Math.round(delay * 1000)}ms` } as React.CSSProperties;
  const cls = ['reveal', className].filter(Boolean).join(' ');
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Comp ref={ref as unknown as any} className={cls} style={style} data-reveal-dir={dir}>
      {children}
    </Comp>
  );
}
