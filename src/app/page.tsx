import { readFileSync } from 'fs';
import path from 'path';
import ClientSite from '@/components/ClientSite';
import { fetchStory, transformHomepageContent } from '@/lib/storyblok';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  // Try Storyblok first, fall back to local JSON
  let content: Record<string, any>;

  const story = await fetchStory('home');

  const transformed = story?.content ? transformHomepageContent(story) : null;
  if (transformed) {
    content = transformed;
  } else {
    // Fallback: read from local JSON (until Storyblok is seeded)
    const contentPath = path.join(process.cwd(), 'src', 'data', 'content.json');
    content = JSON.parse(readFileSync(contentPath, 'utf-8'));
  }

  return <ClientSite content={content} />;
}
