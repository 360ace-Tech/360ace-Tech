import { FadeIn } from '@/components/motion/fade-in';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { services } from '@/lib/site-content';
import { CardRail } from '@/components/ui/card-rail';

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-background/30"> 
      <div className="container-edge space-y-10">
        <FadeIn>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Capabilities
              </p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">What we deliver</h2>
            </div>
            <p className="max-w-xl text-sm text-muted-foreground">
              Proven playbooks for platform engineering, DevOps, and AI-ready architectures—customised for your mission, industry, and compliance needs.
            </p>
          </div>
        </FadeIn>
        {/* Mobile: CardRail; Desktop: grid */}
        <div className="nav:hidden -mx-6">
          <CardRail ariaLabel="Capabilities">
            {services.map((service, index) => (
              <div key={service.name} className="min-w-[80vw] snap-center">
                <FadeIn delay={0.03 + index * 0.06} dir={index % 2 === 0 ? 'left' : 'right'}>
                  <Card className="h-full bg-card/70">
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {service.outcomes.map((outcome) => (
                          <li key={outcome} className="leading-relaxed">• {outcome}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
            ))}
          </CardRail>
        </div>
        <div className="hidden gap-6 nav:grid nav:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <FadeIn key={service.name} delay={0.04 + index * 0.08} dir={index % 2 === 0 ? 'left' : 'right'}>
              <Card className="h-full bg-card/70">
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>
                    {service.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.outcomes.map((outcome) => (
                      <li key={outcome} className="leading-relaxed">
                        • {outcome}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
