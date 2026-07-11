'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION_OK, PIN_OK_LG } from '@/lib/animation/config';

const HeroScene = dynamic(() => import('@/components/three/hero-scene'), { ssr: false });

/**
 * The particle globe as a fixed, full-viewport background layer for the
 * homepage. At the hero it sits right of centre, fully formed; the hero's
 * pinned scroll disperses it toward the centre with an eased feel, and the
 * dispersed field then lives on at low opacity behind the following
 * sections, fading out at the CTA band. Renders nothing on mobile, under
 * reduced motion, or without WebGL — the hero keeps its static poster.
 */
export function GlobeBackground() {
  const [render3D, setRender3D] = useState(false);
  const [active, setActive] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef(0);
  const opacityRef = useRef(1);
  const hoverRef = useRef(false);
  const xRef = useRef(0.9);
  const fadedRef = useRef(false);

  // Only motion-friendly large viewports with WebGL download three.js.
  useEffect(() => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    if (!window.matchMedia(MOTION_OK).matches) return;
    try {
      const canvas = document.createElement('canvas');
      if (canvas.getContext('webgl2') || canvas.getContext('webgl')) {
        setRender3D(true);
      }
    } catch {
      /* hero poster remains */
    }
  }, []);

  // Hidden-tab throttling is handled by the browser (rAF stops); the only
  // manual gate is the scroll-driven fade at the CTA.
  const syncActive = () => {
    const next = !fadedRef.current;
    setActive((prev) => (prev === next ? prev : next));
  };

  // Idle rotation pauses while the pointer is over the hero.
  useEffect(() => {
    if (!render3D) return;
    const home = document.getElementById('home');
    if (!home) return;
    const enter = () => {
      hoverRef.current = true;
    };
    const leave = () => {
      hoverRef.current = false;
    };
    home.addEventListener('pointerenter', enter);
    home.addEventListener('pointerleave', leave);
    return () => {
      home.removeEventListener('pointerenter', enter);
      home.removeEventListener('pointerleave', leave);
    };
  }, [render3D]);

  useGSAP(
    () => {
      if (!render3D) return;
      const mm = gsap.matchMedia();
      mm.add(PIN_OK_LG, () => {
        const state = { p: 0, x: 0.9, o: 1 };
        const apply = () => {
          progressRef.current = state.p;
          xRef.current = state.x;
          opacityRef.current = state.o;
          const faded = state.o <= 0.01;
          if (faded !== fadedRef.current) {
            fadedRef.current = faded;
            syncActive();
          }
        };
        apply();

        // Hero: disperse + drift to centre + dim. power1.inOut inside the
        // scrub makes the dispersal ease into the next frame instead of
        // tracking scroll linearly.
        gsap.timeline({
          scrollTrigger: { trigger: '#home', start: 'top top', end: '+=120%', scrub: 1 },
        }).to(state, { p: 0.72, x: 0, o: 0.5, ease: 'power1.inOut', onUpdate: apply });

        // Ambient field behind services → insights: dispersion completes
        // very slowly; opacity holds (only `p` animated to avoid fighting
        // the hero/CTA tweens over `o`).
        gsap.timeline({
          scrollTrigger: {
            trigger: '#services',
            start: 'top 75%',
            endTrigger: '#insights',
            end: 'bottom top',
            scrub: 1.5,
          },
        }).to(state, { p: 1, ease: 'none', onUpdate: apply });

        // CTA band is opaque mint — fade the field out underneath it.
        gsap.timeline({
          scrollTrigger: { trigger: '#contact', start: 'top 90%', end: 'top 35%', scrub: 1 },
        }).to(state, { o: 0, ease: 'none', onUpdate: apply });
      });
    },
    // No `scope`: the ScrollTrigger `trigger` selectors (#home, #services, …)
    // must resolve against the document, not this fixed wrapper.
    { dependencies: [render3D] }
  );

  // The wrapper div always renders (stable SSR node): ScrollTrigger re-parents
  // the hero section into a pin-spacer, so mounting this div *later* would make
  // React insertBefore a moved sibling and crash. Only the canvas is gated.
  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {render3D ? (
        <HeroScene
          active={active}
          progressRef={progressRef}
          opacityRef={opacityRef}
          hoverRef={hoverRef}
          xRef={xRef}
        />
      ) : null}
    </div>
  );
}
