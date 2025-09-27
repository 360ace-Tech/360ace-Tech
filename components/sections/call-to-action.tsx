import { FadeIn } from '@/components/motion/fade-in';
import { Button } from '@/components/ui/button';
import { callToAction } from '@/lib/site-content';
import { cn } from '@/lib/utils';

export function CallToActionSection({ variant = 'v1' }: { variant?: 'v1' | 'v2' | 'v3' }) {
  return (
    <section id="contact" className={cn('py-24', variant === 'v3' ? 'bg-slate-900 text-slate-100' : 'bg-background/30')}>
      <div className="container-edge">
        <FadeIn>
          <div
            className={cn(
              'relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-primary/25 via-transparent to-secondary/20 p-12 shadow-2xl',
              variant === 'v3' && 'border-slate-700 from-slate-800 via-slate-900 to-slate-800',
            )}
          >
            <div className="absolute inset-0 -z-10 opacity-40">
              <div className="absolute left-[-10%] top-[-30%] h-64 w-64 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute bottom-[-20%] right-[-20%] h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
            </div>
            <div className="relative space-y-6">
              <h2 className="text-3xl font-semibold sm:text-4xl">{callToAction.headline}</h2>
              <p className="max-w-2xl text-sm text-muted-foreground">{callToAction.copy}</p>
              <div className="flex flex-wrap gap-4">
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
