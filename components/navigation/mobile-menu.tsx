"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';

export interface NavItem {
  href: string;
  label: string;
}

export function MobileMenu({ items }: { items: NavItem[] }) {
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
              >
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  id="mobile-menu-panel"
                  className="absolute inset-0 bg-background"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  onClick={() => setOpen(false)}
                />
                <motion.nav
                  className="absolute inset-0 flex flex-col items-center justify-center p-8"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.98, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <ul className="w-full max-w-sm space-y-3 text-center">
                    {items.map((item) => {
                      const isAnchor = item.href.startsWith('/#');
                      const content = (
                        <span className="block w-full rounded-xl px-4 py-3 text-2xl font-semibold text-foreground hover:bg-white/5">
                          {item.label}
                        </span>
                      );
                      return (
                        <li key={item.href}>
                          {isAnchor ? (
                            <a href={item.href} onClick={() => setOpen(false)}>
                              {content}
                            </a>
                          ) : (
                            <Link href={item.href} onClick={() => setOpen(false)}>
                              {content}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
