"use client";
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { useRef } from 'react';
import { Mail, Linkedin } from 'lucide-react';
import type { Route } from 'next';

import { Reveal } from '@/components/motion/reveal';
import { company } from '@/lib/site-content';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { MOTION_OK } from '@/lib/animation/config';
import { isModifiedClick, parseHomeTarget, useAppNavigate } from '@/lib/navigation/home-nav';

const footerLinks = [
  {
    title: 'Services',
    links: [
      { label: 'Cloud Strategy', href: '/services#cloud-strategy' },
      { label: 'Platform Engineering', href: '/services#platform-engineering' },
      { label: 'Site Reliability', href: '/services#site-reliability' },
      { label: 'AI & Data Platforms', href: '/services#ai-data-platform' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Case studies', href: '/#insights' },
      { label: 'privacy', href: '/legal/privacy' },
      { label: 'terms', href: '/legal/terms' },
    ],
  },
];

export function SiteFooter() {
  const navigate = useAppNavigate();
  const footerRef = useRef<HTMLElement>(null);

  /** Intercepts primary clicks on home-targeting links; plain routes keep
   *  the view-transition Link behaviour. */
  const homeNav = (href: string) =>
    parseHomeTarget(href).type === 'home'
      ? (e: React.MouseEvent<HTMLAnchorElement>) => {
          if (isModifiedClick(e)) return;
          e.preventDefault();
          navigate(href);
        }
      : undefined;

  useGSAP(
    () => {
      const footer = footerRef.current;
      if (!footer) return;
      const wordmark = footer.querySelector('[data-footer-wordmark]');
      if (!wordmark) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(wordmark, {
          yPercent: 55,
          ease: 'none',
          scrollTrigger: {
            trigger: footer,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        });
      });
    },
    { scope: footerRef }
  );

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-border">
      <div className="container-edge grid gap-10 py-14 md:grid-cols-4">
        <Reveal as="div" dir="up" className="space-y-4">
          <Link href={'/' as Route} onClick={homeNav('/')} className="inline-flex items-center gap-2">
            <span className="relative inline-block h-8 w-8">
              <Image src="/logo-dark.png" alt="360ace.Tech logo" fill className="hidden dark:block object-contain" sizes="32px" />
              <Image src="/logo-light.png" alt="360ace.Tech logo" fill className="block dark:hidden object-contain" sizes="32px" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{company.name}</span>
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {company.summary}
          </p>
          <div className="text-sm">
            <span className="font-medium">Let’s collaborate:</span>
            <div className="mt-2 flex items-center gap-1.5">
              <Link aria-label="Email" href="/contact" className="group inline-flex items-center justify-center rounded-full p-1.5 text-foreground transition hover:bg-primary/15 hover:text-primary">
                <Mail className="h-4 w-4 transition group-hover:scale-110" />
              </Link>
              <a aria-label="LinkedIn" href="https://www.linkedin.com/company/360ace-net" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center rounded-full p-1.5 text-foreground transition hover:bg-primary/15 hover:text-primary">
                <Linkedin className="h-4 w-4 transition group-hover:scale-110" />
              </a>
            </div>
          </div>
        </Reveal>
        {footerLinks.map((column, index) => (
          <Reveal key={column.title} as="div" delay={(index + 1) * 0.08} dir="up" className="space-y-4">
            <h3 className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              {column.title}
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      className="underline-sweep pb-0.5 capitalize transition-colors hover:text-foreground"
                      href={link.href as Route}
                      onClick={homeNav(link.href)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </Reveal>
        ))}
        <Reveal as="div" delay={0.24} dir="up" className="space-y-2 text-sm text-muted-foreground">
          <Link href={'/blog' as Route} className="group inline-block">
            <h3 className="underline-sweep pb-0.5 font-mono text-xs font-medium uppercase tracking-[0.25em] text-foreground">
              Stay informed
            </h3>
            <p className="mt-2 leading-relaxed">
              Insights on DevOps, SRE, AI-ready platforms, and delivery rituals.
            </p>
          </Link>
        </Reveal>
      </div>

      {/* Giant outlined wordmark */}
      <div className="pointer-events-none select-none overflow-hidden" aria-hidden>
        <p
          data-footer-wordmark
          className="text-outline whitespace-nowrap text-center font-display text-[13.5vw] font-bold leading-[0.9] tracking-[-0.02em]"
        >
          360ace.Tech
        </p>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <div className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.15em]">
          © {new Date().getFullYear()}
          <span className="relative inline-block h-5 w-5">
            <Image src="/logo-dark.png" alt="360ace.Tech logo" fill className="hidden dark:block object-contain" sizes="20px" />
            <Image src="/logo-light.png" alt="360ace.Tech logo" fill className="block dark:hidden object-contain" sizes="20px" />
          </span>
          {company.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
