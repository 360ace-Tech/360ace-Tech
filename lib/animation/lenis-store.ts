import type Lenis from 'lenis';

/**
 * Module-level handle to the single Lenis instance created by
 * `components/providers/smooth-scroll.tsx`, so navigation helpers can ease
 * with the site's own scroll physics. Null on touch devices and under
 * reduced motion — callers must fall back to native scrolling.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}
