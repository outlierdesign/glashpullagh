#!/usr/bin/env node
/**
 * Storyblok Migration Script
 * ─────────────────────────────────────────────────
 * Seeds your Storyblok space with:
 *   1. Component schemas (homepage, restoration_action, all nested blocks)
 *   2. A "home" story with all existing content.json data
 *   3. A "restoration-actions" folder with all 11 subpage stories
 *
 * Usage:
 *   STORYBLOK_MANAGEMENT_TOKEN=your_pat node scripts/seed-storyblok.mjs
 *
 * Get your Personal Access Token from:
 *   https://app.storyblok.com/#/me/account → Personal access tokens
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN;
if (!MANAGEMENT_TOKEN) {
  console.error('❌ Set STORYBLOK_MANAGEMENT_TOKEN env var. Get it from https://app.storyblok.com/#/me/account');
  process.exit(1);
}

const API = 'https://mapi.storyblok.com/v1';
const headers = {
  'Authorization': MANAGEMENT_TOKEN,
  'Content-Type': 'application/json',
};

// ── Helpers ──────────────────────────────────────

async function api(method, path, body) {
  const url = `${API}${path}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }
  // Rate limiting: Storyblok allows 3 req/sec on management API
  await new Promise(r => setTimeout(r, 350));
  return res.status === 204 ? null : res.json();
}

async function getSpaceId() {
  const { spaces } = await api('GET', '/spaces');
  if (!spaces || spaces.length === 0) throw new Error('No spaces found');
  // Use first space (or you can filter by name)
  return spaces[0].id;
}

// ── Component Schemas ───────────────────────────

function buildComponents() {
  return [
    // --- Nestable blocks (used inside content types) ---
    {
      name: 'bento_item',
      display_name: 'Bento Item',
      is_nestable: true,
      is_root: false,
      schema: {
        title: { type: 'text', pos: 0 },
        description: { type: 'textarea', pos: 1 },
      },
    },
    {
      name: 'stat_item',
      display_name: 'Stat Item',
      is_nestable: true,
      is_root: false,
      schema: {
        value: { type: 'text', pos: 0 },
        label: { type: 'text', pos: 1 },
      },
    },
    {
      name: 'parallax_break_item',
      display_name: 'Parallax Break',
      is_nestable: true,
      is_root: false,
      schema: {
        title: { type: 'text', pos: 0 },
        text: { type: 'textarea', pos: 1 },
      },
    },
    {
      name: 'restoration_item',
      display_name: 'Restoration Item',
      is_nestable: true,
      is_root: false,
      schema: {
        title: { type: 'text', pos: 0 },
        description: { type: 'textarea', pos: 1 },
        image: { type: 'image', pos: 2 },
      },
    },
    {
      name: 'damming_item',
      display_name: 'Damming Method',
      is_nestable: true,
      is_root: false,
      schema: {
        title: { type: 'text', pos: 0 },
        description: { type: 'textarea', pos: 1 },
      },
    },
    {
      name: 'video_item',
      display_name: 'Video Item',
      is_nestable: true,
      is_root: false,
      schema: {
        title: { type: 'text', pos: 0 },
        description: { type: 'textarea', pos: 1 },
        thumbnail: { type: 'image', pos: 2 },
        url: { type: 'text', pos: 3 },
      },
    },
    {
      name: 'gallery_item',
      display_name: 'Gallery Item',
      is_nestable: true,
      is_root: false,
      schema: {
        title: { type: 'text', pos: 0 },
        image: { type: 'image', pos: 1 },
      },
    },
    {
      name: 'footer_link',
      display_name: 'Footer Link',
      is_nestable: true,
      is_root: false,
      schema: {
        text: { type: 'text', pos: 0 },
        url_string: { type: 'text', pos: 1 },
      },
    },
    {
      name: 'footer_section',
      display_name: 'Footer Section',
      is_nestable: true,
      is_root: false,
      schema: {
        title: { type: 'text', pos: 0 },
        links: { type: 'bloks', restrict_type: '', restrict_components: true, component_whitelist: ['footer_link'], pos: 1 },
      },
    },

    // --- Content types (root-level stories) ---
    {
      name: 'homepage',
      display_name: 'Homepage',
      is_root: true,
      is_nestable: false,
      schema: {
        // Scroll Hero
        _tab_scroll_hero: { type: 'tab', display_name: 'Scroll Hero', pos: 0 },
        scroll_hero_video_url: { type: 'text', display_name: 'Video URL (Vimeo)', pos: 1 },
        scroll_hero_bg_image: { type: 'image', display_name: 'Background Image', pos: 2 },
        scroll_hero_title: { type: 'text', display_name: 'Title', pos: 3 },
        scroll_hero_date: { type: 'text', display_name: 'Subtitle / Date', pos: 4 },
        scroll_hero_heading: { type: 'text', display_name: 'Content Heading', pos: 5 },
        scroll_hero_paragraph_1: { type: 'textarea', display_name: 'Paragraph 1', pos: 6 },
        scroll_hero_paragraph_2: { type: 'textarea', display_name: 'Paragraph 2', pos: 7 },

        // Hero (canvas section)
        _tab_hero: { type: 'tab', display_name: 'Hero', pos: 10 },
        hero_title: { type: 'text', display_name: 'Title', pos: 11 },
        hero_subtitle: { type: 'textarea', display_name: 'Subtitle', pos: 12 },

        // Bento
        _tab_bento: { type: 'tab', display_name: 'Bento Grid', pos: 20 },
        bento_label: { type: 'text', pos: 21 },
        bento_title: { type: 'text', pos: 22 },
        bento_items: { type: 'bloks', restrict_type: '', restrict_components: true, component_whitelist: ['bento_item'], pos: 23 },

        // Stats
        _tab_stats: { type: 'tab', display_name: 'Stats', pos: 30 },
        stats_items: { type: 'bloks', restrict_type: '', restrict_components: true, component_whitelist: ['stat_item'], pos: 31 },

        // Parallax
        _tab_parallax: { type: 'tab', display_name: 'Parallax Breaks', pos: 40 },
        parallax_breaks: { type: 'bloks', restrict_type: '', restrict_components: true, component_whitelist: ['parallax_break_item'], pos: 41 },

        // About
        _tab_about: { type: 'tab', display_name: 'About', pos: 50 },
        about_label: { type: 'text', pos: 51 },
        about_title: { type: 'text', pos: 52 },
        about_image: { type: 'image', pos: 53 },
        about_paragraphs: { type: 'textarea', display_name: 'Paragraphs (separate with blank lines)', pos: 54 },

        // Map
        _tab_map: { type: 'tab', display_name: 'Map', pos: 60 },
        map_label: { type: 'text', pos: 61 },
        map_title: { type: 'text', pos: 62 },
        map_description: { type: 'text', pos: 63 },
        map_image: { type: 'image', display_name: 'Map Background Image', pos: 64 },

        // Restoration
        _tab_restoration: { type: 'tab', display_name: 'Restoration Works', pos: 70 },
        restoration_label: { type: 'text', pos: 71 },
        restoration_title: { type: 'text', pos: 72 },
        restoration_items: { type: 'bloks', restrict_type: '', restrict_components: true, component_whitelist: ['restoration_item'], pos: 73 },

        // Damming
        _tab_damming: { type: 'tab', display_name: 'Damming Methods', pos: 80 },
        damming_label: { type: 'text', pos: 81 },
        damming_title: { type: 'text', pos: 82 },
        damming_items: { type: 'bloks', restrict_type: '', restrict_components: true, component_whitelist: ['damming_item'], pos: 83 },

        // Videos
        _tab_videos: { type: 'tab', display_name: 'Videos', pos: 90 },
        videos_label: { type: 'text', pos: 91 },
        videos_title: { type: 'text', pos: 92 },
        video_items: { type: 'bloks', restrict_type: '', restrict_components: true, component_whitelist: ['video_item'], pos: 93 },

        // Documentary
        _tab_documentary: { type: 'tab', display_name: 'Documentary', pos: 100 },
        documentary_label: { type: 'text', pos: 101 },
        documentary_title: { type: 'text', pos: 102 },
        documentary_description: { type: 'textarea', pos: 103 },
        documentary_url: { type: 'text', pos: 104 },

        // Gallery
        _tab_gallery: { type: 'tab', display_name: 'Gallery', pos: 110 },
        gallery_label: { type: 'text', pos: 111 },
        gallery_title: { type: 'text', pos: 112 },
        gallery_items: { type: 'bloks', restrict_type: '', restrict_components: true, component_whitelist: ['gallery_item'], pos: 113 },

        // Footer
        _tab_footer: { type: 'tab', display_name: 'Footer', pos: 120 },
        footer_sections: { type: 'bloks', restrict_type: '', restrict_components: true, component_whitelist: ['footer_section'], pos: 121 },
        footer_copyright: { type: 'text', pos: 122 },
      },
    },
    {
      name: 'restoration_action',
      display_name: 'Restoration Action',
      is_root: true,
      is_nestable: false,
      schema: {
        title: { type: 'text', pos: 0 },
        subtitle: { type: 'text', pos: 1 },
        description: { type: 'textarea', pos: 2 },
        vimeo_url: { type: 'text', display_name: 'Vimeo URL', pos: 3 },
      },
    },
  ];
}

// ── Seed Content ────────────────────────────────

function buildHomepageContent(content) {
  return {
    component: 'homepage',

    // Scroll Hero
    scroll_hero_video_url: 'https://vimeo.com/1170727891/e60603a2b1',
    scroll_hero_title: 'Restoring Nature',
    scroll_hero_date: 'Glashpullagh Peatlands',
    scroll_hero_heading: 'Reversing Decades of Drainage',
    scroll_hero_paragraph_1: 'The Glashapullagh site is a cutover blanket bog in West Limerick that had been historically drained, leading to severe peat compaction, the spread of scrub and rushes, and significant peat loss. A comprehensive Restoration Action Plan was developed using extensive drone and ground surveys, approved by the National Parks and Wildlife Service.',
    scroll_hero_paragraph_2: 'Restoration works included reprofiling peat banks, installing dams, removing conifers, and stabilising bare peat. The site is now on a path to recovery — rewetting is slowing carbon loss, habitats are improving for wildlife, and peat-forming plants are returning. Recovery takes time, but at Glashapullagh, it has begun.',

    // Hero
    hero_title: content.hero?.title || 'Glashapullagh',
    hero_subtitle: content.hero?.subtitle || '',

    // Bento
    bento_label: content.bento?.label || 'Objectives',
    bento_title: content.bento?.title || 'What We Do',
    bento_items: (content.bento?.items || []).map(i => ({
      component: 'bento_item', title: i.title, description: i.description,
    })),

    // Stats
    stats_items: (content.stats?.items || []).map(i => ({
      component: 'stat_item', value: i.value, label: i.label,
    })),

    // Parallax
    parallax_breaks: (content.parallaxBreaks || []).map(i => ({
      component: 'parallax_break_item', title: i.title, text: i.text,
    })),

    // About
    about_label: content.about?.label || 'About',
    about_title: content.about?.title || 'The Glashapullagh Project',
    about_paragraphs: (content.about?.paragraphs || []).join('\n\n'),

    // Map
    map_label: content.topoMap?.label || 'Location',
    map_title: content.topoMap?.title || 'Topographical Overview',
    map_description: content.topoMap?.description || '',

    // Restoration
    restoration_label: content.restoration?.label || 'Works Completed',
    restoration_title: content.restoration?.title || 'Detailed Restoration Works',
    restoration_items: (content.restoration?.items || []).map(i => ({
      component: 'restoration_item', title: i.title, description: i.description,
    })),

    // Damming
    damming_label: content.monitoring?.label || 'Techniques',
    damming_title: content.monitoring?.title || 'Damming Methods',
    damming_items: (content.monitoring?.items || []).map(i => ({
      component: 'damming_item', title: i.title, description: i.description,
    })),

    // Videos
    videos_label: content.videos?.label || 'Media',
    videos_title: content.videos?.title || 'Video Documentation',
    video_items: (content.videos?.items || []).map(i => ({
      component: 'video_item', title: i.title, description: i.description, url: i.url,
    })),

    // Documentary
    documentary_label: content.documentary?.label || 'Featured',
    documentary_title: content.documentary?.title || 'The Long Rewetting',
    documentary_description: content.documentary?.description || '',
    documentary_url: content.documentary?.url || '',

    // Gallery
    gallery_label: content.gallery?.label || 'Gallery',
    gallery_title: content.gallery?.title || 'Photo Essay',
    gallery_items: (content.gallery?.items || []).map(i => ({
      component: 'gallery_item', title: i.title,
    })),

    // Footer
    footer_sections: (content.footer?.sections || []).map(s => ({
      component: 'footer_section',
      title: s.title,
      links: (s.links || []).map(l => ({
        component: 'footer_link', text: l.text, url_string: l.url,
      })),
    })),
    footer_copyright: content.footer?.copyright || '© 2026 Glashapullagh. All rights reserved.',
  };
}

// ── Main ────────────────────────────────────────

async function main() {
  console.log('🌿 Storyblok Migration — Glashapullagh');
  console.log('═══════════════════════════════════════\n');

  // 1. Get space ID
  const spaceId = await getSpaceId();
  console.log(`📦 Space ID: ${spaceId}\n`);

  // 2. Create component schemas
  console.log('📐 Creating component schemas...');
  const components = buildComponents();

  // Get existing components to avoid duplicates
  const { components: existing } = await api('GET', `/spaces/${spaceId}/components`);
  const existingNames = new Set(existing.map(c => c.name));

  for (const comp of components) {
    if (existingNames.has(comp.name)) {
      // Update existing
      const existingComp = existing.find(c => c.name === comp.name);
      await api('PUT', `/spaces/${spaceId}/components/${existingComp.id}`, { component: comp });
      console.log(`  ✏️  Updated: ${comp.name}`);
    } else {
      await api('POST', `/spaces/${spaceId}/components`, { component: comp });
      console.log(`  ✅ Created: ${comp.name}`);
    }
  }

  // 3. Create folder for restoration actions
  console.log('\n📁 Creating folder...');
  let folderId;
  try {
    const { story: folder } = await api('POST', `/spaces/${spaceId}/stories`, {
      story: { name: 'Restoration Actions', slug: 'restoration-actions', is_folder: true },
    });
    folderId = folder.id;
    console.log(`  ✅ Created folder: restoration-actions (id: ${folderId})`);
  } catch (e) {
    // Folder might already exist — find it
    const { stories } = await api('GET', `/spaces/${spaceId}/stories?is_folder=true`);
    const existing = stories.find(s => s.slug === 'restoration-actions');
    if (existing) {
      folderId = existing.id;
      console.log(`  ℹ️  Folder already exists (id: ${folderId})`);
    } else {
      throw e;
    }
  }

  // 4. Create homepage story
  console.log('\n🏠 Creating homepage...');
  const contentPath = join(__dirname, '..', 'src', 'data', 'content.json');
  const content = JSON.parse(readFileSync(contentPath, 'utf-8'));
  const homepageContent = buildHomepageContent(content);

  try {
    const { story } = await api('POST', `/spaces/${spaceId}/stories`, {
      story: {
        name: 'Home',
        slug: 'home',
        content: homepageContent,
      },
    });
    console.log(`  ✅ Created: home (id: ${story.id})`);

    // Publish it
    await api('GET', `/spaces/${spaceId}/stories/${story.id}/publish`);
    console.log(`  📢 Published: home`);
  } catch (e) {
    if (e.message.includes('422')) {
      console.log('  ℹ️  Homepage already exists — updating...');
      const { stories } = await api('GET', `/spaces/${spaceId}/stories?with_slug=home`);
      if (stories[0]) {
        await api('PUT', `/spaces/${spaceId}/stories/${stories[0].id}`, {
          story: { name: 'Home', slug: 'home', content: homepageContent },
        });
        await api('GET', `/spaces/${spaceId}/stories/${stories[0].id}/publish`);
        console.log(`  ✏️  Updated and published: home`);
      }
    } else {
      throw e;
    }
  }

  // 5. Create restoration action stories
  console.log('\n📄 Creating restoration action pages...');
  const actionsPath = join(__dirname, '..', 'src', 'data', 'restoration-actions.json');
  const actions = JSON.parse(readFileSync(actionsPath, 'utf-8'));

  for (const action of actions) {
    const storyContent = {
      component: 'restoration_action',
      title: action.title,
      subtitle: action.subtitle,
      description: action.description,
      vimeo_url: action.vimeoUrl || '',
    };

    try {
      const { story } = await api('POST', `/spaces/${spaceId}/stories`, {
        story: {
          name: action.title,
          slug: action.slug,
          parent_id: folderId,
          content: storyContent,
        },
      });
      console.log(`  ✅ Created: ${action.slug} (id: ${story.id})`);

      await api('GET', `/spaces/${spaceId}/stories/${story.id}/publish`);
    } catch (e) {
      if (e.message.includes('422')) {
        console.log(`  ℹ️  ${action.slug} already exists — skipping`);
      } else {
        console.error(`  ❌ Failed: ${action.slug}`, e.message);
      }
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('🎉 Migration complete!');
  console.log('\nNext steps:');
  console.log('  1. Open your Storyblok space and verify the content');
  console.log('  2. Upload images to Storyblok assets (about, restoration, gallery, map)');
  console.log('  3. Set up the Storyblok webhook for revalidation:');
  console.log('     URL: https://glashapullagh.ie/api/revalidate');
  console.log('     Events: story.published, story.unpublished, story.deleted');
  console.log('  4. Set Visual Editor preview URL to: https://glashapullagh.ie/');
}

main().catch(e => {
  console.error('\n❌ Migration failed:', e.message);
  process.exit(1);
});
