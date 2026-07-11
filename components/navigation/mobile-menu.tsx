"use client";

import { Menu, X, Mail, Linkedin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import { menuFooter } from '@/lib/site-content';
import { gsap, useGSAP } from '@/lib/animation/gsap';
import { isModifiedClick, useAppNavigate } from '@/lib/navigation/home-nav';
import { EASE } from '@/lib/animation/config';

export interface NavItem {
  href: string;
  label: string;
}

/**
 * Full-screen menu overlay driven by a single GSAP timeline: clip-path wipe
 * down, staggered link rise, footer fade. Reversing the timeline closes it.
 */
export function MobileMenu({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const navigate = useAppNavigate();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const touchModeRef = useRef(false);

  useEffect(() => setMounted(true), []);

  // Scroll lock + escape handling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) document.documentElement.classList.add('overflow-hidden');
    else document.documentElement.classList.remove('overflow-hidden');
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [open]);

  // Close if the route changes underneath the menu
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const reduce = !window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: EASE.inOut },
        onReverseComplete: () => {
          gsap.set(overlay, { visibility: 'hidden' });
        },
      });

      tl.set(overlay, { visibility: 'visible' })
        .fromTo(
          overlay,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: reduce ? 0.01 : 0.6 }
        )
        .from(
          overlay.querySelectorAll('[data-menu-item]'),
          {
            yPercent: 110,
            autoAlpha: 0,
            duration: reduce ? 0.01 : 0.55,
            stagger: reduce ? 0 : 0.06,
            ease: EASE.reveal,
          },
          reduce ? 0 : 0.25
        )
        .from(
          overlay.querySelector('[data-menu-footer]'),
          { autoAlpha: 0, y: 20, duration: reduce ? 0.01 : 0.4 },
          reduce ? 0 : 0.5
        );

      tlRef.current = tl;
    },
    { dependencies: [mounted], scope: overlayRef }
  );

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) tl.timeScale(1).play();
    else tl.timeScale(1.4).reverse();
  }, [open]);

  // All destinations flow through the shared helper: on-home targets ease
  // with Lenis, off-home targets queue + transition back with the preloader,
  // plain routes get a view transition. Close the overlay first.
  const handleItemClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isModifiedClick(e)) return;
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => navigate(href), touchModeRef.current ? 120 : 30);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {mounted &&
        createPortal(
          <div
            ref={overlayRef}
            id="mobile-menu-panel"
            className="invisible fixed inset-0 z-[60] flex flex-col bg-background nav:hidden"
            aria-hidden={!open}
          >
            <div className="flex justify-end p-5">
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-1 items-center px-8 sm:px-12">
              <ul className="w-full space-y-2">
                {items.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <a
                      href={item.href}
                      data-menu-item
                      className="group block py-1"
                      onPointerDown={(e) => {
                        touchModeRef.current = e.pointerType === 'touch';
                      }}
                      onClick={handleItemClick(item.href)}
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-xs text-primary">0{i + 1}</span>
                        <span className="font-display text-4xl font-semibold tracking-[-0.02em] transition-colors duration-300 group-hover:text-primary sm:text-5xl">
                          {item.label}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div data-menu-footer className="border-t border-border px-8 py-6 sm:px-12">
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono uppercase tracking-[0.2em] text-foreground/80">Resources</span>
                  {menuFooter.resources?.map((r) => (
                    <a
                      key={r.label}
                      href={r.href}
                      onClick={handleItemClick(r.href)}
                      className="capitalize underline-offset-4 hover:underline"
                    >
                      {r.label}
                    </a>
                  ))}
                </div>
                <div className="flex items-center gap-2.5">
                  <a aria-label="Email" href="/contact" className="inline-flex items-center justify-center rounded-full p-1.5 text-foreground transition hover:bg-primary/15 hover:text-primary">
                    <Mail className="h-4 w-4" />
                  </a>
                  <a aria-label="LinkedIn" href="https://www.linkedin.com/company/360ace-net" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full p-1.5 text-foreground transition hover:bg-primary/15 hover:text-primary">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
                <div className="flex gap-4">
                  {menuFooter.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={(e) => {
                        if (l.label.toLowerCase() === 'close') {
                          e.preventDefault();
                          setOpen(false);
                          return;
                        }
                        handleItemClick(l.href)(e);
                      }}
                      className="capitalize underline-offset-4 hover:underline"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
              <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
                {menuFooter.stack}
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
