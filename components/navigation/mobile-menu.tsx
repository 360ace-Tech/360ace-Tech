"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
// Using native anchors for reliable navigation in the overlay
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Mail, Linkedin } from 'lucide-react';
import { menuFooter } from '@/lib/site-content';

export interface NavItem {
  href: string;
  label: string;
}

export function MobileMenu({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Safety: ensure scroll isn't locked on mount
  useEffect(() => {
    document.documentElement.classList.remove('overflow-hidden');
  }, []);
  useEffect(() => {
    if (!open) setHoverIndex(null);
  }, [open]);
  const [hash, setHash] = useState<string>('');
  useEffect(() => {
    const update = () => setHash(window.location.hash || '');
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  // Also clear lock if menu not open when route/hash changes
  useEffect(() => {
    if (!open) document.documentElement.classList.remove('overflow-hidden');
  }, [open, pathname, hash]);

  // Effects-only integration from nav-menu (no images/footer)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  // track if last pointer was touch (for UX tweaks), but do not block navigation
  const touchModeRef = useRef(false);
  const transition = useMemo(() => ({ duration: 1, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }), []);
  // Height animation for the menu block itself (auto height like the example)
  const height = {
    initial: { height: 0 },
    enter: { height: 'auto', transition },
    exit: { height: 0, transition },
  } as const;
  // sibling blur handled by blurStrong on the label span
  const blurStrong = {
    initial: { filter: 'blur(0px)', opacity: 1 },
    // Slow the blur and avoid dimming to keep color consistent
    open: { filter: 'blur(10px)', opacity: 1, transition: { duration: 0.32 } },
    closed: { filter: 'blur(0px)', opacity: 1, transition: { duration: 0.32 } },
  } as const;
  // Entire line reveal (no per-character split)
  const revealItem = {
    initial: { y: '100%', opacity: 0 },
    enter: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.06 * i },
    }),
    exit: () => ({
      y: '100%',
      opacity: 0,
      transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: 0 },
    }),
  } as const;

  // For the overlay, underline is hover/focus only (no persistent active)

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
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[60] nav:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              >
                <div className="relative w-full">
                  {/* Menu block (expands to auto height) */}
                  <motion.nav
                    variants={height}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="relative w-full bg-background p-8 text-foreground sm:p-12"
                    onClick={(e) => {
                      // Close when clicking on the nav's own background (padding area),
                      // but not when clicking inside the inner content wrapper.
                      if (e.target === e.currentTarget) setOpen(false);
                    }}
                  >
                    <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
                    <ul
                      className="group mx-auto w-full max-w-5xl space-y-3 text-left sm:space-y-5 lg:space-y-6"
                      onMouseLeave={() => setHoverIndex(null)}
                      onMouseMove={(e) => {
                        const el = (e.target as HTMLElement).closest('li[data-index]') as HTMLLIElement | null;
                        const idx = el ? Number(el.dataset.index) : null;
                        setHoverIndex((prev) => (prev === idx ? prev : idx));
                      }}
                    >
                      {items.map((item, i) => {
                        const isAnchor = item.href.startsWith('/#');
                        const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
                          touchModeRef.current = e.pointerType === 'touch';
                        };
                        const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                          if (isAnchor) {
                            e.preventDefault();
                            e.stopPropagation();
                            const hash = item.href.replace('/#', '');
                            if (window.location.pathname !== '/') {
                              setOpen(false);
                              window.location.assign(`/#${hash}`);
                              return;
                            }
                            const doScroll = () => {
                              const el = document.getElementById(hash);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                history.replaceState(null, '', `/#${hash}`);
                              }
                            };
                            setOpen(false);
                            setTimeout(doScroll, touchModeRef.current ? 120 : 30);
                          } else {
                            if (touchModeRef.current) setTimeout(() => setOpen(false), 100);
                            else setOpen(false);
                          }
                        };
                        const content = (
                          <motion.span
                            custom={i}
                            variants={revealItem}
                            initial="initial"
                            animate="enter"
                            exit="exit"
                            className="block w-full px-2 py-2 text-2xl font-light lowercase tracking-[0.02em] sm:text-4xl sm:tracking-[0.03em] lg:text-[5vw] lg:leading-[1.05]"
                          >
                            <motion.span
                              variants={blurStrong}
                              animate={hoverIndex !== null && hoverIndex !== i ? 'open' : 'closed'}
                              className="relative inline-block"
                              style={{ willChange: 'filter' }}
                            >
                              {item.label}
                              <span
                                className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 bg-foreground transition-all duration-300 group-hover:w-full focus:w-full"
                              />
                            </motion.span>
                          </motion.span>
                        );
                        return (
                          <motion.li
                            data-index={i}
                            key={item.href}
                            onMouseEnter={() => setHoverIndex(i)}
                            onMouseLeave={() => setHoverIndex(null)}
                            onFocus={() => setHoverIndex(i)}
                            onBlur={() => setHoverIndex(null)}
                            onPointerDown={onPointerDown}
                            onPointerEnter={(e: React.PointerEvent<HTMLElement>) => {
                              // For mouse/pen, treat as hover. Ignore for touch.
                              if (e.pointerType !== 'touch') setHoverIndex(i);
                            }}
                            onPointerLeave={(e: React.PointerEvent<HTMLElement>) => {
                              if (e.pointerType !== 'touch') setHoverIndex(null);
                            }}
                            onTouchStart={() => setHoverIndex(i)}
                            onTouchEnd={() => setHoverIndex(null)}
                            className="transition-all duration-200"
                          >
                            <a
                              href={item.href}
                              data-menu-interactive
                              className="group block"
                              onClick={onClick}
                              onFocus={() => setHoverIndex(i)}
                              onBlur={() => setHoverIndex(null)}
                              onMouseEnter={() => setHoverIndex(i)}
                              onMouseLeave={() => setHoverIndex(null)}
                              onPointerEnter={(e: React.PointerEvent<HTMLElement>) => {
                                if (e.pointerType !== 'touch') setHoverIndex(i);
                              }}
                              onPointerLeave={(e: React.PointerEvent<HTMLElement>) => {
                                if (e.pointerType !== 'touch') setHoverIndex(null);
                              }}
                              onTouchStart={() => setHoverIndex(i)}
                              onTouchEnd={() => setHoverIndex(null)}
                            >
                              {content}
                            </a>
                          </motion.li>
                        );
                      })}
                    </ul>
                    {/* Footer inside menu block (editable via lib/site-content.ts) */}
                    <motion.div
                      className="mx-auto mt-8 w-full max-w-5xl text-left"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.12, ease: [0.76, 0, 0.24, 1] }}
                    >
                      <div className="rounded-md border border-black/15 bg-black/10 px-2 py-3 text-xs text-muted-foreground dark:border-white/25 dark:bg-white/15 sm:px-3 sm:py-4 sm:text-sm">
                        <div className="grid grid-cols-3 items-center gap-4">
                          {/* Left: resources */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-start">
                            <span className="text-foreground/80">Resources:</span>
                            {menuFooter.resources?.map((r) => (
                              <a key={r.label} href={r.href} className="underline-offset-4 hover:underline capitalize">
                                {r.label}
                              </a>
                            ))}
                          </div>
                          {/* Middle: icons */}
                          <div className="flex items-center gap-2.5 justify-center">
                            <a aria-label="Email" href="/contact" className="group inline-flex items-center justify-center rounded-full p-1.5 text-foreground transition hover:bg-white/10">
                              <Mail className="h-4 w-4 transition group-hover:scale-110" />
                            </a>
                            <a aria-label="LinkedIn" href="https://www.linkedin.com/company/360ace-net" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center rounded-full p-1.5 text-foreground transition hover:bg-white/10">
                              <Linkedin className="h-4 w-4 transition group-hover:scale-110" />
                            </a>
                          </div>
                          {/* Right: links (privacy, terms, close) */}
                          <div className="flex gap-4 justify-end">
                            {menuFooter.links.map((l) => (
                              <a
                                key={l.label}
                                href={l.href}
                                onClick={(e) => {
                                  if (l.label.toLowerCase() === 'close') {
                                    e.preventDefault();
                                    setOpen(false);
                                  }
                                }}
                                className="underline-offset-4 hover:underline relative group capitalize"
                              >
                                {l.label}
                                {(l.label === 'privacy' || l.label === 'terms') && (
                                  <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
                                )}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    {/* Close button */}
                    <button
                      aria-label="Close menu"
                      onClick={() => setOpen(false)}
                      className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-foreground backdrop-blur-md"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    </div>
                  </motion.nav>
                  {/* Dim remaining viewport below menu block */}
                  <motion.div
                    role="presentation"
                    aria-hidden
                    className="absolute left-0 right-0 bottom-0 top-full bg-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    onClick={() => setOpen(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
