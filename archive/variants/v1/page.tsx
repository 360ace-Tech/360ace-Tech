import type { Metadata } from 'next';

import { CallToActionSection } from '@/components/sections/call-to-action';
import { DifferentiatorsSection } from '@/components/sections/differentiators';
import { InsightsSection } from '@/components/sections/insights';
import { ProcessSection } from '@/components/sections/process';
import { ServicesSection } from '@/components/sections/services';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { VariantOneHero } from '@/components/variants/v1/hero';
import { VariantShell } from '@/components/variants/variant-shell';

export const metadata: Metadata = {
  title: 'Variant A — Minimal Performance-First',
};

export default function VariantOnePage() {
  return (
    <VariantShell variant="v1">
      <VariantOneHero />
      <ServicesSection variant="v1" />
      <ProcessSection variant="v1" />
      <DifferentiatorsSection variant="v1" />
      <InsightsSection variant="v1" />
      <TestimonialsSection variant="v1" />
      <CallToActionSection variant="v1" />
    </VariantShell>
  );
}

