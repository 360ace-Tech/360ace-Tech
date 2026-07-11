import { Reveal } from '@/components/motion/reveal';
import { FeatureRows } from '@/components/sections/feature-rows';
import { differentiators } from '@/lib/site-content';

export function DifferentiatorsSection() {
  const rows = differentiators.map((item, index) => ({
    index: `0${index + 1}`,
    title: item.title,
    description: item.description,
  }));

  return (
    <section className="relative py-24 lg:py-40">
      <div className="container-edge space-y-14">
        <Reveal>
          <div className="max-w-2xl space-y-5">
            <p className="chapter-label">03 / Why teams choose 360ace.Tech</p>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
              Outcomes that matter to your business
            </h2>
          </div>
        </Reveal>
        <FeatureRows ariaLabel="Differentiators" rows={rows} />
      </div>
    </section>
  );
}
