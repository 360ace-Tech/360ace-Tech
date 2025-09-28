"use client";

import { useEffect } from 'react';

function scrollToHash() {
  const hash = decodeURIComponent(window.location.hash.replace('#', ''));
  if (!hash) return;
  const el = document.getElementById(hash);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function HashScroll() {
  useEffect(() => {
    // On first mount (e.g., navigating to /#services)
    scrollToHash();
    const onHash = () => scrollToHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return null;
}

