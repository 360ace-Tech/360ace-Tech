import { withContentlayer } from 'next-contentlayer2';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    viewTransition: true,
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      // Scripts: Next, GA, reCAPTCHA (allow eval for some libs; prefer nonces in future)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net",
      // Styles: Tailwind in <style> tags
      "style-src 'self' 'unsafe-inline'",
      // Images and fonts
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      // XHR/Web fetch
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.gstatic.com",
      // Frames for recaptcha
      "frame-src https://www.google.com https://www.gstatic.com https://www.recaptcha.net",
      // Disallow embedding
      "frame-ancestors 'none'",
      // Form posting
      "form-action 'self'",
      // Others
      "base-uri 'self'",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value:
              'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), usb=()',
          },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Redirect legacy variant roots to the primary site
      { source: '/v1', destination: '/', permanent: true },
      { source: '/v2', destination: '/', permanent: true },
      { source: '/v3', destination: '/', permanent: true },
      // Redirect any nested paths to their non-variant equivalents
      { source: '/v1/:path*', destination: '/:path*', permanent: true },
      { source: '/v2/:path*', destination: '/:path*', permanent: true },
      { source: '/v3/:path*', destination: '/:path*', permanent: true },
    ];
  },
};

export default withContentlayer(nextConfig);
