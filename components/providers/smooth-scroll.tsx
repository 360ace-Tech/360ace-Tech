'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/animation/gsap';
import { MOTION_OK } from '@/lib/animation/config';

/**
 * Lenis smooth scrolling driven by the GSAP ticker, so ScrollTrigger and the
 * scroll position always agree. Native scroll is kept on touch devices and
 * under prefers-reduced-motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const motionOk = window.matchMedia(MOTION_OK).matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!motionOk || !finePointer) return;

    const lenis = new Lenis({ lerp: 0.12, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  // Recalculate trigger positions after route changes settle (view transition + layout).
  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [pathname]);

  return null;
}
