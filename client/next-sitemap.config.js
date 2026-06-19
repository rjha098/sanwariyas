// /** @type {import('next-sitemap').IConfig} */
// module.exports = {
//   siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com',
//   generateRobotsTxt: true,
//   robotsTxtOptions: {
//     policies: [
//       { userAgent: '*', allow: '/' },
//       { userAgent: '*', disallow: ['/admin', '/api'] },
//     ],
//   },
//   exclude: ['/admin', '/admin/*'],
//   changefreq: 'weekly',
//   priority: 0.7,
//   sitemapSize: 5000,
// };


/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourclothingstore.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/operations-center', '/operations-center/*', '/dashboard', '/login'] },
    ],
  },
  exclude: ['/operations-center', '/operations-center/*', '/dashboard', '/login'],
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
};