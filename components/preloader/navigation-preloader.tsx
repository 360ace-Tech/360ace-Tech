'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { startHomeNavigationPreloader } from '@/lib/navigation/home-nav';

/**
 * Shows the branded spinner overlay during client-side navigation whenever
 * the user returns to the home page (/) from any other route — blog, legal,
 * contact, etc. — so every home landing starts from the hero behind the
 * same branded moment.
 *
 * Intentionally skips:
 *  - Initial mount (no preloader double-fire on hard load)
 *  - Route changes that don't end at /
 *
 * Dispatches `navpreloader:done` as the fade begins so the arrival scroller
 * (home-section-scroller.tsx) can ease to a queued section in sync.
 */
export function NavigationPreloader() {
  const pathname = usePathname();
  const prevRef = useRef<string | null>(null);
  const failsafeRef = useRef<number | null>(null);
  const text = '360ace.tech'.split('');

  const beginFade = () => {
    const root = document.documentElement;
    root.dataset.navPreloadFading = '1';
    window.dispatchEvent(new CustomEvent('navpreloader:done'));
    window.setTimeout(() => {
      delete root.dataset.navPreloadActive;
      delete root.dataset.navPreloadFading;
    }, 520);
  };

  // Takeover starts at click time (`homenav:start` from useAppNavigate), so
  // the overlay already covers the page when the route swaps underneath —
  // no view-transition snapshot can half-composite it. The failsafe clears
  // the overlay if the navigation never lands.
  useEffect(() => {
    const onStart = () => {
      startHomeNavigationPreloader();
      if (failsafeRef.current) window.clearTimeout(failsafeRef.current);
      failsafeRef.current = window.setTimeout(beginFade, 4000);
    };
    window.addEventListener('homenav:start', onStart);
    return () => {
      window.removeEventListener('homenav:start', onStart);
      if (failsafeRef.current) window.clearTimeout(failsafeRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = pathname;

    // Skip the initial mount — no previous path yet
    if (prev === null) return;

    // Arrival at home from any other route (covers back/forward too, where
    // no homenav:start was dispatched)
    if (pathname !== '/' || prev === '/') return;

    startHomeNavigationPreloader();

    const fadeTimer = window.setTimeout(() => {
      if (failsafeRef.current) window.clearTimeout(failsafeRef.current);
      beginFade();
    }, 900);

    return () => window.clearTimeout(fadeTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      className="preloader-overlay preloader-overlay--navigation"
      aria-hidden
    >
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
                {text.map((ch, i) => (
                  <span
                    key={`${ch}-${i}`}
                    className="preloader-letter"
                    data-ch={ch}
                    style={{ animationDelay: `${150 + i * 90}ms` }}
                  >
                    {ch}
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
