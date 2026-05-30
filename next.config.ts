import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  serverExternalPackages: ['sharp'],
  experimental: {
    staleTimes: {
      dynamic: 600,
      static: 600,
    },
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};
export default config;
