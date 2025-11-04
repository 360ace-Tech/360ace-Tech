'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

export default function PreloaderOverlay() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [hiding, setHiding] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === 'undefined') return;
    // Only show once per session
    const seen = sessionStorage.getItem('preloaderShown');
    if (seen === '1') return;
    setShow(true);
    // Hide quickly after first paint, but give a short branded moment
    hideTimer.current = window.setTimeout(() => {
      setHiding(true);
      // Finish fade-out then remove entirely
      window.setTimeout(() => {
        setShow(false);
        sessionStorage.setItem('preloaderShown', '1');
      }, 500);
    }, 900);
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [mounted]);

  if (!show) return null;

  const isDark = resolvedTheme === 'dark';
  const logoSrc = isDark ? '/logo-dark.png' : '/logo-light.png';
  const ringFrom = isDark ? 'rgba(99,102,241,0.85)' : 'rgba(14,165,233,0.85)';
  const ringMid = isDark ? 'rgba(236,72,153,0.75)' : 'rgba(59,130,246,0.8)';

  return (
    <div
      className={
        'fixed inset-0 z-[80] flex items-center justify-center transition-opacity duration-500 ' +
        (hiding ? 'opacity-0 pointer-events-none' : 'opacity-100')
      }
      style={{ background: 'hsl(var(--background))' }}
      aria-hidden
    >
      <div className="relative h-40 w-40 sm:h-48 sm:w-48">
        {/* CSS glow ring (no WebGL) */}
        <div
          className="absolute inset-0 -z-10 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${ringFrom}, ${ringMid}, ${ringFrom})`,
            WebkitMask: 'radial-gradient(farthest-side, transparent 68%, #000 70%)',
            mask: 'radial-gradient(farthest-side, transparent 68%, #000 70%)',
            filter: 'drop-shadow(0 0 24px rgba(99,102,241,0.45))',
            animation: 'spin 1.2s linear infinite',
          }}
          aria-hidden
        />
        <style jsx>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div className="relative h-full w-full flex items-center justify-center">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
            <Image src={logoSrc} alt="Site logo" fill sizes="80px" className="object-contain" priority />
          </div>
        </div>
      </div>
    </div>
  );
}
