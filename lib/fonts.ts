import { Bricolage_Grotesque, Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

export const fontDisplay = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['opsz', 'wdth'],
});

export const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

// Brand signature face — preloader wordmark only.
export const fontPriestacy = localFont({
  src: '../public/fonts/Priestacy.woff',
  display: 'swap',
  variable: '--font-priestacy',
  fallback: ['cursive'],
});

export const fontVariables = [
  fontDisplay.variable,
  fontSans.variable,
  fontMono.variable,
  fontPriestacy.variable,
].join(' ');
