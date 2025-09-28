import { FadeIn } from '@/components/motion/fade-in';
import { testimonials } from '@/lib/site-content';

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background/20">
      <div className="container-edge space-y-12">
        <FadeIn>
          <div className="max-w-xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Trusted by ambitious teams</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Stories from the teams we support</h2>
          </div>
        </FadeIn>
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.name} delay={index * 0.05}>
              <blockquote className="h-full rounded-3xl border border-white/10 bg-card/60 p-8 text-lg leading-relaxed shadow-lg">
                “{testimonial.quote}”
                <footer className="mt-6 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{testimonial.name}</span>
                  <span className="block">{testimonial.role}</span>
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
