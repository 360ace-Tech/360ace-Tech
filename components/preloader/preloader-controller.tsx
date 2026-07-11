'use client';

import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION_OK } from '@/lib/animation/config';

const LETTER_BASE_MS = 150;
const LETTER_STEP_MS = 90;
const LETTER_ANIM_MS = 480;
const MAX_WAIT_MS = 4000;

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
    const state = {
      minElapsed: false,
      globeReady: document.documentElement.dataset.globeReady === '1',
      globeRequired: motionOk && supportsWebGL(),
    };

    const overlay = document.querySelector<HTMLElement>(
      '.preloader-overlay:not(.preloader-overlay--navigation)'
    );
    if (!overlay) return;

    const finish = () => {
      if (root.dataset.preloadActive === '1') {
        delete root.dataset.preloadActive;
        window.dispatchEvent(new CustomEvent('preloader:done'));
      }
    };

    const tryFinish = () => {
      if (!state.minElapsed) return;
      if (motionOk && !state.globeReady) return;
      if (state.globeRequired && !state.globeReady) return;
      finish();
    };

    const onGlobeReady = () => {
      state.globeReady = true;
      document.documentElement.dataset.globeReady = '1';
      tryFinish();
    };

    const timer = window.setTimeout(() => {
      state.minElapsed = true;
      tryFinish();
    }, 2500);

    const hardUnlock = window.setTimeout(() => {
      finish();
    }, MAX_WAIT_MS);

    window.addEventListener('globe:ready', onGlobeReady, { once: true });

    const letters = overlay.querySelectorAll('.preloader-letter');
    const writeOnMs = LETTER_BASE_MS + (letters.length - 1) * LETTER_STEP_MS + LETTER_ANIM_MS;

    if (!motionOk) {
      const timeout = window.setTimeout(finish, 400);
      return () => {
        window.clearTimeout(timeout);
        window.clearTimeout(timer);
        window.clearTimeout(hardUnlock);
        window.removeEventListener('globe:ready', onGlobeReady);
      };
    }

    const tl = gsap.timeline({ delay: (writeOnMs + 100) / 1000 });
    tl.to(overlay.querySelector('.preloader-row'), {
      autoAlpha: 0,
      y: -28,
      duration: 0.35,
      ease: 'power2.in',
    })
      .set(overlay, { clipPath: 'inset(0% 0% 0% 0%)' }, '<')
      .to(overlay, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.55,
      ease: 'power3.inOut',
      onStart: finish,
    });

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(hardUnlock);
      window.removeEventListener('globe:ready', onGlobeReady);
    };
  });

  return null;
}
