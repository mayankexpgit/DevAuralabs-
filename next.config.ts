
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      }
    ],
  },
  experimental: {
    cpus: 1,
    memoryBasedWorkersCount: true,
    optimizePackageImports: [
        'lucide-react',
    ],
  },
};

export default nextConfig;
