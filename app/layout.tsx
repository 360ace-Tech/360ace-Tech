import '@/app/globals.css';
import '@/styles/themes/v1.css';
import '@/styles/themes/v2.css';
import '@/styles/themes/v3.css';

import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { Providers } from '@/app/(core)/providers';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL('https://360ace.tech'),
  title: {
    default: '360ace.Tech — Cloud Native Engineering & SRE Studio',
    template: '%s | 360ace.Tech',
  },
  description:
    '360ace.Tech partners with teams to design, ship, and operate resilient cloud-native products with DevOps, platform engineering, and SRE excellence.',
  keywords: ['cloud native', 'platform engineering', 'devops', 'site reliability', '360ace tech', 'engineering consultancy'],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans text-foreground antialiased')}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
