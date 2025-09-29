"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export type NavItem = { href: string; label: string };

export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hash, setHash] = useState<string>('');

  useEffect(() => {
    const update = () => setHash(window.location.hash || '');
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  const isActive = (href: string) => {
    if (href === '/blog') return pathname.startsWith('/blog');
    if (href.startsWith('/#')) return hash === href.slice(1) || hash === href.replace('/', '');
    return pathname === href;
  };

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
        const active = isActive(item.href);
        const base = `relative text-sm font-medium transition`;
        const faded = hoverIndex !== null && hoverIndex !== i;
        const style = faded ? 'opacity-40 blur-[1px]' : 'opacity-100';
        const content = (
          <span className={`${base} ${style}`}>
            <span className="relative inline-block">
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-[2px] bg-foreground transition-all duration-300 ${
                  active ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
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
              <Link href={item.href}>{content}</Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
