import type { Metadata } from 'next';

import { CallToActionSection } from '@/components/sections/call-to-action';
import { DifferentiatorsSection } from '@/components/sections/differentiators';
import { InsightsSection } from '@/components/sections/insights';
import { ProcessSection } from '@/components/sections/process';
import { ServicesSection } from '@/components/sections/services';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { VariantTwoHero } from '@/components/variants/v2/hero';
import { SiteShell } from '@/components/layout/site-shell';

export const metadata: Metadata = {
  title: '360ace.Tech',
};

export default function RootPage() {
  return (
    <SiteShell>
      <VariantTwoHero />
      <ServicesSection />
      <ProcessSection />
      <DifferentiatorsSection />
      <InsightsSection />
      <TestimonialsSection />
      <CallToActionSection />
    </SiteShell>
  );
}
