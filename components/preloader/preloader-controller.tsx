'use client';

import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION_OK } from '@/lib/animation/config';

const LETTER_BASE_MS = 150;
const LETTER_STEP_MS = 90;
const LETTER_ANIM_MS = 480;

/**
 * Choreographs the preloader exit. The write-on itself runs in pure CSS
 * (visible before hydration); once the wordmark has fully spelled, this
 * wipes the overlay away, unlocks scroll, and dispatches `preloader:done`
 * so the hero entrance can begin.
 */
export function PreloaderController() {
  useGSAP(() => {
    const root = document.documentElement;
    if (root.dataset.preloadActive !== '1') return;
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

    const letters = overlay.querySelectorAll('.preloader-letter');
    const writeOnMs = LETTER_BASE_MS + (letters.length - 1) * LETTER_STEP_MS + LETTER_ANIM_MS;

    if (!window.matchMedia(MOTION_OK).matches) {
      const timeout = window.setTimeout(finish, 400);
      return () => window.clearTimeout(timeout);
    }

    const tl = gsap.timeline({ delay: (writeOnMs + 250) / 1000 });
    tl.to(overlay.querySelector('.preloader-row'), {
      autoAlpha: 0,
      y: -28,
      duration: 0.45,
      ease: 'power2.in',
    })
      .set(overlay, { clipPath: 'inset(0% 0% 0% 0%)' }, '<')
      .to(overlay, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.75,
        ease: 'power3.inOut',
        onStart: finish,
      });
  });

  return null;
}
