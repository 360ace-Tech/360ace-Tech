export type PreloadTarget = 'home' | 'services';

/** Shared timing contract for boot and route-navigation preloaders. */
export const PRELOADER_TIMING = {
  brandMs: 1550,
  navigationMinMs: 650,
  readyTimeoutMs: 3500,
  exitMs: 480,
} as const;

export function preloadTargetForPath(pathname: string): PreloadTarget | null {
  if (pathname === '/') return 'home';
  if (pathname === '/services') return 'services';
  return null;
}
