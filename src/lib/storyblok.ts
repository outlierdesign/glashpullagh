import { apiPlugin, storyblokInit, ISbStoriesParams } from '@storyblok/react/rsc';
import StoryblokClient from 'storyblok-js-client';

// ---------- SDK init (call once at app level) ----------
export function initStoryblok() {
  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
    use: [apiPlugin],
    apiOptions: {
      region: 'eu', // change to 'us' if your space is US-region
    },
  });
}

// ---------- Low-level client for server-side fetches ----------
const client = new StoryblokClient({
  accessToken: process.env.STORYBLOK_PREVIEW_TOKEN || process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  region: 'eu',
});

// ---------- Helpers ----------

/** Fetch a single story by its full slug (e.g. "home", "restoration-actions/timber-dams") */
export async function fetchStory(slug: string, params?: Partial<ISbStoriesParams>) {
  try {
    const { data } = await client.get(`cdn/stories/${slug}`, {
      version: 'draft', // 'draft' for preview, 'published' for production
      ...params,
    });
    return data?.story ?? null;
  } catch (e) {
    console.warn(`[Storyblok] Could not fetch story "${slug}":`, e);
    return null;
  }
}

/** Fetch all stories inside a folder (e.g. "restoration-actions/") */
export async function fetchStories(startsWith: string, params?: Partial<ISbStoriesParams>) {
  try {
    const { data } = await client.get('cdn/stories', {
      version: 'draft',
      starts_with: startsWith,
      per_page: 100,
      ...params,
    });
    return data?.stories ?? [];
  } catch (e) {
    console.warn(`[Storyblok] Could not fetch stories starting with "${startsWith}":`, e);
    return [];
  }
}

// ---------- Content transformers ----------
// These convert Storyblok story content → the shape our existing components expect

/** Transform a homepage story → the content.json shape that ClientSite expects */
export function transformHomepageContent(story: any) {
  const c = story.content;
  if (!c) return null;

  return {
    hero: {
      title: c.hero_title || 'Glashapullagh',
      subtitle: c.hero_subtitle || '',
    },
    scrollHero: {
      videoUrl: c.scroll_hero_video_url || '',
      bgImage: c.scroll_hero_bg_image?.filename || '/images/site/hero-bg.jpg',
      title: c.scroll_hero_title || 'Restoring Nature',
      date: c.scroll_hero_date || 'Glashpullagh Peatlands',
      heading: c.scroll_hero_heading || '',
      paragraph1: c.scroll_hero_paragraph_1 || '',
      paragraph2: c.scroll_hero_paragraph_2 || '',
    },
    bento: {
      label: c.bento_label || 'Objectives',
      title: c.bento_title || 'What We Do',
      items: (c.bento_items || []).map((item: any) => ({
        title: item.title,
        description: item.description,
      })),
    },
    stats: {
      items: (c.stats_items || []).map((item: any) => ({
        value: item.value,
        label: item.label,
      })),
    },
    parallaxBreaks: (c.parallax_breaks || []).map((item: any) => ({
      title: item.title,
      text: item.text,
    })),
    about: {
      label: c.about_label || 'About',
      title: c.about_title || 'The Glashapullagh Project',
      image: c.about_image?.filename || '',
      paragraphs: (c.about_paragraphs || '').split('\n\n').filter(Boolean),
    },
    topoMap: {
      label: c.map_label || 'Location',
      title: c.map_title || 'Topographical Overview',
      description: c.map_description || '',
      mapImage: c.map_image?.filename || null,
    },
    restoration: {
      label: c.restoration_label || 'Works Completed',
      title: c.restoration_title || 'Detailed Restoration Works',
      items: (c.restoration_items || []).map((item: any) => ({
        title: item.title,
        description: item.description,
        image: item.image?.filename || '',
      })),
    },
    monitoring: {
      label: c.damming_label || 'Techniques',
      title: c.damming_title || 'Damming Methods',
      items: (c.damming_items || []).map((item: any) => ({
        title: item.title,
        description: item.description,
      })),
    },
    whyLarch: c.why_larch_title ? {
      label: c.why_larch_label || 'Materials',
      title: c.why_larch_title || 'Why Larch',
      paragraphs: (c.why_larch_text || '').split('\n\n').filter(Boolean),
      images: [
        { src: '/images/site/larch-tree.jpg', alt: 'A Larch tree' },
        { src: '/images/site/lake-boat.jpg', alt: 'A traditional lake boat' },
      ],
    } : undefined,
    videos: {
      label: c.videos_label || 'Media',
      title: c.videos_title || 'Video Documentation',
      items: (c.video_items || []).map((item: any) => ({
        title: item.title,
        description: item.description,
        thumbnail: item.thumbnail?.filename || item.thumbnail || '',
        url: item.url || '',
      })),
    },
    documentary: {
      label: c.documentary_label || 'Featured',
      title: c.documentary_title || 'The Long Rewetting',
      description: c.documentary_description || '',
      url: c.documentary_url || '',
    },
    gallery: {
      label: c.gallery_label || 'Gallery',
      title: c.gallery_title || 'Photo Essay',
      items: (c.gallery_items || []).map((item: any) => ({
        title: item.title,
        image: item.image?.filename || '',
      })),
    },
    footer: {
      sections: (c.footer_sections || []).map((section: any) => ({
        title: section.title,
        links: (section.links || []).map((link: any) => ({
          text: link.text,
          url: link.url?.cached_url || link.url_string || '#',
        })),
      })),
      copyright: c.footer_copyright || '© 2026 Glashapullagh. All rights reserved.',
    },
  };
}

/** Transform a restoration action story → the shape [action]/page.tsx expects */
export function transformRestorationAction(story: any) {
  const c = story.content;
  if (!c) return null;

  return {
    slug: story.slug,
    title: c.title || story.name,
    subtitle: c.subtitle || '',
    description: c.description || '',
    vimeoUrl: c.vimeo_url || '',
  };
}
