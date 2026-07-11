import '@/app/globals.css';

import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Providers } from '@/app/(core)/providers';
import { ViewTransitions } from 'next-view-transitions';
import { HomeSectionScroller } from '@/components/navigation/home-section-scroller';
import { cn } from '@/lib/utils';
import { fontVariables } from '@/lib/fonts';
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
  alternates: {
    canonical: 'https://360ace.tech',
  },
  openGraph: {
    title: '360ace.Tech — Cloud Native Engineering & SRE Studio',
    description:
      '360ace.Tech partners with teams to design, ship, and operate resilient cloud-native products with DevOps, platform engineering, and SRE excellence.',
    url: 'https://360ace.tech',
    siteName: '360ace.Tech',
    type: 'website',
    images: [
      {
        url: 'https://360ace.tech/og-image.png',
        width: 1200,
        height: 630,
        alt: '360ace.Tech — Cloud Native Engineering & SRE Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '360ace.Tech — Cloud Native Engineering & SRE Studio',
    description:
      'Cloud Native engineering studio helping teams ship and operate resilient products with DevOps and SRE.',
    images: ['https://360ace.tech/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
};

import Script from 'next/script';
import PreloaderServer from '@/components/preloader/preloader-server';
import { PreloaderController } from '@/components/preloader/preloader-controller';
import { NavigationPreloader } from '@/components/preloader/navigation-preloader';

export default function RootLayout({ children }: { children: ReactNode }) {
  const maintenance = process.env.NEXT_PUBLIC_MAINTENANCE === 'true';
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-YL349263YB';
  return (
    <html lang="en" suppressHydrationWarning data-preload-active="1" className={fontVariables}>
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
            <PreloaderServer />
            <PreloaderController />
            {/* Client preloader: fires on blog → home soft navigation */}
            <NavigationPreloader />
            <div className="relative flex min-h-screen flex-col">
              <HomeSectionScroller />
              {maintenance ? <UnderConstruction /> : children}
            </div>
          </ViewTransitions>
        </Providers>
      </body>
    </html>
  );
}
