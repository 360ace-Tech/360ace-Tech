"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';

import { FadeIn } from '@/components/motion/fade-in';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { heroContent } from '@/lib/site-content';

const HeroOrbit = dynamic(
  () => import('@/components/three/hero-orbit').then((m) => m.HeroOrbitScene),
  {
    ssr: false,
    loading: () => (
      <div className="h-[240px] w-[240px] rounded-full border border-white/10 bg-gradient-to-br from-primary/15 via-background to-secondary/15 lg:h-[300px] lg:w-[300px]" />
    ),
  },
);

export function VariantTwoHero() {
  const heroRef = React.useRef<HTMLElement>(null);
  const [activeWordIndex, setActiveWordIndex] = React.useState(0);
  const titleParts = heroContent.title.split('GLOBAL');
  const descriptionWords = heroContent.description.split(' ');

  React.useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = hero.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      setActiveWordIndex(Math.min(descriptionWords.length - 1, Math.floor(progress * descriptionWords.length)));
    };
    const requestUpdate = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [descriptionWords.length]);

  return (
    <section ref={heroRef} id="home" className="variant-theme-v2 hero-bg hero-scroll-scene">
      <div className="hero-scroll-sticky">
        <div className="container-edge relative z-10 flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start lg:gap-x-16 lg:gap-y-8">
          {/* Text content */}
          <div className="order-1 space-y-8">
          <FadeIn>
            <Badge
              variant="subtle"
              className="border border-white/10 bg-background/60 text-foreground shadow-lg backdrop-blur-sm dark:border-white/10"
              style={{ viewTransitionName: 'hero-eyebrow' }}
            >
              {heroContent.eyebrow}
            </Badge>
          </FadeIn>
          <FadeIn>
            <h1
              className="max-w-4xl text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-6xl xl:text-7xl"
              style={{ viewTransitionName: 'hero-title' }}
            >
              {titleParts[0]}
              <span className="hero-global-word">GLOBAL</span>
              {titleParts[1]}
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              className="hero-description-words max-w-2xl text-lg leading-8 text-muted-foreground lg:text-xl"
              style={{ viewTransitionName: 'hero-sub' }}
            >
              {descriptionWords.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  data-active={activeWordIndex === index ? 'true' : 'false'}
                  style={{ '--word-index': index } as React.CSSProperties}
                >
                  {word}
                  {index < descriptionWords.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" variant="secondary" style={{ viewTransitionName: 'cta-primary' }}>
                <a href={heroContent.primaryCta.href}>{heroContent.primaryCta.label}</a>
              </Button>
              <Button asChild size="lg" variant="outline" style={{ viewTransitionName: 'cta-secondary' }}>
                <a href={heroContent.secondaryCta.href}>{heroContent.secondaryCta.label}</a>
              </Button>
            </div>
          </FadeIn>
          </div>

          {/* Globe — mobile: order 2 (between text and stats), desktop: col 2 spanning both rows */}
          <FadeIn delay={0.1} className="order-2 flex justify-center lg:row-span-2 lg:justify-end">
            <div className="grid min-h-[300px] w-full max-w-[560px] place-items-center sm:min-h-[440px]">
              <div className="origin-center scale-100 sm:scale-[1.18] lg:scale-[1.46]">
              <HeroOrbit />
              </div>
            </div>
          </FadeIn>

          {/* Stats — mobile: order 3 (after globe), desktop: col 1 row 2 */}
          <FadeIn delay={0.2} className="order-3">
            <div className="grid gap-3 sm:grid-cols-3">
              {heroContent.stats.map((stat) => (
                <div key={stat.label} className="cinematic-panel px-5 py-4">
                  <div className="relative">
                    <p className="text-2xl font-semibold text-gradient-primary">{stat.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/25 via-transparent to-transparent" />
          <div className="absolute bottom-[-16%] left-[5%] h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute right-[0%] top-[8%] h-[32rem] w-[32rem] rounded-full bg-secondary/25 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
