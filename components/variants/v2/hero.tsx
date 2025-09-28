"use client";

import dynamic from 'next/dynamic';

import { FadeIn } from '@/components/motion/fade-in';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { heroContent } from '@/lib/site-content';

const HeroOrbit = dynamic(() => import('@/components/three/hero-orbit').then((mod) => mod.HeroOrbitScene), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-3xl bg-white/5" />,
});

export function VariantTwoHero() {
  return (
    <section id="home" className="variant-theme-v2 hero-bg relative overflow-hidden py-28">
      <div className="container-edge relative z-10 grid gap-16 lg:grid-cols-2">
        <div className="space-y-8">
          <FadeIn>
            <Badge
              variant="subtle"
              className="bg-background/60 text-foreground backdrop-blur-sm border border-white/10 dark:border-white/10"
            >
              {heroContent.eyebrow}
            </Badge>
          </FadeIn>
          <FadeIn>
            <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {heroContent.title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="max-w-2xl text-lg text-muted-foreground lg:text-xl">{heroContent.description}</p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <a href={heroContent.primaryCta.href}>{heroContent.primaryCta.label}</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={heroContent.secondaryCta.href}>{heroContent.secondaryCta.label}</a>
              </Button>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.1}>
          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-black/50">
            <HeroOrbit />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </FadeIn>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/20 via-transparent to-transparent" />
        <div className="absolute bottom-[-10%] left-[10%] h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute right-[5%] top-[10%] h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />
      </div>
    </section>
  );
}
