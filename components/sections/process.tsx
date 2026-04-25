import { FadeIn } from '@/components/motion/fade-in';
import { ExpandingCardsSection } from '@/components/sections/expanding-cards-section';
import { process } from '@/lib/site-content';

export function ProcessSection() {
  const cards = process.map((step) => ({
    index: step.id,
    title: step.title,
    heading: step.heading,
    description: step.description,
  }));

  return (
    <section id="process" className="full-page-section bg-background/10">
      <div className="container-edge space-y-12">
        <FadeIn>
          <div className="max-w-2xl space-y-4">
            <p className="chapter-label">Delivery rhythm</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">How we partner with your teams</h2>
            <p className="text-sm text-muted-foreground">
              Inspired by our original{' '}
              <span className="process-path" aria-label="PLAN to DESIGN to BUILD to DEPLOY">
                <span>PLAN</span>
                <span className="process-path__arrow" aria-hidden="true">→</span>
                <span>DESIGN</span>
                <span className="process-path__arrow" aria-hidden="true">→</span>
                <span>BUILD</span>
                <span className="process-path__arrow" aria-hidden="true">→</span>
                <span>DEPLOY</span>
              </span>{' '}
              journey, we now layer research gates, ADRs, and continuous learning loops that keep outcomes front and centre.
            </p>
          </div>
        </FadeIn>
        <ExpandingCardsSection ariaLabel="Delivery rhythm" cards={cards} variant="stack" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
      </div>
    </section>
  );
}
