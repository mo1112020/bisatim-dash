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
      dynamic: 300,
      static: 300,
    },
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};
export default config;
