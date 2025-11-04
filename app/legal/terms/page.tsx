import type { Metadata } from 'next';
import { LegalPage } from '@/components/templates/legal-page';
import { legalTerms } from '@/lib/site-content';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <LegalPage
      title={legalTerms.title}
      lastUpdated={legalTerms.lastUpdated}
      intro={legalTerms.intro}
      sections={legalTerms.sections}
    />
  );
}

