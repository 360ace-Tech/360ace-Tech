'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { SmoothScroll } from '@/components/providers/smooth-scroll';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      themes={['light', 'dark']}
    >
      <SmoothScroll />
      {children}
    </ThemeProvider>
  );
}
