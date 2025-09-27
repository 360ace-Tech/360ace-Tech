import { FadeIn } from '@/components/motion/fade-in';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { services } from '@/lib/site-content';
import { cn } from '@/lib/utils';

export function ServicesSection({ variant = 'v1' }: { variant?: 'v1' | 'v2' | 'v3' }) {
  return (
    <section id="services" className={cn('py-24', variant === 'v3' ? 'bg-white text-slate-900' : 'bg-background/30')}> 
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
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <FadeIn key={service.name} delay={index * 0.05}>
              <Card className={cn('h-full bg-card/70', variant === 'v3' && 'border-slate-200 bg-white')}>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription className={cn(variant === 'v3' && 'text-slate-500')}>
                    {service.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.outcomes.map((outcome) => (
                      <li key={outcome} className={cn('leading-relaxed', variant === 'v3' && 'text-slate-600')}>
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
