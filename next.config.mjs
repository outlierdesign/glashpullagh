/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
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
      // Proxy the AR 3D viewer so it's same-origin (fixes auth/storage in iframe)
      { source: '/viewer', destination: 'https://point-and-place-ar.vercel.app/' },
      { source: '/viewer/:path*', destination: 'https://point-and-place-ar.vercel.app/:path*' },
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
