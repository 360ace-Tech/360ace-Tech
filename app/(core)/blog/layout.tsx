import { ReactNode } from 'react';

import { SiteShell } from '@/components/layout/site-shell';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
