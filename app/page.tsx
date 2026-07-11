import type { Metadata } from 'next';

import { CallToActionSection } from '@/components/sections/call-to-action';
import { DifferentiatorsSection } from '@/components/sections/differentiators';
import { InsightsSection } from '@/components/sections/insights';
import { ProcessSection } from '@/components/sections/process';
import { ServicesSection } from '@/components/sections/services';
import { HeroSection } from '@/components/sections/hero';
import { GlobeBackground } from '@/components/three/globe-background';
import { SiteShell } from '@/components/layout/site-shell';

export const metadata: Metadata = {
  title: '360ace.Tech',
};

export default function RootPage() {
  return (
    <SiteShell>
      <GlobeBackground />
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <DifferentiatorsSection />
      <InsightsSection />
      {/* Stories/testimonials temporarily hidden */}
      <CallToActionSection />
    </SiteShell>
  );
}
