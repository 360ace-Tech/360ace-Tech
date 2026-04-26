'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Shows the branded spinner overlay during client-side navigation when the user
 * moves from any blog page (/blog or /blog/[slug]) to the home page (/).
 *
 * Intentionally skips:
 *  - Initial mount (no preloader double-fire on hard load)
 *  - Blog-to-blog transitions (/blog → /blog/[slug] and vice-versa)
 *  - Any other route change that doesn't end at /
 *
 * Reuses the `preloader-spin` keyframe already defined in globals.css.
 */
export function NavigationPreloader() {
  const pathname = usePathname();
  const prevRef = useRef<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const text = '360ace.tech'.split('');

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = pathname;

    // Skip the initial mount — no previous path yet
    if (prev === null) return;

    // Only fire when going FROM a blog page TO the home page
    if (pathname !== '/' || !prev.startsWith('/blog')) return;

    setFading(false);
    setVisible(true);

    const fadeTimer = window.setTimeout(() => {
      setFading(true);
      window.setTimeout(() => setVisible(false), 500);
    }, 900);

    return () => window.clearTimeout(fadeTimer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className={`preloader-overlay preloader-overlay--navigation${fading ? ' preloader-overlay--fading' : ''}`}
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
