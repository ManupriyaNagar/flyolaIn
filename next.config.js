/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'flyola.in'],
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET, // ensure your .env file defines JWT_SECRET
  },
};

module.exports = nextConfig;
