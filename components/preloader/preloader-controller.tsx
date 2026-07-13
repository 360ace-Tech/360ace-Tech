'use client';

import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION_OK } from '@/lib/animation/config';
import {
  PRELOADER_TIMING,
  preloadTargetForPath,
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
 * Choreographs the preloader exit. The write-on itself runs in pure CSS
 * (visible before hydration); once the wordmark has fully spelled, this
 * waits for the globe to report readiness, then wipes the overlay away,
 * unlocks scroll, and dispatches `preloader:done` so the hero entrance can
 * begin.
 */
export function PreloaderController() {
  useGSAP(() => {
    const root = document.documentElement;
    if (root.dataset.preloadActive !== '1') return;
    const motionOk = window.matchMedia(MOTION_OK).matches;
    const target = preloadTargetForPath(window.location.pathname);
    const state = {
      brandComplete: false,
      globeReady:
        target === null ||
        (root.dataset.globeReady === '1' && root.dataset.globeRoute === target),
      globeRequired: target !== null && motionOk && supportsWebGL(),
      exitStarted: false,
    };

    const overlay = document.querySelector<HTMLElement>(
      '.preloader-overlay:not(.preloader-overlay--navigation)'
    );
    if (!overlay) return;

    let exitTimeline: gsap.core.Timeline | null = null;

    const finish = () => {
      if (root.dataset.preloadActive === '1') {
        delete root.dataset.preloadActive;
        window.dispatchEvent(new CustomEvent('preloader:done'));
      }
    };

    const tryExit = () => {
      if (state.exitStarted || !state.brandComplete) return;
      if (state.globeRequired && !state.globeReady) return;
      state.exitStarted = true;
      exitTimeline = gsap.timeline({ onComplete: finish });
      exitTimeline
        .to(overlay.querySelector('.preloader-row'), {
          autoAlpha: 0,
          y: -28,
          duration: 0.25,
          ease: 'power2.in',
        })
        .to(
          overlay,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: PRELOADER_TIMING.exitMs / 1000,
            ease: 'power3.inOut',
          },
          0.08
        );
    };

    const onGlobeReady = () => {
      state.globeReady =
        target === null || root.dataset.globeRoute === target;
      tryExit();
    };

    const brandTimer = window.setTimeout(() => {
      state.brandComplete = true;
      tryExit();
    }, PRELOADER_TIMING.brandMs);

    const hardUnlock = window.setTimeout(() => {
      state.globeReady = true;
      tryExit();
    }, PRELOADER_TIMING.readyTimeoutMs);

    window.addEventListener('globe:ready', onGlobeReady, { once: true });

    if (!motionOk) {
      const timeout = window.setTimeout(finish, 400);
      return () => {
        window.clearTimeout(timeout);
        window.clearTimeout(brandTimer);
        window.clearTimeout(hardUnlock);
        window.removeEventListener('globe:ready', onGlobeReady);
      };
    }

    return () => {
      exitTimeline?.kill();
      window.clearTimeout(brandTimer);
      window.clearTimeout(hardUnlock);
      window.removeEventListener('globe:ready', onGlobeReady);
    };
  });

  return null;
}
