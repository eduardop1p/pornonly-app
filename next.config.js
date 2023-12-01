/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.pornonly-api.shop',
        port: '',
        pathname: '/**',
      },
      {
        hostname: 'images.pexels.com',
        protocol: 'https',
        pathname: '/**',
        port: '',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
