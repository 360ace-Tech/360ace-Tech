import { FadeIn } from '@/components/motion/fade-in';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { heroContent } from '@/lib/site-content';

export function VariantThreeHero() {
  return (
    <section id="home" className="variant-theme-v3 hero-bg relative overflow-hidden py-24 text-slate-900">
      <div className="container-edge grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <FadeIn>
            <Badge variant="subtle" className="bg-slate-900/5 text-slate-700">
              {heroContent.eyebrow}
            </Badge>
          </FadeIn>
          <FadeIn>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {heroContent.title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="max-w-2xl text-lg text-slate-600 lg:text-xl">{heroContent.description}</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <a href={heroContent.primaryCta.href}>{heroContent.primaryCta.label}</a>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href={heroContent.secondaryCta.href}>{heroContent.secondaryCta.label}</a>
              </Button>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.1}>
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
            <header className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Featured perspective</p>
              <h2 className="text-2xl font-semibold text-slate-900">From discovery to ongoing excellence</h2>
            </header>
            <p className="mt-6 text-sm text-slate-600">
              Our consulting playbooks help leadership teams connect strategy to delivery: visualising value streams, prioritising
              use-cases, and orchestrating the capabilities needed to ship and scale reliable products faster.
            </p>
            <footer className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
              <div>
                <p className="font-medium text-slate-900">360ace.Tech Research Guild</p>
                <p>Quarterly insights &amp; practitioner interviews</p>
              </div>
            </footer>
          </article>
        </FadeIn>
      </div>
    </section>
  );
}

