'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION_OK } from '@/lib/animation/config';
import { services } from '@/lib/site-content';

const HeroScene = dynamic(() => import('@/components/three/hero-scene'), { ssr: false });

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Services-page globe choreography. It shares the homepage renderer but has
 * its own low-opacity scroll state so homepage section selectors never leak
 * into this route.
 */
export function ServicesGlobeBackground() {
  const [render3D, setRender3D] = useState(false);
  const [active, setActive] = useState(true);
  const progressRef = useRef(0.05);
  const opacityRef = useRef(0.24);
  const hoverRef = useRef(false);
  const xRef = useRef(0.78);
  const activeRef = useRef(true);

  useEffect(() => {
    const motion = window.matchMedia(MOTION_OK);
    const sync = () => setRender3D(motion.matches && supportsWebGL());
    sync();
    motion.addEventListener('change', sync);
    return () => motion.removeEventListener('change', sync);
  }, []);

  useGSAP(
    () => {
      if (!render3D) return;
      const state = {
        progress: 0.05,
        opacity: window.innerWidth >= 1024 ? 0.24 : 0.18,
        x: window.innerWidth >= 1024 ? 0.78 : 0,
      };
      const apply = () => {
        progressRef.current = state.progress;
        opacityRef.current = state.opacity;
        xRef.current = state.x;
        const nextActive = state.opacity > 0.01;
        if (nextActive !== activeRef.current) {
          activeRef.current = nextActive;
          setActive(nextActive);
        }
      };
      apply();

      const contexts: gsap.core.Tween[] = [];
      services.forEach((service, index) => {
        contexts.push(
          gsap.to(state, {
            progress: 0.38 + index * 0.14,
            opacity: window.innerWidth >= 1024 ? 0.13 : 0.09,
            x: window.innerWidth < 1024 ? 0 : index % 2 === 0 ? -0.55 : 0.55,
            ease: 'power1.inOut',
            onUpdate: apply,
            scrollTrigger: {
              trigger: `#${service.slug}`,
              start: 'top 85%',
              end: 'center 42%',
              scrub: 1.35,
            },
          })
        );
      });

      contexts.push(
        gsap.to(state, {
          opacity: 0,
          ease: 'none',
          onUpdate: apply,
          scrollTrigger: {
            trigger: '#services-contact',
            start: 'top 90%',
            end: 'top 45%',
            scrub: 1,
          },
        })
      );

      return () => contexts.forEach((tween) => tween.kill());
    },
    { dependencies: [render3D] }
  );

  const handleReady = useCallback(() => {
    document.documentElement.dataset.globeReady = '1';
    window.dispatchEvent(new CustomEvent('globe:ready'));
    window.dispatchEvent(new CustomEvent('services-globe:ready'));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {render3D ? (
        <HeroScene
          active={active}
          progressRef={progressRef}
          opacityRef={opacityRef}
          hoverRef={hoverRef}
          xRef={xRef}
          onReady={handleReady}
        />
      ) : null}
    </div>
  );
}
