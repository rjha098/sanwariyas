

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow normal Unsplash image URLs.
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Allow newer Unsplash image URLs that come from plus.unsplash.com.
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      // Allow Cloudinary images too, in case products use that host later.
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },

  async headers() {
    return [
      {
        // Apply these headers on all routes.
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;


