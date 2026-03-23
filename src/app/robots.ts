import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/viewer/'],
      },
    ],
    sitemap: 'https://glashapullagh.ie/sitemap.xml',
  };
}
