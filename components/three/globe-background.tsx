'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION_OK, PIN_OK_LG } from '@/lib/animation/config';

const HeroScene = dynamic(() => import('@/components/three/hero-scene'), { ssr: false });

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function pointerIsOverHeroGlobe(event: PointerEvent) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width < 1024) {
    return (
      event.clientX >= width * 0.08 &&
      event.clientX <= width * 0.96 &&
      event.clientY >= height * 0.38 &&
      event.clientY <= height * 0.82
    );
  }

  return (
    event.clientX >= width * 0.43 &&
    event.clientX <= width * 0.93 &&
    event.clientY >= height * 0.12 &&
    event.clientY <= height * 0.93
  );
}

/**
 * The particle globe as a fixed, full-viewport background layer for the
 * homepage. At the hero it sits right of centre, fully formed; the hero's
 * pinned scroll disperses it toward the centre with an eased feel, and the
 * dispersed field then lives on at low opacity behind the following
 * sections, fading out at the CTA band. Renders nothing under reduced motion
 * or without WebGL.
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

  // Motion-friendly viewports with WebGL render the current particle globe.
  useEffect(() => {
    const motion = window.matchMedia(MOTION_OK);
    const sync = () => {
      const shouldRender = motion.matches && supportsWebGL();
      setRender3D(shouldRender);
      if (!shouldRender) hoverRef.current = false;
      xRef.current = window.innerWidth >= 1024 ? 0.9 : 0;
    };
    sync();
    motion.addEventListener('change', sync);
    window.addEventListener('resize', sync, { passive: true });
    return () => {
      motion.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  // Hidden-tab throttling is handled by the browser (rAF stops); the only
  // manual gate is the scroll-driven fade at the CTA.
  const syncActive = () => {
    const next = !fadedRef.current;
    setActive((prev) => (prev === next ? prev : next));
  };

  // Idle rotation pauses only while the pointer is over the globe's visual
  // viewport, not the whole hero section.
  useEffect(() => {
    if (!render3D) return;
    const move = (event: PointerEvent) => {
      hoverRef.current = pointerIsOverHeroGlobe(event);
    };
    const leave = () => {
      hoverRef.current = false;
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', leave);
    };
  }, [render3D]);

  useGSAP(
    () => {
      if (!render3D) return;
      const mm = gsap.matchMedia();
      mm.add(PIN_OK_LG, () => {
        const state = { p: 0, x: window.innerWidth >= 1024 ? 0.9 : 0, o: 1 };
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
        }).to(state, { p: 0.72, x: 0, o: 0.22, ease: 'power1.inOut', onUpdate: apply });

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

      mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
        const state = { p: 0, x: 0, o: 1 };
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

        gsap.timeline({
          scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1.2 },
        }).to(state, { p: 0.72, o: 0.1, ease: 'power1.inOut', onUpdate: apply });

        gsap.timeline({
          scrollTrigger: {
            trigger: '#services',
            start: 'top 80%',
            endTrigger: '#insights',
            end: 'bottom top',
            scrub: 1.5,
          },
        }).to(state, { p: 1, o: 0.1, ease: 'none', onUpdate: apply });

        gsap.timeline({
          scrollTrigger: { trigger: '#contact', start: 'top 90%', end: 'top 45%', scrub: 1 },
        }).to(state, { o: 0, ease: 'none', onUpdate: apply });
      });
    },
    // No `scope`: the ScrollTrigger `trigger` selectors (#home, #services, …)
    // must resolve against the document, not this fixed wrapper.
    { dependencies: [render3D] }
  );

  const handleSceneReady = () => {
    document.documentElement.dataset.globeReady = '1';
    window.dispatchEvent(new CustomEvent('globe:ready'));
  };

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
          onReady={handleSceneReady}
        />
      ) : null}
    </div>
  );
}
