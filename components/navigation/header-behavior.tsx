'use client';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/animation/gsap';
import { MOTION_OK } from '@/lib/animation/config';

const SECTION_IDS = ['services', 'process', 'insights', 'contact'];

/**
 * Header choreography: hides on scroll-down, reveals on scroll-up, gains a
 * solid background after 80px (via `data-scrolled`), and broadcasts which
 * homepage section is in view so the nav can underline it.
 */
export function HeaderBehavior() {
  useGSAP(() => {
    const header = document.querySelector<HTMLElement>('[data-site-header]');
    if (!header) return;

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const slide = gsap.quickTo(header, 'yPercent', { duration: 0.45, ease: 'power3.out' });

      ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll();
          header.dataset.scrolled = y > 80 ? 'true' : 'false';
          if (y < 120) {
            slide(0);
            return;
          }
          slide(self.direction === 1 ? -110 : 0);
        },
      });

      const announce = (id: string | null) => {
        window.dispatchEvent(new CustomEvent('section:active', { detail: id }));
      };
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) announce(id);
            else if (self.direction === -1 && id === SECTION_IDS[0]) announce(null);
          },
        });
      });

      return () => {
        header.dataset.scrolled = 'false';
      };
    });
  });

  return null;
}
