"use client";

import Link from 'next/link';
import type { Route } from 'next';
import { useState } from 'react';

export type NavItem = { href: string; label: string };

export function DesktopNav({ items }: { items: NavItem[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

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
    <nav className="hidden items-center gap-8 nav:flex" onMouseLeave={() => setHoverIndex(null)}>
      {items.map((item, i) => {
        const base = `relative text-sm font-medium transition`;
        const faded = hoverIndex !== null && hoverIndex !== i;
        const style = faded ? 'opacity-40' : 'opacity-100';
        const content = (
          <span className={`${base} ${style}`}>
            <span className="relative inline-block">
              {item.label}
              <span
                className="absolute -bottom-1 left-0 h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full focus:w-full"
              />
            </span>
          </span>
        );
        const isAnchor = item.href.startsWith('/#');
        return (
          <div key={item.href} className="group" onMouseEnter={() => setHoverIndex(i)}>
            {isAnchor ? (
              <a href={item.href} onClick={handleAnchorClick(item.href)}>{content}</a>
            ) : (
              <Link href={item.href as Route}>{content}</Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
