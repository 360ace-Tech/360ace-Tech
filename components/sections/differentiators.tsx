import { FadeIn } from '@/components/motion/fade-in';
import { ExpandingCardsSection } from '@/components/sections/expanding-cards-section';
import { differentiators } from '@/lib/site-content';

export function DifferentiatorsSection() {
  const cards = differentiators.map((item, index) => ({
    index: `0${index + 1}`,
    title: item.title,
    heading: item.title,
    description: item.description,
  }));

  return (
    <section className="full-page-section bg-background/20">
      <div className="container-edge space-y-12">
        <FadeIn>
          <div className="max-w-2xl space-y-4">
            <p className="chapter-label">Why teams choose 360ace.Tech</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Outcomes that matter to your business</h2>
          </div>
        </FadeIn>
        <ExpandingCardsSection ariaLabel="Differentiators" cards={cards} />
      </div>
    </section>
  );
}
