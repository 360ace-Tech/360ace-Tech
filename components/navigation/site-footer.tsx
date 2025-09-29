"use client";
import Link from 'next/link';
import { Mail, Linkedin } from 'lucide-react';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';

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
      { label: 'privacy', href: '/legal/privacy' },
      { label: 'terms', href: '/legal/terms' },
    ],
  },
];

export function SiteFooter() {
  const pathname = usePathname();
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('home');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '/#home');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.replaceState(null, '', '/');
      }
    }
  };
  return (
    <footer className="bg-background/40">
      <div className="container-edge grid gap-10 border-t border-white/10 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <Link href={'/#home' as Route} onClick={handleHomeClick} className="inline-block">
            <Badge variant="subtle" className="bg-primary/10 text-primary">
              {company.name}
            </Badge>
          </Link>
          <p className="text-sm text-muted-foreground">
            {company.summary}
          </p>
          <div className="text-sm">
            <span className="font-medium">Let’s collaborate:</span>
            <div className="mt-2 flex items-center gap-1">
              <Link aria-label="Email" href="/contact" className="group inline-flex items-center justify-center rounded-full p-0.5 text-foreground transition hover:bg-white/10">
                <Mail className="h-3 w-3 transition group-hover:scale-110" />
              </Link>
              <a aria-label="LinkedIn" href="https://www.linkedin.com/company/360ace-net" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center rounded-full p-0.5 text-foreground transition hover:bg-white/10">
                <Linkedin className="h-3 w-3 transition group-hover:scale-110" />
              </a>
            </div>
          </div>
        </div>
        {footerLinks.map((column) => (
          <div key={column.title} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {column.title}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
                {column.links.map((link) => {
                  return (
                    <li key={link.label}>
                      {link.href.startsWith('/#') || link.href.startsWith('#') ? (
                        <a className={`hover:text-foreground ${link.label === 'privacy' || link.label === 'terms' ? 'relative group' : ''}`} href={link.href}>
                          {link.label}
                          {(link.label === 'privacy' || link.label === 'terms') && (
                            <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
                          )}
                        </a>
                      ) : (
                        <Link className={`hover:text-foreground ${link.label === 'privacy' || link.label === 'terms' ? 'relative group' : ''}`} href={link.href as Route}>
                          {link.label}
                          {(link.label === 'privacy' || link.label === 'terms') && (
                            <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
                          )}
                        </Link>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
        <div className="space-y-2 text-sm text-muted-foreground">
          <Link href={'/blog' as Route} className="group inline-block">
            <h3 className="text-sm font-semibold uppercase tracking-wide relative text-foreground">
              Stay informed
              <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
            </h3>
            <p className="mt-1">
              Insights on DevOps, SRE, AI-ready platforms, and delivery rituals straight to your inbox.
            </p>
          </Link>
          {/* <p className="text-xs">Subscribe form coming soon as part of the marketing automation track.</p> */}
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {company.name}. All rights reserved.
      </div>
    </footer>
  );
}
