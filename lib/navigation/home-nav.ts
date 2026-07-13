'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTransitionRouter } from 'next-view-transitions';
import { getLenis } from '@/lib/animation/lenis-store';
import type { PreloadTarget } from '@/lib/navigation/preloader-config';

export type { PreloadTarget } from '@/lib/navigation/preloader-config';

/** Sticky-header offset used when easing to a section. */
const HEADER_OFFSET = -96;
const QUEUE_KEY = 'home:scroll-target';

export function startNavigationPreloader(target: PreloadTarget) {
  const root = document.documentElement;
  root.dataset.navPreloadActive = '1';
  root.dataset.navPreloadTarget = target;
  delete root.dataset.navPreloadFading;
  delete root.dataset.globeReady;
  delete root.dataset.globeRoute;
}

export function startHomeNavigationPreloader() {
  startNavigationPreloader('home');
}

export type NavTarget =
  | { type: 'home'; section: string | null }
  | { type: 'route'; href: string };

/** New-tab / download / non-primary clicks must keep native behaviour. */
export function isModifiedClick(event: React.MouseEvent) {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

/**
 * Classifies an internal href. Home targets are `/`, `/#section`, and bare
 * `#section` values (which only make sense as homepage sections here).
 */
export function parseHomeTarget(href: string): NavTarget {
  if (href === '/' || href === '/#' || href === '/#home' || href === '#home') {
    return { type: 'home', section: null };
  }
  if (href.startsWith('/#')) return { type: 'home', section: href.slice(2) };
  if (href.startsWith('#')) return { type: 'home', section: href.slice(1) };
  return { type: 'route', href };
}

/** Eases to a homepage section (or the top) using Lenis when available. */
export function scrollToSection(section: string | null) {
  const lenis = getLenis();
  if (section === null) {
    if (lenis) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(section);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: HEADER_OFFSET, duration: 1.2 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function queueHomeTarget(section: string | null) {
  try {
    sessionStorage.setItem(QUEUE_KEY, section ?? 'top');
  } catch {
    /* private mode — arrival simply lands at the hero */
  }
}

/**
 * Reads the queued target WITHOUT clearing it — effects can be mounted,
 * cleaned up, and re-run (StrictMode) before the scroll actually happens.
 * Call clearHomeTarget() once the scroll has executed.
 */
export function peekHomeTarget(): string | null | undefined {
  try {
    const raw = sessionStorage.getItem(QUEUE_KEY);
    if (raw === null) return undefined;
    return raw === 'top' ? null : raw;
  } catch {
    return undefined;
  }
}

export function clearHomeTarget() {
  try {
    sessionStorage.removeItem(QUEUE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * The one way internal links navigate. Distinguishes on-home section eases,
 * off-home home-targets (queued target + preloader + transition back to /),
 * and plain route changes (view transition).
 */
export function useAppNavigate() {
  const router = useTransitionRouter();
  const plainRouter = useRouter();
  const pathname = usePathname();

  return useCallback(
    (href: string) => {
      const target = parseHomeTarget(href);

      if (target.type === 'route') {
        router.push(href as Parameters<typeof router.push>[0]);
        return;
      }

      if (pathname === '/') {
        scrollToSection(target.section);
        history.replaceState(null, '', target.section ? `/#${target.section}` : '/');
        return;
      }

      // Home return: the navigation preloader IS the transition. Show it
      // immediately (before the route swap) and push WITHOUT a view
      // transition — running both at once half-composites the overlay into
      // the crossfade snapshot and lets the hero flash through.
      queueHomeTarget(target.section);
      startHomeNavigationPreloader();
      window.dispatchEvent(new CustomEvent('homenav:start'));
      plainRouter.push('/');
    },
    [router, plainRouter, pathname]
  );
}
