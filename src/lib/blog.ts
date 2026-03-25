import { readFileSync, readdirSync } from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  season: string;
  excerpt: string;
  body: string[];
  image: string;
  tags: string[];
  video?: {
    src: string;
    title: string;
    poster?: string;
    type?: 'native' | 'iframe';
  };
}

const BLOG_DIR = path.join(process.cwd(), 'src', 'data', 'blog');

/**
 * Load all blog posts from individual JSON files in src/data/blog/
 * Sorted by date descending (newest first)
 */
export function loadPosts(): BlogPost[] {
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.json'));
  const posts: BlogPost[] = files.map((file) => {
    const filePath = path.join(BLOG_DIR, file);
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  });
  // Sort by date descending
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

/**
 * Load a single blog post by slug
 */
export function loadPost(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.json`);
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return undefined;
  }
}

/**
 * Format a date string for display
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
