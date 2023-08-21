/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
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
};

module.exports = nextConfig;
