import { ReactNode } from 'react';

import { SiteShell } from '@/components/layout/site-shell';
import { PageTransition } from '@/components/motion/page-transition';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell>
      <PageTransition>{children}</PageTransition>
    </SiteShell>
  );
}
