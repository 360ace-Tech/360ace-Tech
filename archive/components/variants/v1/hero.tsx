import { FadeIn } from '@/components/motion/fade-in';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { heroContent } from '@/lib/site-content';

export function VariantOneHero() {
  return (
    <section id="home" className="variant-theme-v1 hero-bg relative overflow-hidden py-24">
      <div className="container-edge relative z-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <FadeIn>
            <Badge variant="subtle" className="bg-white/10 text-white">
              {heroContent.eyebrow}
            </Badge>
          </FadeIn>
          <FadeIn>
            <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-gradient-primary">{heroContent.title}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="max-w-2xl text-lg text-muted-foreground lg:text-xl">{heroContent.description}</p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={heroContent.primaryCta.href}>{heroContent.primaryCta.label}</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={heroContent.secondaryCta.href}>{heroContent.secondaryCta.label}</a>
              </Button>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.2}>
          <div className="glass-panel relative overflow-hidden rounded-3xl p-8">
            <div className="absolute inset-0 -z-10 dot-grid opacity-20" />
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Impact snapshot</p>
              <ul className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
                {heroContent.stats.map((stat) => (
                  <li key={stat.label} className="space-y-1">
                    <span className="text-3xl font-semibold text-gradient-primary">{stat.value}</span>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-0 mix-blend-screen">
        <div className="absolute left-[-10%] top-[-10%] h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />
      </div>
    </section>
  );
}

