'use client';

import { Link } from 'next-view-transitions';
import type { Route } from 'next';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Magnetic } from '@/components/motion/magnetic';
import { MobileMenu } from '@/components/navigation/mobile-menu';
import { DesktopNav } from '@/components/navigation/desktop-nav';
import { HeaderLogo } from '@/components/navigation/header-logo';
import { HeaderBehavior } from '@/components/navigation/header-behavior';
import { isModifiedClick, useAppNavigate } from '@/lib/navigation/home-nav';

export const navigation = [
  { href: '/#services', label: 'What we do' },
  { href: '/#process', label: 'How we deliver' },
  { href: '/#insights', label: 'Insights' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
];

export function SiteHeader() {
  const navigate = useAppNavigate();

  return (
    <header
      data-site-header
      data-scrolled="false"
      className={cn(
        'sticky top-0 z-50 border-b border-transparent bg-transparent transition-colors duration-300',
        'data-[scrolled=true]:border-border/70 data-[scrolled=true]:bg-background/80 data-[scrolled=true]:backdrop-blur-xl'
      )}
    >
      <HeaderBehavior />
      <div className="container-edge flex h-16 items-center justify-between gap-4">
        <HeaderLogo />
        <DesktopNav items={navigation} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Magnetic strength={0.25}>
            <Button asChild size="sm">
              <Link
                href={'/#contact' as Route}
                onClick={(e) => {
                  if (isModifiedClick(e)) return;
                  e.preventDefault();
                  navigate('/#contact');
                }}
              >
                Talk to us
              </Link>
            </Button>
          </Magnetic>
          <div className="nav:hidden">
            <MobileMenu items={navigation} />
          </div>
        </div>
      </div>
    </header>
  );
}
