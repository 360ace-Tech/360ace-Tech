'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { heroContent } from '@/lib/site-content';
import { gsap, SplitText, useGSAP } from '@/lib/animation/gsap';
import { DUR, EASE, MOTION_OK, PIN_OK, STAGGER } from '@/lib/animation/config';

function buildStatTween(el: HTMLElement, tl: gsap.core.Timeline, position: number) {
  const raw = el.dataset.statTarget ?? el.textContent ?? '';
  const match = raw.match(/^([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return;
  const target = parseFloat(match[1]);
  const decimals = (match[1].split('.')[1] ?? '').length;
  const suffix = match[2] ?? '';
  const counter = { value: 0 };
  tl.to(
    counter,
    {
      value: target,
      duration: 1.3,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = counter.value.toFixed(decimals) + suffix;
      },
    },
    position
  );
}

export function HeroSection() {
  const sectionRef = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      // ----- Entrance (plays after the preloader hands off) -----
      mm.add(MOTION_OK, () => {
        const title = q('[data-hero-title]')[0];
        if (!title) return;
        // words wrapper keeps chars from wrapping mid-word on resize
        const split = SplitText.create(title, { type: 'lines,words,chars', mask: 'lines' });

        const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.reveal } });
        tl.from(split.chars, { yPercent: 115, duration: 1.05, stagger: STAGGER.chars }, 0.1)
          .from(q('[data-hero-eyebrow]'), { autoAlpha: 0, y: 18, duration: DUR.sm }, 0.05)
          .from(q('[data-hero-desc]'), { autoAlpha: 0, y: 22, duration: DUR.md }, 0.5)
          .from(
            q('[data-hero-ctas] > *'),
            { autoAlpha: 0, y: 22, duration: DUR.sm, stagger: 0.08 },
            0.65
          )
          .from(q('[data-hero-stats]'), { autoAlpha: 0, yPercent: 30, duration: DUR.md }, 0.75)
          .from(q('[data-hero-cue]'), { autoAlpha: 0, duration: DUR.sm }, 1.1);

        q('[data-stat-value]').forEach((el, index) => {
          buildStatTween(el as HTMLElement, tl, 0.85 + index * 0.08);
        });

        const play = () => tl.play();
        if (document.documentElement.dataset.preloadActive === '1') {
          window.addEventListener('preloader:done', play, { once: true });
          const failsafe = window.setTimeout(play, 3200);
          return () => {
            window.removeEventListener('preloader:done', play);
            window.clearTimeout(failsafe);
          };
        }
        play();
      });

      // ----- Pinned scroll scrub (desktop + motion only) -----
      mm.add(PIN_OK, () => {
        const desc = q('[data-hero-desc]')[0];
        if (!desc) return;
        const words = SplitText.create(desc, { type: 'words' }).words;
        gsap.set(words, { opacity: 0.3 });

        const scrub = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        scrub
          .to(words, { opacity: 1, stagger: 0.035, duration: 0.55, ease: 'none' }, 0)
          .to(q('[data-hero-title]'), { yPercent: -10, ease: 'none', duration: 1 }, 0)
          .to(q('[data-hero-cue]'), { autoAlpha: 0, duration: 0.1, ease: 'none' }, 0);
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-40 pt-32 lg:h-[calc(100svh-4rem)] lg:min-h-0 lg:pb-28"
    >
      <div className="container-edge relative z-10">
        <p
          data-hero-eyebrow
          className="chapter-label flex items-center gap-3"
          style={{ viewTransitionName: 'hero-eyebrow' }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
          {heroContent.eyebrow}
        </p>

        <h1
          data-hero-title
          className="mt-8 max-w-5xl font-display text-[clamp(2.9rem,7.5vw,6.8rem)] font-semibold leading-[0.96] tracking-[-0.03em]"
          style={{ viewTransitionName: 'hero-title' }}
        >
          {heroContent.title.split('GLOBAL')[0]}
          <span className="text-primary">GLOBAL</span>
          {heroContent.title.split('GLOBAL')[1]}
        </h1>

        <p
          data-hero-desc
          className="mt-8 max-w-xl text-lg leading-8 text-foreground lg:text-xl"
          style={{ viewTransitionName: 'hero-sub' }}
        >
          {heroContent.description}
        </p>

        <div data-hero-ctas className="mt-10 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" style={{ viewTransitionName: 'cta-primary' }}>
            <a href={heroContent.primaryCta.href}>{heroContent.primaryCta.label}</a>
          </Button>
          <Button asChild size="lg" variant="outline" style={{ viewTransitionName: 'cta-secondary' }}>
            <a href={heroContent.secondaryCta.href}>{heroContent.secondaryCta.label}</a>
          </Button>
        </div>

        <div className="h-72 sm:h-80 lg:hidden" aria-hidden />
      </div>

      {/* Stats strip */}
      <div
        data-hero-stats
        className="absolute inset-x-0 bottom-0 z-20 border-t border-border/70 bg-background/50 backdrop-blur-sm lg:bottom-4"
      >
        <div className="container-edge grid grid-cols-3 divide-x divide-border/70">
          {heroContent.stats.map((stat) => (
            <div key={stat.label} className="py-6 pr-4 first:pl-0 [&:not(:first-child)]:pl-6">
              <p
                data-stat-value
                data-stat-target={stat.value}
                className="font-display text-2xl font-semibold text-foreground sm:text-4xl"
              >
                {stat.value}
              </p>
              <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.65rem]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-hero-cue
        className="pointer-events-none absolute bottom-28 right-6 hidden items-center gap-3 md:flex lg:right-12"
        aria-hidden
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
          Scroll
        </span>
        <span className="h-px w-10 bg-primary" />
      </div>
    </section>
  );
}
