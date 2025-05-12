/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <- critical for static HTML export
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'flyola.in'],
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET, // for build-time only (won't be in browser)
  },
};

module.exports = nextConfig;
