import { FadeIn } from '@/components/motion/fade-in';
import { differentiators } from '@/lib/site-content';
import { CardRail } from '@/components/ui/card-rail';

export function DifferentiatorsSection() {
  return (
    <section className="py-24 bg-background/10">
      <div className="container-edge space-y-12">
        <FadeIn>
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Why teams choose 360ace.Tech</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Outcomes that matter to your business</h2>
          </div>
        </FadeIn>
        {/* Mobile rail */}
        <div className="nav:hidden -mx-6">
          <CardRail ariaLabel="Differentiators">
            {differentiators.map((item, index) => (
              <div key={item.title} className="min-w-[80vw] snap-center">
                <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-8 shadow-lg transition-transform hover:-translate-y-1">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
                  </div>
                  <div className="relative space-y-4">
                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">{`0${index + 1}`}</span>
                    <h3 className="text-2xl font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardRail>
        </div>
        <div className="hidden gap-8 nav:grid nav:grid-cols-3">
          {differentiators.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.05}>
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-8 shadow-lg transition-transform hover:-translate-y-1">
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
                </div>
                <div className="relative space-y-4">
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">{`0${index + 1}`}</span>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
