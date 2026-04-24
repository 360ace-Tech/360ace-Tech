'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

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
  const { resolvedTheme } = useTheme();

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

  const isDark = resolvedTheme === 'dark';
  const logoSrc = isDark ? '/logo-dark.png' : '/logo-light.png';
  const ringGradient = isDark
    ? 'conic-gradient(from 0deg, rgba(99,102,241,0.85), rgba(236,72,153,0.75), rgba(99,102,241,0.85))'
    : 'conic-gradient(from 0deg, rgba(14,165,233,0.85), rgba(59,130,246,0.8), rgba(14,165,233,0.85))';

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center transition-opacity duration-500${
        fading ? ' opacity-0 pointer-events-none' : ' opacity-100'
      }`}
      style={{ background: 'hsl(var(--background))' }}
      aria-hidden
    >
      <div className="relative h-40 w-40 sm:h-48 sm:w-48">
        {/* Spinning conic ring — reuses preloader-spin from globals.css */}
        <div
          className="absolute inset-0 -z-10 rounded-full"
          style={{
            background: ringGradient,
            WebkitMask: 'radial-gradient(farthest-side, transparent 68%, #000 70%)',
            mask: 'radial-gradient(farthest-side, transparent 68%, #000 70%)',
            filter: 'drop-shadow(0 0 24px rgba(99,102,241,0.45))',
            animation: 'preloader-spin 1.2s linear infinite',
          }}
          aria-hidden
        />
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20">
            <Image src={logoSrc} alt="" fill sizes="80px" className="object-contain" priority />
          </div>
        </div>
      </div>
    </div>
  );
}
