import { MetadataRoute } from 'next';
import { readFileSync } from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://glashapullagh.ie';

  /* Static pages */
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/interactive-site/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/blog/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  /* Blog posts */
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = JSON.parse(readFileSync(path.join(process.cwd(), 'src', 'data', 'blog-posts.json'), 'utf-8'));
    blogPages = posts.map((post: { slug: string; date: string }) => ({
      url: `${baseUrl}/blog/${post.slug}/`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch { /* ignore if file missing */ }

  /* Restoration action pages */
  let actionPages: MetadataRoute.Sitemap = [];
  try {
    const actions = JSON.parse(readFileSync(path.join(process.cwd(), 'src', 'data', 'restoration-actions.json'), 'utf-8'));
    actionPages = actions.map((action: { slug: string }) => ({
      url: `${baseUrl}/${action.slug}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch { /* ignore if file missing */ }

  return [...staticPages, ...blogPages, ...actionPages];
}
