'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { company } from '@/lib/site-content';

export function HeaderLogo() {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', '/');
    }
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      className="group inline-flex items-center gap-1 text-sm font-semibold"
      style={{ viewTransitionName: 'brand' }}
    >
      <span className="relative inline-block h-10 w-10">
        <Image src="/logo-dark.png" alt="360ace.Tech logo" fill className="hidden dark:block object-contain" sizes="40px" priority />
        <Image src="/logo-light.png" alt="360ace.Tech logo" fill className="block dark:hidden object-contain" sizes="40px" priority />
      </span>
      <Badge variant="subtle" className="bg-primary/10 text-primary">
        {company.name}
      </Badge>
      <span className="hidden text-xs text-muted-foreground sm:block">Cloud Native Engineering Studio</span>
    </Link>
  );
}
