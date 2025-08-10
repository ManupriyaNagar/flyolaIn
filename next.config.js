/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable proper server-side functionality
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'flyola.in'],
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Enable proper routing and middleware
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Ensure proper handling of dynamic routes
  trailingSlash: false,
  // Enable proper client-side routing
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
