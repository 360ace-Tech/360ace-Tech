import '@/app/globals.css';
import '@/styles/themes/v2.css';

import type { Metadata } from 'next';
import { ReactNode } from 'react';
import NextScript from 'next/script';

import { Providers } from '@/app/(core)/providers';
import { ViewTransitions } from 'next-view-transitions';
import { HashScroll } from '@/components/navigation/hash-scroll';
import { cn } from '@/lib/utils';
import { UnderConstruction } from '@/components/templates/under-construction';

export const metadata: Metadata = {
  metadataBase: new URL('https://360ace.tech'),
  title: {
    default: '360ace.Tech — Cloud Native Engineering & SRE Studio',
    template: '%s | 360ace.Tech',
  },
  description:
    '360ace.Tech partners with teams to design, ship, and operate resilient cloud-native products with DevOps, platform engineering, and SRE excellence.',
  keywords: ['cloud native', 'platform engineering', 'devops', 'site reliability', '360ace tech', 'engineering consultancy'],
  openGraph: {
    title: '360ace.Tech — Cloud Native Engineering & SRE Studio',
    description:
      '360ace.Tech partners with teams to design, ship, and operate resilient cloud-native products with DevOps, platform engineering, and SRE excellence.',
    url: 'https://360ace.tech',
    siteName: '360ace.Tech',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '360ace.Tech — Cloud Native Engineering & SRE Studio',
    description:
      'Cloud Native engineering studio helping teams ship and operate resilient products with DevOps and SRE.',
  },
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

import Script from 'next/script';
import PreloaderServer from '@/components/preloader/preloader-server';

export default function RootLayout({ children }: { children: ReactNode }) {
  const maintenance = process.env.NEXT_PUBLIC_MAINTENANCE === 'true';
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-YL349263YB';
  return (
    <html lang="en" suppressHydrationWarning data-preload-active="1">
      <body suppressHydrationWarning className={cn('min-h-screen bg-background font-sans text-foreground antialiased')}>
        {/* Google Analytics */}
        {gaId ? (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <Script id="ga-setup">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}
        <Providers>
          <ViewTransitions>
            {/* Preloader bootstrap: set a short, branded delay (once per session) */}
            <NextScript id="preloader-init" strategy="beforeInteractive">
              {`
                try {
                  setTimeout(() => {
                    delete document.documentElement.dataset.preloadActive;
                  }, 4000);
                } catch {}
              `}
            </NextScript>
            <PreloaderServer />
            <div className="relative flex min-h-screen flex-col">
              <HashScroll />
              {maintenance ? <UnderConstruction /> : children}
            </div>
          </ViewTransitions>
        </Providers>
      </body>
    </html>
  );
}
