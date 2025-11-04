import { FadeIn } from '@/components/motion/fade-in';
import { process as processSteps } from '@/lib/site-content';
import { CardRail } from '@/components/ui/card-rail';

export function ProcessSection() {
  return (
    <section id="process" className="relative overflow-hidden py-24 bg-background/20">
      <div className="container-edge space-y-12">
        <FadeIn>
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Delivery rhythm</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">How we partner with your teams</h2>
            <p className="text-sm text-muted-foreground">
              Inspired by our original PLAN → DESIGN → BUILD → DEPLOY journey, we now layer research gates, ADRs, and continuous learning loops that keep outcomes front and centre.
            </p>
          </div>
        </FadeIn>
        {/* Mobile rail */}
        <div className="nav:hidden -mx-6">
          <CardRail ariaLabel="Delivery rhythm">
            {processSteps.map((step) => (
              <div key={step.id} className="min-w-[80vw] snap-center">
                <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-card/60 p-8 shadow-lg backdrop-blur-xl">
                  <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    <span className="text-lg text-gradient-primary">{step.id}</span>
                    {step.title}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold">{step.heading}</h3>
                  <p className="mt-4 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </CardRail>
        </div>
        {/* Desktop grid */}
        <div className="hidden gap-6 nav:grid nav:grid-cols-2">
          {processSteps.map((step, index) => (
            <FadeIn key={step.id} delay={index * 0.05}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-card/60 p-8 shadow-lg backdrop-blur-xl">
                <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  <span className="text-lg text-gradient-primary">{step.id}</span>
                  {step.title}
                </div>
                <h3 className="mt-4 text-2xl font-semibold">{step.heading}</h3>
                <p className="mt-4 text-sm text-muted-foreground">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
      </div>
    </section>
  );
}
