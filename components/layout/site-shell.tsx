import { ReactNode } from 'react';

import { SiteFooter } from '@/components/navigation/site-footer';
import { SiteHeader } from '@/components/navigation/site-header';
import { ScrollToTopButton } from '@/components/navigation/scroll-to-top';

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <ScrollToTopButton />
    </div>
  );
}
