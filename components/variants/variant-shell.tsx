import { ReactNode } from 'react';

import { SiteFooter } from '@/components/navigation/site-footer';
import { SiteHeader } from '@/components/navigation/site-header';
import { cn } from '@/lib/utils';

export function VariantShell({ variant, children }: { variant: 'v1' | 'v2' | 'v3'; children: ReactNode }) {
  return (
    <div className={cn('flex min-h-screen flex-col', `variant-theme-${variant}`)}>
      <SiteHeader variant={variant} />
      <main className="flex-1">{children}</main>
      <SiteFooter variant={variant} />
    </div>
  );
}
