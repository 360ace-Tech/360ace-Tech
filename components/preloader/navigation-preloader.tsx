'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { startNavigationPreloader } from '@/lib/navigation/home-nav';
import { MOTION_OK } from '@/lib/animation/config';
import {
  PRELOADER_TIMING,
  preloadTargetForPath,
  type PreloadTarget,
} from '@/lib/navigation/preloader-config';

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Branded client-navigation takeover for routes that mount a WebGL scene.
 * It covers the outgoing page before navigation, then waits for the target
 * route's own globe readiness signal before revealing the new page.
 */
export function NavigationPreloader() {
  const pathname = usePathname();
  const router = useRouter();
  const prevRef = useRef<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const failsafeRef = useRef<number | null>(null);
  const exitFallbackRef = useRef<number | null>(null);
  const waitCleanupRef = useRef<(() => void) | null>(null);
  const text = '360ace.tech'.split('');

  const finishFade = useCallback(() => {
    const root = document.documentElement;
    if (root.dataset.navPreloadActive !== '1') return;
    if (exitFallbackRef.current) window.clearTimeout(exitFallbackRef.current);
    delete root.dataset.navPreloadActive;
    delete root.dataset.navPreloadFading;
    delete root.dataset.navPreloadTarget;
    window.dispatchEvent(new CustomEvent('navpreloader:done'));
  }, []);

  const beginFade = useCallback(() => {
    const root = document.documentElement;
    if (root.dataset.navPreloadActive !== '1') return;
    if (root.dataset.navPreloadFading === '1') return;
    waitCleanupRef.current?.();
    waitCleanupRef.current = null;
    if (failsafeRef.current) window.clearTimeout(failsafeRef.current);
    root.dataset.navPreloadFading = '1';
    const overlay = overlayRef.current;
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== 'clip-path') return;
      overlay?.removeEventListener('transitionend', onTransitionEnd);
      finishFade();
    };
    overlay?.addEventListener('transitionend', onTransitionEnd);
    exitFallbackRef.current = window.setTimeout(
      finishFade,
      PRELOADER_TIMING.exitMs + 200
    );
  }, [finishFade]);

  const armFailsafe = useCallback(() => {
    if (failsafeRef.current) window.clearTimeout(failsafeRef.current);
    failsafeRef.current = window.setTimeout(
      beginFade,
      PRELOADER_TIMING.readyTimeoutMs
    );
  }, [beginFade]);

  const waitForTarget = useCallback(
    (target: PreloadTarget) => {
      waitCleanupRef.current?.();
      const root = document.documentElement;
      const globeRequired = window.matchMedia(MOTION_OK).matches && supportsWebGL();
      let minElapsed = false;
      let ready = !globeRequired || root.dataset.globeRoute === target;

      const tryFinish = () => {
        if (!minElapsed || !ready) return;
        if (failsafeRef.current) window.clearTimeout(failsafeRef.current);
        beginFade();
      };
      const onReady = () => {
        ready = !globeRequired || root.dataset.globeRoute === target;
        tryFinish();
      };
      const minTimer = window.setTimeout(() => {
        minElapsed = true;
        tryFinish();
      }, PRELOADER_TIMING.navigationMinMs);

      window.addEventListener('globe:ready', onReady);
      armFailsafe();
      waitCleanupRef.current = () => {
        window.clearTimeout(minTimer);
        window.removeEventListener('globe:ready', onReady);
      };
    },
    [armFailsafe, beginFade]
  );

  // Home navigation starts in useAppNavigate before the route swap. Arm a
  // fallback immediately in case the router never completes.
  useEffect(() => {
    const onStart = () => armFailsafe();
    window.addEventListener('homenav:start', onStart);
    return () => window.removeEventListener('homenav:start', onStart);
  }, [armFailsafe]);

  // Services links exist in homepage cards and the global footer. Capture
  // them once so every entry point gets the same preloader and plain router
  // handoff instead of a competing View Transition snapshot.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== '/services') return;
      if (window.location.pathname === '/services') return;

      event.preventDefault();
      startNavigationPreloader('services');
      armFailsafe();
      router.push(
        `${url.pathname}${url.search}${url.hash}` as Parameters<typeof router.push>[0]
      );
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [armFailsafe, router]);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = pathname;
    if (prev === null || prev === pathname) return;

    const target = preloadTargetForPath(pathname);
    if (!target) return;
    const root = document.documentElement;
    if (
      root.dataset.navPreloadActive !== '1' ||
      root.dataset.navPreloadTarget !== target
    ) {
      startNavigationPreloader(target);
    }
    waitForTarget(target);
  }, [pathname, waitForTarget]);

  useEffect(
    () => () => {
      if (failsafeRef.current) window.clearTimeout(failsafeRef.current);
      if (exitFallbackRef.current) window.clearTimeout(exitFallbackRef.current);
      waitCleanupRef.current?.();
    },
    []
  );

  return (
    <div ref={overlayRef} className="preloader-overlay preloader-overlay--navigation" aria-hidden>
      <div className="preloader-stack">
        <div className="preloader-inner">
          <div className="preloader-row">
            <div className="preloader-logo">
              <span className="preloader-loading-ring" aria-hidden />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-dark.png" alt="" className="preloader-logo-img hidden h-full w-full object-contain dark:block" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-light.png" alt="" className="preloader-logo-img block h-full w-full object-contain dark:hidden" />
            </div>
            <div className="preloader-caption font-priestacy">
              <span className="preloader-word">
                {text.map((character, index) => (
                  <span
                    key={`${character}-${index}`}
                    className="preloader-letter"
                    data-ch={character}
                    style={{ animationDelay: `${150 + index * 90}ms` }}
                  >
                    {character}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
