import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/motion/magnetic';
import { Marquee } from '@/components/motion/marquee';
import { Reveal } from '@/components/motion/reveal';
import { SplitHeading } from '@/components/motion/split-heading';
import { callToAction, services } from '@/lib/site-content';

export function CallToActionSection() {
  const marqueeItems = services.map((service) => service.name);

  return (
    <section id="contact" className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="border-b border-primary-foreground/15 py-5">
        <Marquee items={marqueeItems} className="opacity-80" />
      </div>

      <div className="container-edge py-24 lg:py-36">
        <SplitHeading
          as="h2"
          unit="words"
          className="max-w-4xl font-display text-[clamp(2.6rem,6.5vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
        >
          {callToAction.headline}
        </SplitHeading>
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-primary-foreground/75 lg:text-lg">
            {callToAction.copy}
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-12 flex flex-wrap items-center gap-5">
            <Magnetic>
              <Button
                asChild
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
              >
                <a href={callToAction.primaryCta.href}>{callToAction.primaryCta.label}</a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <a href={callToAction.secondaryCta.href}>{callToAction.secondaryCta.label}</a>
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
