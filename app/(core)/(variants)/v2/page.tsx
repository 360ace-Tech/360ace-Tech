import type { Metadata } from 'next';

import { CallToActionSection } from '@/components/sections/call-to-action';
import { DifferentiatorsSection } from '@/components/sections/differentiators';
import { InsightsSection } from '@/components/sections/insights';
import { ProcessSection } from '@/components/sections/process';
import { ServicesSection } from '@/components/sections/services';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { VariantTwoHero } from '@/components/variants/v2/hero';
import { VariantShell } from '@/components/variants/variant-shell';

export const metadata: Metadata = {
  title: 'Variant B — Immersive 3D Hero',
};

export default function VariantTwoPage() {
  return (
    <VariantShell variant="v2">
      <VariantTwoHero />
      <ServicesSection variant="v2" />
      <ProcessSection variant="v2" />
      <DifferentiatorsSection variant="v2" />
      <InsightsSection variant="v2" />
      <TestimonialsSection variant="v2" />
      <CallToActionSection variant="v2" />
    </VariantShell>
  );
}
