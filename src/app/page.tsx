import { readFileSync } from 'fs';
import path from 'path';
import ClientSite from '@/components/ClientSite';
import { fetchStory, transformHomepageContent } from '@/lib/storyblok';
import { loadPosts } from '@/lib/blog';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  // Use local content.json as the source of truth
  // Storyblok CMS is out of sync — bypass until it is updated
  const contentPath = path.join(process.cwd(), 'src', 'data', 'content.json');
  const content: Record<string, any> = JSON.parse(readFileSync(contentPath, 'utf-8'));

  // Load latest 3 blog posts (sorted by date desc) for the Bog Diaries section
  const allPosts = loadPosts();
  const latestPosts = allPosts.slice(0, 3).map(({ slug, title, date, season, excerpt, image, thumbnail }) => ({
    slug, title, date, season, excerpt, image, thumbnail,
  }));

  return <ClientSite content={content} latestPosts={latestPosts} />;
}
