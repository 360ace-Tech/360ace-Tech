"use client";

import { Link } from 'next-view-transitions';
import type { Route } from 'next';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { isModifiedClick, parseHomeTarget, useAppNavigate } from '@/lib/navigation/home-nav';

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

  const navigate = useAppNavigate();
  const handleHomeTarget = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isModifiedClick(e)) return;
    e.preventDefault();
    navigate(href);
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
        const isHomeTarget = parseHomeTarget(item.href).type === 'home';
        return (
          <div key={item.href} className="group" onMouseEnter={() => setHoverIndex(i)}>
            <Link
              href={item.href as Route}
              onClick={isHomeTarget ? handleHomeTarget(item.href) : undefined}
              aria-current={isActive ? 'true' : undefined}
            >
              {content}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
