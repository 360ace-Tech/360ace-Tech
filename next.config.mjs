import { withContentlayer } from 'next-contentlayer2';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
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
