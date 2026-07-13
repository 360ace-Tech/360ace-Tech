'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from '@/lib/animation/gsap';
import { clearHomeTarget, peekHomeTarget, scrollToSection } from '@/lib/navigation/home-nav';
import { PRELOADER_TIMING } from '@/lib/navigation/preloader-config';

const HANDOFF_FAILSAFE_MS =
  PRELOADER_TIMING.readyTimeoutMs + PRELOADER_TIMING.exitMs + 500;

/**
 * Arrival choreography for the home page. Resolves the requested section —
 * a target queued by useAppNavigate() before an off-home click, or the URL
 * hash on a hard load — waits for the active preloader to hand off, then
 * refreshes ScrollTrigger (pin spacers must exist before measuring) and
 * eases to the section with Lenis.
 */
export function HomeSectionScroller() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;

    const queued = peekHomeTarget();
    const hash = decodeURIComponent(window.location.hash.replace('#', '')) || null;
    const target = queued !== undefined ? queued : hash;
    // null = land at the hero top (already there on arrival) — just clear.
    if (!target || target === 'home') {
      if (queued !== undefined) clearHomeTarget();
      return;
    }

    let cancelled = false;
    const timeouts: number[] = [];

    const go = () => {
      if (cancelled) return;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (cancelled) return;
          ScrollTrigger.refresh();
          scrollToSection(target);
          clearHomeTarget();
        })
      );
    };

    let cleanupEvent: (() => void) | undefined;
    if (document.documentElement.dataset.preloadActive === '1') {
      // Hard load: wait for the boot preloader's wipe.
      const onDone = () => go();
      window.addEventListener('preloader:done', onDone, { once: true });
      cleanupEvent = () => window.removeEventListener('preloader:done', onDone);
      timeouts.push(window.setTimeout(go, HANDOFF_FAILSAFE_MS));
    } else {
      // Soft nav: the navigation preloader fires on every route → / change
      // and announces its fade; failsafe covers the no-overlay edge.
      const onDone = () => go();
      window.addEventListener('navpreloader:done', onDone, { once: true });
      cleanupEvent = () => window.removeEventListener('navpreloader:done', onDone);
      timeouts.push(window.setTimeout(go, HANDOFF_FAILSAFE_MS));
    }

    return () => {
      cancelled = true;
      cleanupEvent?.();
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [pathname]);

  // Manual hash edits / hashchange still ease with the site physics.
  useEffect(() => {
    const onHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace('#', ''));
      if (hash) scrollToSection(hash);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return null;
}
