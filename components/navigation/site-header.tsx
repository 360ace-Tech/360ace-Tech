import Link from 'next/link';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { company } from '@/lib/site-content';
import { cn } from '@/lib/utils';
import { MobileMenu } from '@/components/navigation/mobile-menu';
import { DesktopNav } from '@/components/navigation/desktop-nav';

export const navigation = [
  { href: '/#services', label: 'What we do' },
  { href: '/#process', label: 'How we deliver' },
  { href: '/#insights', label: 'Insights' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl transition-all',
        'bg-background/70',
      )}
    >
      <div className="container-edge flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group inline-flex items-center gap-2 text-sm font-semibold">
          <Badge variant="subtle" className="bg-primary/10 text-primary">
            {company.name}
          </Badge>
          <span className="hidden text-xs text-muted-foreground sm:block">Cloud Native Engineering Studio</span>
        </Link>
        <DesktopNav items={navigation} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href={'/#contact' as Route}>Talk to us</Link>
          </Button>
          <div className="nav:hidden">
            <MobileMenu items={navigation} />
          </div>
        </div>
      </div>
    </header>
  );
}
