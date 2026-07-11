"use client";

import Link from 'next/link';
import type { Route } from 'next';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type NavItem = { href: string; label: string };

export function DesktopNav({ items }: { items: NavItem[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const onActive = (event: Event) => {
      setActiveSection((event as CustomEvent<string | null>).detail);
    };
    window.addEventListener('section:active', onActive);
    return () => window.removeEventListener('section:active', onActive);
  }, []);

  const handleAnchorClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const id = href.replace('/#', '');
    if (window.location.pathname !== '/') {
      window.location.assign(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `/#${id}`);
    }
  };

  return (
    <nav className="hidden items-center gap-7 nav:flex" onMouseLeave={() => setHoverIndex(null)}>
      {items.map((item, i) => {
        const faded = hoverIndex !== null && hoverIndex !== i;
        const isActive = activeSection !== null && item.href === `/#${activeSection}`;
        const content = (
          <span
            className={cn(
              'relative font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] transition-opacity duration-300',
              faded ? 'opacity-40' : 'opacity-100'
            )}
          >
            <span className="relative inline-block pb-1">
              {item.label}
              <span
                className={cn(
                  'absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full',
                  isActive ? 'w-full' : 'w-0'
                )}
              />
            </span>
          </span>
        );
        const isAnchor = item.href.startsWith('/#');
        return (
          <div key={item.href} className="group" onMouseEnter={() => setHoverIndex(i)}>
            {isAnchor ? (
              <a href={item.href} onClick={handleAnchorClick(item.href)} aria-current={isActive ? 'true' : undefined}>
                {content}
              </a>
            ) : (
              <Link href={item.href as Route}>{content}</Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
