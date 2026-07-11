'use client';

import { useRef } from 'react';
import { process } from '@/lib/site-content';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/animation/gsap';
import { PIN_OK_LG } from '@/lib/animation/config';
import { SplitHeading } from '@/components/motion/split-heading';
import { Reveal } from '@/components/motion/reveal';

const PATH = ['PLAN', 'DESIGN', 'BUILD', 'DEPLOY'];

/**
 * Pinned step timeline. On desktop the intro column pins while the four
 * steps scroll past; a vertical accent line draws with overall progress and
 * the step nearest the viewport centre is highlighted. Below lg / reduced
 * motion: a simple stacked list with reveals.
 */
export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      mm.add(PIN_OK_LG, () => {
        const intro = section.querySelector<HTMLElement>('[data-process-intro]');
        const steps = gsap.utils.toArray<HTMLElement>('[data-process-step]', section);
        const line = section.querySelector<HTMLElement>('[data-process-line]');
        if (!intro || steps.length === 0) return;

        section.dataset.pinned = 'true';

        ScrollTrigger.create({
          trigger: section,
          start: 'top top+=96',
          end: () => `bottom bottom-=120`,
          pin: intro,
          pinSpacing: false,
        });

        if (line) {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top center',
                end: 'bottom bottom-=120',
                scrub: true,
              },
            }
          );
        }

        steps.forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 60%',
            end: 'bottom 40%',
            toggleClass: { targets: step, className: 'is-active' },
          });
        });

        return () => {
          delete section.dataset.pinned;
        };
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="process" className="process-scene relative py-24 lg:py-40">
      <div className="container-edge grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24">
        {/* Intro column (pins on desktop) */}
        <div>
          <div data-process-intro className="space-y-6 lg:pt-2">
            <Reveal>
              <p className="chapter-label">02 / Delivery rhythm</p>
            </Reveal>
            <SplitHeading
              className="max-w-xl font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl"
              unit="words"
            >
              How we partner with your teams
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Inspired by our original{' '}
                <span
                  className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-foreground"
                  aria-label="PLAN to DESIGN to BUILD to DEPLOY"
                >
                  {PATH.map((word, i) => (
                    <span key={word}>
                      {word}
                      {i < PATH.length - 1 ? <span className="mx-1 text-primary">→</span> : null}
                    </span>
                  ))}
                </span>{' '}
                journey, we now layer research gates, ADRs, and continuous learning loops that keep
                outcomes front and centre.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Steps column */}
        <div className="relative">
          {/* Progress line */}
          <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-border lg:block" aria-hidden>
            <div
              data-process-line
              className="absolute inset-0 origin-top bg-primary"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          <ol className="space-y-16 lg:space-y-32 lg:pl-12">
            {process.map((step) => (
              <li key={step.id} data-process-step>
                <Reveal>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                    {step.id} / {step.title}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
                    {step.heading}
                  </h3>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {step.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
