#!/usr/bin/env node
/**
 * Quick script to update the video section in Storyblok with real Vimeo URLs.
 * Usage: STORYBLOK_MANAGEMENT_TOKEN=xxx node scripts/update-videos.mjs
 */

const TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN;
if (!TOKEN) { console.error('Set STORYBLOK_MANAGEMENT_TOKEN'); process.exit(1); }

const SPACE_ID = 290781263337901;
const STORY_ID = 148900586424632;
const API = 'https://mapi.storyblok.com/v1';

async function main() {
  // Fetch current story
  const res = await fetch(`${API}/spaces/${SPACE_ID}/stories/${STORY_ID}`, {
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
  });
  const { story } = await res.json();
  const content = story.content;

  // Update video items
  content.video_items = [
    { component: 'video_item', title: 'Overview', description: 'An overview of the project, landscape, and restoration vision for Glashapullagh.', url: 'https://vimeo.com/1170727891/e60603a2b1' },
    { component: 'video_item', title: 'Timber Dams', description: 'Installing untreated larch plank dams in shallow drains to slow water flow and re-wet the bog.', url: 'https://vimeo.com/1170368764/129cdce8ec' },
    { component: 'video_item', title: 'Peat Plugs', description: 'Packing native peat into deep drains to block drainage and raise the water table.', url: 'https://vimeo.com/1169964237/ae918a24fd' },
    { component: 'video_item', title: 'Composite Wood-Peat Dams', description: 'Heavy larch planks reinforced with timber posts for wide or deep drains on sloping ground.', url: 'https://vimeo.com/1169899899/3c5e185cbb' },
    { component: 'video_item', title: 'Stone Dams', description: 'Non-calcareous stone placed where little peat remains, protecting the bog\'s water chemistry.', url: 'https://vimeo.com/1169865947/1d83f1c9b4' },
    { component: 'video_item', title: 'Coir Logs', description: 'Biodegradable coconut husk rolls blocking gullies and small drains to raise the water table.', url: 'https://vimeo.com/1169561924/c41853e77e' },
    { component: 'video_item', title: 'Geotextiles', description: 'Biodegradable jute netting protecting exposed bare peat and accelerating moss establishment.', url: 'https://vimeo.com/1168476185' },
    { component: 'video_item', title: 'Removing Conifers', description: 'Hand-removing self-sown Sitka spruce to restore open, wet conditions and protect wildlife.', url: 'https://vimeo.com/1169595066/5d1192a3eb' },
    { component: 'video_item', title: 'Reprofiling Peat Banks', description: 'Grading steep hags into gentle slopes to reduce air exposure and stabilise vulnerable peat.', url: 'https://vimeo.com/1169631012/5dcf4df130' },
    { component: 'video_item', title: 'Waste Management', description: 'Identifying, sorting, and responsibly removing legacy waste to protect wildlife and water quality.', url: 'https://vimeo.com/1169848533/91223827cc' },
    { component: 'video_item', title: 'Logistics and Safety', description: 'Planning materials, safe working practices, and emergency procedures on fragile bogland.', url: 'https://vimeo.com/1170272267' },
  ];

  // Update documentary
  content.documentary_title = 'Project Overview';
  content.documentary_description = 'A comprehensive overview of the Glashapullagh peatland restoration project.';
  content.documentary_url = 'https://player.vimeo.com/video/1170727891?h=e60603a2b1';

  // Save
  const putRes = await fetch(`${API}/spaces/${SPACE_ID}/stories/${STORY_ID}`, {
    method: 'PUT',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ story: { content }, publish: 1 }),
  });

  if (putRes.ok) {
    console.log('✅ Video section updated and published in Storyblok');
  } else {
    console.error('❌ Failed:', await putRes.text());
  }
}

main();
