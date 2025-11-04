"use client";

import { PropsWithChildren, useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CardRailProps = PropsWithChildren<{
  ariaLabel?: string;
  showArrows?: boolean;
  showHint?: boolean;
}>;

export function CardRail({ children, ariaLabel, showArrows = true, showHint = true }: CardRailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [hint, setHint] = useState(showHint);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
      setHint((prev) => (prev ? false : prev));
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setHint(false), 2500);
    return () => clearTimeout(t);
  }, [showHint]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.9);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      el.scrollBy({ left: step, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      el.scrollBy({ left: -step, behavior: 'smooth' });
    } else if (e.key === 'Home') {
      e.preventDefault();
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (e.key === 'End') {
      e.preventDefault();
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 [-webkit-overflow-scrolling:touch]"
        onPointerDown={() => hint && setHint(false)}
      >
        {children}
      </div>
      {/* Edge fades */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent transition-opacity ${
          atStart ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent transition-opacity ${
          atEnd ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {showArrows && (
        <>
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => ref.current?.scrollBy({ left: -Math.round((ref.current?.clientWidth || 0) * 0.9), behavior: 'smooth' })}
            className={`absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-background/80 text-foreground shadow backdrop-blur transition-opacity ${
              atStart ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => ref.current?.scrollBy({ left: Math.round((ref.current?.clientWidth || 0) * 0.9), behavior: 'smooth' })}
            className={`absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-background/80 text-foreground shadow backdrop-blur transition-opacity ${
              atEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
      {hint && (
        <div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-xs text-muted-foreground shadow backdrop-blur">
          Swipe
        </div>
      )}
    </div>
  );
}
