/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ],
    unoptimized: false
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' }
  },
  async rewrites() {
    return [
      // Storyblok Visual Editor hits /home (the story slug) — serve the homepage
      { source: '/home', destination: '/' },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ];
  },
};

export default nextConfig;
