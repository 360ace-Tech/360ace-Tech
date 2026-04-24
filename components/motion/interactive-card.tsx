'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type InteractiveCardProps = React.HTMLAttributes<HTMLDivElement> & {
  intensity?: number;
};

export function InteractiveCard({
  children,
  className,
  intensity = 1,
  onPointerLeave,
  onPointerMove,
  style,
  ...props
}: InteractiveCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const el = ref.current;
    if (!el || event.pointerType === 'touch') return;

    const canAnimate =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canAnimate) return;

    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 10 * intensity;
    const rotateX = (0.5 - y) * 8 * intensity;

    el.style.setProperty('--card-x', `${Math.round(x * 100)}%`);
    el.style.setProperty('--card-y', `${Math.round(y * 100)}%`);
    el.style.setProperty('--card-rx', `${rotateX.toFixed(2)}deg`);
    el.style.setProperty('--card-ry', `${rotateY.toFixed(2)}deg`);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--card-x', '50%');
    el.style.setProperty('--card-y', '0%');
    el.style.setProperty('--card-rx', '0deg');
    el.style.setProperty('--card-ry', '0deg');
  };

  return (
    <div
      ref={ref}
      className={cn('interactive-card', className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={style}
      {...props}
    >
      <div className="interactive-card__content">{children}</div>
    </div>
  );
}
