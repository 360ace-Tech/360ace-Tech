import type { Metadata } from 'next';
import { ServicesPageTemplate } from '@/components/templates/services-page';
import { SiteShell } from '@/components/layout/site-shell';
import { services } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Cloud, Platform, SRE, AI & Data Services',
  description:
    'Explore 360ace.Tech services for cloud strategy, platform engineering, DevOps, site reliability, managed operations, and AI-ready data platforms.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'What we do | 360ace.Tech',
    description:
      'Practical cloud, platform, reliability, and AI data engineering services built around measurable outcomes.',
    url: '/services',
  },
};

export default function ServicesPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '360ace.Tech services',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.summary,
        url: `https://360ace.tech/services#${service.slug}`,
        provider: { '@type': 'Organization', name: '360ace.Tech' },
      },
    })),
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ServicesPageTemplate services={services} />
    </SiteShell>
  );
}
