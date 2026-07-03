

/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
  remotePatterns: [
    {
      protocol: "http",
      hostname: "localhost",
      port: "5000",
      pathname: "/uploads/**",
    },
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
    {
      protocol: "https",
      hostname: "plus.unsplash.com",
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



// production  time  


// {
//   protocol: "https",
//   hostname: "api.sanwariyas.com",
//   pathname: "/uploads/**",
// }
