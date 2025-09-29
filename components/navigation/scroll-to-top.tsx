"use client";

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 360);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      aria-label="Back to top"
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-[70] inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-background/80 text-foreground shadow-md backdrop-blur ${
        show ? 'opacity-100 translate-y-0' : 'pointer-events-none translate-y-4 opacity-0'
      } transition-all duration-300`}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}

