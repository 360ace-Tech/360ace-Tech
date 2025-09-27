import { FadeIn } from '@/components/motion/fade-in';
import { differentiators } from '@/lib/site-content';
import { cn } from '@/lib/utils';

export function DifferentiatorsSection({ variant = 'v1' }: { variant?: 'v1' | 'v2' | 'v3' }) {
  return (
    <section className={cn('py-24', variant === 'v3' ? 'bg-white text-slate-900' : 'bg-background/10')}>
      <div className="container-edge space-y-12">
        <FadeIn>
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Why teams choose 360ace.Tech</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">From templates to transformation</h2>
          </div>
        </FadeIn>
        <div className="grid gap-8 lg:grid-cols-3">
          {differentiators.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.05}>
              <div
                className={cn(
                  'group relative overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-8 shadow-lg transition-transform hover:-translate-y-1',
                  variant === 'v3' && 'border-slate-200 bg-white shadow-2xl',
                )}
              >
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
