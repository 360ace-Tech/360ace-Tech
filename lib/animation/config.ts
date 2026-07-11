/**
 * Shared motion vocabulary — one place for eases, durations, staggers and
 * the matchMedia conditions that gate every animation.
 */
export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  reveal: 'expo.out',
} as const;

export const DUR = {
  xs: 0.3,
  sm: 0.6,
  md: 0.9,
  lg: 1.4,
} as const;

export const STAGGER = {
  chars: 0.018,
  words: 0.04,
  items: 0.08,
} as const;

/** Animations only run when the user hasn't asked for reduced motion. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
/** Pinned/scrubbed scenes only run on desktop-sized viewports. */
export const DESKTOP = '(min-width: 768px)';
export const DESKTOP_LG = '(min-width: 1024px)';
/** Combined conditions for pinned scenes (match the section's layout breakpoint). */
export const PIN_OK = `${MOTION_OK} and ${DESKTOP}`;
export const PIN_OK_LG = `${MOTION_OK} and ${DESKTOP_LG}`;
