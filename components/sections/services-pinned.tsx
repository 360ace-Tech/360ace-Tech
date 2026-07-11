'use client';

import { useRef } from 'react';
import { services } from '@/lib/site-content';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { DUR, EASE, MOTION_OK, PIN_OK_LG } from '@/lib/animation/config';
import { SplitHeading } from '@/components/motion/split-heading';
import { Reveal } from '@/components/motion/reveal';

/**
 * Pinned horizontal scrub gallery. On desktop with motion enabled the
 * section pins and the four service panels translate horizontally as the
 * user scrolls; outcome bullets stagger in as each panel crosses in.
 * Everywhere else the same panels render as a vertical stack with simple
 * reveals — identical content, no pin.
 */
export function ServicesPinned() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(PIN_OK_LG, () => {
        const track = root.querySelector<HTMLElement>('.services-track');
        const progress = root.querySelector<HTMLElement>('[data-services-progress]');
        if (!track) return;

        root.dataset.horizontal = 'true';

        const distance = () => track.scrollWidth - window.innerWidth;
        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${distance()}`,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        if (progress) {
          gsap.fromTo(
            progress,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top top',
                end: () => `+=${distance()}`,
                scrub: true,
              },
            }
          );
        }

        gsap.utils.toArray<HTMLElement>('[data-service-panel]', root).forEach((panel) => {
          gsap.from(panel.querySelectorAll('[data-outcome]'), {
            autoAlpha: 0,
            y: 26,
            stagger: 0.09,
            duration: 0.6,
            ease: EASE.out,
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: panel,
              start: 'left 72%',
            },
          });
        });

        return () => {
          delete root.dataset.horizontal;
        };
      });

      // Stacked layout (below lg / no pin): simple per-panel reveals.
      mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
        gsap.utils.toArray<HTMLElement>('[data-service-panel]', root).forEach((panel) => {
          gsap.from(panel, {
            autoAlpha: 0,
            y: 32,
            duration: DUR.md,
            ease: EASE.reveal,
            scrollTrigger: { trigger: panel, start: 'top 88%', once: true },
          });
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="services-scene relative">
      <div className="flex min-h-[100svh] flex-col justify-center gap-12 overflow-hidden py-20 lg:gap-16">
        <div className="container-edge">
          <Reveal>
            <p className="chapter-label">01 / What we do</p>
          </Reveal>
          <SplitHeading
            className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl lg:text-6xl"
            unit="words"
          >
            Service lines built for scale
          </SplitHeading>
        </div>

        <div className="container-edge flex-1 lg:contents">
          <div className="services-track space-y-6 lg:space-y-0 lg:pl-[max(3rem,calc((100vw-1600px)/2+4rem))] lg:pr-24">
            {services.map((service, index) => (
                <article
                  key={service.name}
                  data-service-panel
                  className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-8 sm:p-10 lg:p-12"
                >
                  <span
                    className="text-outline pointer-events-none absolute -right-4 -top-10 font-display text-[9rem] font-bold leading-none lg:text-[13rem]"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="relative">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-4 max-w-md font-display text-2xl font-semibold sm:text-3xl lg:text-4xl">
                      {service.name}
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {service.summary}
                    </p>
                  </div>
                  <ul className="relative mt-10 space-y-3 border-t border-border pt-6">
                    {service.outcomes.map((outcome) => (
                      <li key={outcome} data-outcome className="flex items-start gap-3 text-sm">
                        <span className="mt-2 inline-block h-1 w-4 shrink-0 bg-primary" aria-hidden />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </article>
            ))}
          </div>
        </div>

        <div className="container-edge hidden lg:block">
          <div className="hairline relative overflow-hidden">
            <div
              data-services-progress
              className="absolute inset-0 origin-left bg-primary"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
