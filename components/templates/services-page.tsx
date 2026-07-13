'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Layers3 } from 'lucide-react';
import { Link } from 'next-view-transitions';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { SplitHeading } from '@/components/motion/split-heading';
import { ServicesGlobeBackground } from '@/components/three/services-globe-background';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { EASE, MOTION_OK } from '@/lib/animation/config';
import { getLenis } from '@/lib/animation/lenis-store';
import type { Service } from '@/lib/site-content';
import { cn } from '@/lib/utils';

const HEADER_OFFSET = -132;
const engagementStages = [
  {
    title: 'Assess',
    copy: 'Align the business objective, current state, constraints, risks, and measures of success.',
  },
  {
    title: 'Roadmap',
    copy: 'Turn discovery into an executable architecture and prioritised delivery plan.',
  },
  {
    title: 'Implement',
    copy: 'Build the capability with your team using reusable, production-ready engineering patterns.',
  },
  {
    title: 'Enable',
    copy: 'Transfer knowledge, document ownership, and make the new operating model sustainable.',
  },
  {
    title: 'Improve',
    copy: 'Measure results and iterate through focused reliability, cost, security, and delivery reviews.',
  },
];

function goToService(slug: string) {
  const target = document.getElementById(slug);
  if (!target) return;
  history.replaceState(null, '', `/services#${slug}`);
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(target, { offset: HEADER_OFFSET, duration: 1.25 });
  else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function ServicesPageTemplate({ services }: { services: Service[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState(services[0].slug);

  useEffect(() => {
    const sections = services
      .map((service) => document.getElementById(service.slug))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveService(visible.target.id);
      },
      { rootMargin: '-24% 0px -58% 0px', threshold: [0, 0.15, 0.4] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [services]);

  useEffect(() => {
    const slug = decodeURIComponent(window.location.hash.slice(1));
    if (!services.some((service) => service.slug === slug)) return;
    const timer = window.setTimeout(() => goToService(slug), 450);
    return () => window.clearTimeout(timer);
  }, [services]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-service-detail]', root).forEach((section) => {
          const items = section.querySelectorAll('[data-service-reveal]');
          gsap.from(items, {
            autoAlpha: 0,
            y: 28,
            duration: 0.75,
            stagger: 0.07,
            ease: EASE.reveal,
            scrollTrigger: { trigger: section, start: 'top 72%', once: true },
          });
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="relative w-full max-w-[100vw] overflow-x-clip">
      <ServicesGlobeBackground sectionSlugs={services.map((service) => service.slug)} />

      <section className="relative z-10 flex min-h-[82svh] items-center overflow-hidden border-b border-border/70 py-24 lg:min-h-[88svh]">
        <div className="container-edge min-w-0 max-w-full pt-10">
          <Reveal immediate>
            <p className="chapter-label">What we do</p>
          </Reveal>
          <SplitHeading
            as="h1"
            unit="words"
            start="top 95%"
            className="mt-6 max-w-3xl break-words font-display text-[2.45rem] font-semibold leading-[0.98] sm:text-6xl lg:text-[clamp(4rem,7vw,6.5rem)] lg:leading-[0.94]"
          >
            Engineering clarity into every layer.
          </SplitHeading>
          <Reveal immediate delay={0.2} className="mt-8 min-w-0 max-w-2xl">
            <p className="max-w-full text-base leading-relaxed text-muted-foreground sm:text-lg">
              From the first cloud decision to reliable production operations, we help teams design,
              build, and run platforms that create measurable business value.
            </p>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild size="lg">
                <Link href={'/contact' as Route}>Start a conversation</Link>
              </Button>
              <button
                type="button"
                onClick={() => goToService(services[0].slug)}
                className="group inline-flex h-12 items-center gap-3 px-2 text-sm font-medium"
              >
                Explore services
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <nav
        aria-label="Service sections"
        className="sticky top-16 z-40 w-full max-w-[100vw] overflow-hidden border-b border-border/80 bg-background/88 backdrop-blur-xl"
      >
        <div className="container-edge w-full max-w-full overflow-x-auto" data-lenis-prevent>
          <div className="flex min-w-max">
            {services.map((service, index) => {
              const active = activeService === service.slug;
              return (
                <a
                  key={service.slug}
                  href={`#${service.slug}`}
                  aria-current={active ? 'location' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    goToService(service.slug);
                  }}
                  className={cn(
                    'relative flex h-16 items-center gap-3 px-4 font-mono text-[0.68rem] uppercase transition-colors sm:px-6',
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="text-primary">0{index + 1}</span>
                  {service.shortName}
                  <span
                    className={cn(
                      'absolute inset-x-4 bottom-0 h-0.5 origin-left bg-primary transition-transform duration-500 sm:inset-x-6',
                      active ? 'scale-x-100' : 'scale-x-0'
                    )}
                  />
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        {services.map((service, index) => (
          <section
            id={service.slug}
            key={service.slug}
            data-service-detail
            className="scroll-mt-36 border-b border-border/70 py-24 sm:py-28 lg:py-36"
          >
            <div className="container-edge">
              <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
                <div className="lg:sticky lg:top-40 lg:self-start">
                  <p data-service-reveal className="chapter-label text-primary">
                    0{index + 1} / {service.shortName}
                  </p>
                  <h2
                    data-service-reveal
                    className="mt-5 max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
                  >
                    {service.name}
                  </h2>
                  <p data-service-reveal className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                    {service.problem}
                  </p>
                  <div data-service-reveal className="mt-8">
                    <Button asChild variant="outline">
                      <Link href={'/contact' as Route} className="group gap-2">
                        Discuss this service
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div data-service-reveal className="border-t border-border bg-card/70 p-6 backdrop-blur-sm sm:p-8">
                    <div className="flex items-center gap-3">
                      <Layers3 className="h-5 w-5 text-primary" />
                      <h3 className="font-display text-xl font-semibold">What we do</h3>
                    </div>
                    <ul className="mt-6 divide-y divide-border">
                      {service.activities.map((activity) => (
                        <li key={activity} className="flex gap-4 py-4 text-sm leading-relaxed sm:text-base">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div data-service-reveal className="border-t border-primary bg-card/70 p-6 backdrop-blur-sm sm:p-8">
                      <h3 className="font-display text-xl font-semibold">What you receive</h3>
                      <ul className="mt-6 space-y-4">
                        {service.deliverables.map((deliverable) => (
                          <li key={deliverable} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div data-service-reveal className="border-t border-border bg-background/75 p-6 backdrop-blur-sm sm:p-8">
                      <h3 className="font-display text-xl font-semibold">Capabilities</h3>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {service.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="border border-border bg-card px-3 py-2 font-mono text-[0.65rem] uppercase text-muted-foreground"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div data-service-reveal className="border-t border-border bg-card/70 p-6 backdrop-blur-sm sm:p-8 md:col-span-2">
                      <h3 className="font-display text-xl font-semibold">Expected outcomes</h3>
                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        {service.outcomes.map((outcome, outcomeIndex) => (
                          <div key={outcome} className="border-l border-primary pl-4">
                            <span className="font-mono text-[0.65rem] text-primary">
                              {String(outcomeIndex + 1).padStart(2, '0')}
                            </span>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{outcome}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="relative z-10 border-b border-border/70 bg-background/80 py-24 backdrop-blur-sm lg:py-32">
        <div className="container-edge">
          <p className="chapter-label">How an engagement works</p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <h2 className="max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Start where the constraint is clearest.
              </h2>
              <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
                Engagements can begin as a focused assessment, a proof of value, or a delivery programme. Each one leaves your team with usable assets and clearer ownership.
              </p>
            </div>
            <ol className="divide-y divide-border border-t border-border">
              {engagementStages.map((stage, index) => (
                <li key={stage.title} className="grid gap-3 py-6 sm:grid-cols-[3rem_8rem_1fr] sm:items-start">
                  <span className="font-mono text-xs text-primary">0{index + 1}</span>
                  <h3 className="font-display text-lg font-semibold">{stage.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{stage.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="services-contact" className="relative z-10 overflow-hidden bg-primary py-24 text-primary-foreground lg:py-32">
        <div className="container-edge">
          <p className="font-mono text-xs uppercase">Start with the outcome</p>
          <h2 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-7xl">
            Build the capability your next stage demands.
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-primary-foreground/75 lg:text-lg">
            We can begin with a focused assessment, a production proof of value, or an implementation roadmap shaped around your team and constraints.
          </p>
          <Button asChild size="lg" className="mt-10 bg-background text-foreground hover:bg-background/90">
            <Link href={'/contact' as Route}>Book a discovery call</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
