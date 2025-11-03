import Link from 'next/link';
import Image from 'next/image';

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
        <Link href="/" className="group inline-flex items-center gap-1 text-sm font-semibold" style={{ viewTransitionName: 'brand' }}>
          {/* Logo: light/dark variants */}
          <span className="relative inline-block h-10 w-10">
            <Image src="/logo-dark.png" alt="360ace.Tech logo" fill className="hidden dark:block object-contain" sizes="40px" priority />
            <Image src="/logo-light.png" alt="360ace.Tech logo" fill className="block dark:hidden object-contain" sizes="40px" priority />
          </span>
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
