/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@checkpoint/types', '@checkpoint/utils', '@checkpoint/ui'],
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
