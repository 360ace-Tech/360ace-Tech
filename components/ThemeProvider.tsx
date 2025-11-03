"use client";
import { PropsWithChildren, useEffect } from "react";

/**
 * Minimal theme provider (light/dark) with system preference fallback.
 * Uses `class="dark"` on <html> and stores preference in localStorage.
 */
export default function ThemeProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored ?? (systemDark ? 'dark' : 'light');
    root.classList.toggle('dark', theme === 'dark');
  }, []);
  return children as any;
}
