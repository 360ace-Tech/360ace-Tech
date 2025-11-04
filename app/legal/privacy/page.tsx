import type { Metadata } from 'next';
import { LegalPage } from '@/components/templates/legal-page';
import { legalPrivacy } from '@/lib/site-content';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <LegalPage
      title={legalPrivacy.title}
      lastUpdated={legalPrivacy.lastUpdated}
      intro={legalPrivacy.intro}
      sections={legalPrivacy.sections}
    />
  );
}

