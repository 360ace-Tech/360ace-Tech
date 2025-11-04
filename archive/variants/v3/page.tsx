import type { Metadata } from 'next';

import { CallToActionSection } from '@/components/sections/call-to-action';
import { DifferentiatorsSection } from '@/components/sections/differentiators';
import { InsightsSection } from '@/components/sections/insights';
import { ProcessSection } from '@/components/sections/process';
import { ServicesSection } from '@/components/sections/services';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { VariantThreeHero } from '@/components/variants/v3/hero';
import { VariantShell } from '@/components/variants/variant-shell';

export const metadata: Metadata = {
  title: 'Variant C — Editorial Brand Story',
};

export default function VariantThreePage() {
  return (
    <VariantShell variant="v3">
      <VariantThreeHero />
      <ServicesSection variant="v3" />
      <ProcessSection variant="v3" />
      <DifferentiatorsSection variant="v3" />
      <InsightsSection variant="v3" />
      <TestimonialsSection variant="v3" />
      <CallToActionSection variant="v3" />
    </VariantShell>
  );
}

