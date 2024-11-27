import { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    // Add custom aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      chainsta: path.resolve(__dirname, '../chainsta/src'), // Define alias for chainsta
    };

    // Handle fallbacks for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
};

export default nextConfig;