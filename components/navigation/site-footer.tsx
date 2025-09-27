import type { Route } from 'next';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { company } from '@/lib/site-content';

const footerLinks = [
  {
    title: 'Services',
    links: [
      { label: 'Cloud Strategy', href: '/#services' },
      { label: 'Platform Engineering', href: '/#services' },
      { label: 'Site Reliability', href: '/#services' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Playbooks', href: '#resources' },
      { label: 'Case studies', href: '#insights' },
    ],
  },
];

export function SiteFooter({ variant }: { variant?: 'v1' | 'v2' | 'v3' }) {
  return (
    <footer className={variant === 'v3' ? 'bg-white text-slate-900' : 'bg-background/40'}>
      <div className="container-edge grid gap-10 border-t border-white/10 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <Badge variant="subtle" className="bg-primary/10 text-primary">
            {company.name}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {company.summary}
          </p>
          <div className="text-sm">
            <span className="font-medium">Let’s collaborate:</span>{' '}
            <a className="underline-offset-4 hover:underline" href={`mailto:${company.contactEmail}`}>
              {company.contactEmail}
            </a>
          </div>
        </div>
        {footerLinks.map((column) => (
          <div key={column.title} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {column.title}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {column.links.map((link) => {
                const isAnchor = link.href.startsWith('/#');
                const href = isAnchor ? link.href.replace('/#', variant ? `/${variant}#` : '#') : link.href;
                return (
                  <li key={link.label}>
                    {isAnchor ? (
                      <a className="hover:text-foreground" href={href}>
                        {link.label}
                      </a>
                    ) : (
                      <Link className="hover:text-foreground" href={href as Route}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div className="space-y-3 text-sm text-muted-foreground">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Stay informed</h3>
          <p>Insights on DevOps, SRE, AI-ready platforms, and delivery rituals straight to your inbox.</p>
          <p className="text-xs">Subscribe form coming soon as part of the marketing automation track.</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {company.name}. All rights reserved.
      </div>
    </footer>
  );
}
