import Link from 'next/link';
import type { Route } from 'next';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

export interface NotFoundTemplateProps {
  title?: string;
  message?: string | ReactNode;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function NotFoundTemplate({
  title = 'Page not found',
  message = "The page you’re looking for doesn’t exist or was moved.",
  primaryCta = { label: 'Go home', href: '/' },
  secondaryCta = { label: 'Browse blog', href: '/blog' },
}: NotFoundTemplateProps) {
  return (
    <section className="relative py-28">
      <div className="container-edge">
        <div className="glass-panel relative mx-auto max-w-2xl rounded-3xl p-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Error 404</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-4 text-muted-foreground">{message}</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            {primaryCta && (
              <Button asChild>
                <Link href={primaryCta.href as Route}>{primaryCta.label}</Link>
              </Button>
            )}
            {secondaryCta && (
              <Button asChild variant="outline">
                <Link href={secondaryCta.href as Route}>{secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
