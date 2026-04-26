import { FadeIn } from '@/components/motion/fade-in';
import { Button } from '@/components/ui/button';
import { callToAction } from '@/lib/site-content';

export function CallToActionSection() {
  return (
    <section id="contact" className="full-page-section bg-background/30">
      <div className="container-edge">
        <FadeIn>
          <div className="cinematic-panel cta-reveal-card p-8 sm:p-12 lg:p-16">
            <div className="absolute inset-0 -z-10 opacity-40">
              <div className="absolute left-[-10%] top-[-30%] h-64 w-64 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute bottom-[-20%] right-[-20%] h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
            </div>
            <div className="relative space-y-6">
              <h2 className="cta-reveal-item text-3xl font-semibold sm:text-4xl">{callToAction.headline}</h2>
              <p className="cta-reveal-item max-w-2xl text-sm text-muted-foreground">{callToAction.copy}</p>
              <div className="cta-reveal-item flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <a href={callToAction.primaryCta.href}>{callToAction.primaryCta.label}</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={callToAction.secondaryCta.href}>{callToAction.secondaryCta.label}</a>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
