#!/usr/bin/env node
/**
 * Update the video section in Storyblok with real Vimeo URLs and thumbnails.
 * Also ensures the video_item component has a thumbnail field.
 * Usage: STORYBLOK_MANAGEMENT_TOKEN=xxx node scripts/update-videos.mjs
 */

const TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN;
if (!TOKEN) { console.error('Set STORYBLOK_MANAGEMENT_TOKEN'); process.exit(1); }

const SPACE_ID = 290781263337901;
const STORY_ID = 148900586424632;
const API = 'https://mapi.storyblok.com/v1';

const headers = { Authorization: TOKEN, 'Content-Type': 'application/json' };

async function ensureThumbnailField() {
  // Get the video_item component
  const res = await fetch(`${API}/spaces/${SPACE_ID}/components`, { headers });
  const { components } = await res.json();
  const videoItem = components.find(c => c.name === 'video_item');
  if (!videoItem) {
    console.log('⚠️  video_item component not found, skipping schema update');
    return;
  }

  // Check if thumbnail field exists
  if (videoItem.schema && videoItem.schema.thumbnail) {
    console.log('✓ video_item already has thumbnail field');
    return;
  }

  // Add thumbnail field
  const schema = videoItem.schema || {};
  schema.thumbnail = { type: 'text', pos: 4, description: 'Thumbnail image URL (Vimeo CDN or local path)' };

  const putRes = await fetch(`${API}/spaces/${SPACE_ID}/components/${videoItem.id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ component: { schema } }),
  });

  if (putRes.ok) {
    console.log('✓ Added thumbnail field to video_item component');
  } else {
    console.log('⚠️  Could not update video_item schema:', await putRes.text());
  }
}

async function main() {
  await ensureThumbnailField();

  // Fetch current story
  const res = await fetch(`${API}/spaces/${SPACE_ID}/stories/${STORY_ID}`, { headers });
  const { story } = await res.json();
  const content = story.content;

  // Update video items with thumbnails
  content.video_items = [
    { component: 'video_item', title: 'Overview', description: 'An overview of the project, landscape, and restoration vision for Glashapullagh.', url: 'https://vimeo.com/1170727891/e60603a2b1', thumbnail: 'https://i.vimeocdn.com/video/2129970123-8413ac1a78c9b256b83000aa61e3e66afa326a5570590e791cf3ea911bec1e93-d_640' },
    { component: 'video_item', title: 'Timber Dams', description: 'Installing untreated larch plank dams in shallow drains to slow water flow and re-wet the bog.', url: 'https://vimeo.com/1170368764/129cdce8ec', thumbnail: 'https://i.vimeocdn.com/video/2132411782-b97f781ac2cb84ec5ac242e097b5244810abce268c8c7abb3c09330dd8f2b00a-d_640' },
    { component: 'video_item', title: 'Peat Plugs', description: 'Packing native peat into deep drains to block drainage and raise the water table.', url: 'https://vimeo.com/1169964237/ae918a24fd', thumbnail: 'https://i.vimeocdn.com/video/2128918405-38b7e9235cef31bf92b84f04e3b7f307a498ba6cf6048d372331e767d1e0f99a-d_640' },
    { component: 'video_item', title: 'Composite Wood-Peat Dams', description: 'Heavy larch planks reinforced with timber posts for wide or deep drains on sloping ground.', url: 'https://vimeo.com/1169899899/3c5e185cbb', thumbnail: 'https://i.vimeocdn.com/video/2128825172-7aaf31003204506660d005d76d781f1fb38d52781307e5e64df976f299dda121-d_640' },
    { component: 'video_item', title: 'Stone Dams', description: 'Non-calcareous stone placed where little peat remains, protecting the bog\'s water chemistry.', url: 'https://vimeo.com/1169865947/1d83f1c9b4', thumbnail: 'https://i.vimeocdn.com/video/2128778783-149118281b69549989c5bf1d7fb3286651dd1835a39ac0e266b9fd7f14ec1c62-d_640' },
    { component: 'video_item', title: 'Coir Logs', description: 'Biodegradable coconut husk rolls blocking gullies and small drains to raise the water table.', url: 'https://vimeo.com/1169561924/c41853e77e', thumbnail: 'https://i.vimeocdn.com/video/2128360321-010a8633abb95fd646f465ee01440b2d36aa9d6ab2e51b19800478f603770ffa-d_640' },
    { component: 'video_item', title: 'Geotextiles', description: 'Biodegradable jute netting protecting exposed bare peat and accelerating moss establishment.', url: 'https://vimeo.com/1168476185', thumbnail: 'https://i.vimeocdn.com/video/2126856462-f7f7dafd45c2534c4694b79805d7cec818f9011cc44e16e61fae6a65da41f3ae-d_640' },
    { component: 'video_item', title: 'Removing Conifers', description: 'Hand-removing self-sown Sitka spruce to restore open, wet conditions and protect wildlife.', url: 'https://vimeo.com/1169595066/5d1192a3eb', thumbnail: 'https://i.vimeocdn.com/video/2128402857-cb8087ca0ee709d7e00d2acbfa886f76d886e9426701091f104afbd4ae06f33f-d_640' },
    { component: 'video_item', title: 'Reprofiling Peat Banks', description: 'Grading steep hags into gentle slopes to reduce air exposure and stabilise vulnerable peat.', url: 'https://vimeo.com/1169631012/5dcf4df130', thumbnail: 'https://i.vimeocdn.com/video/2128452671-f24407eea724ce146790720a7f86bb8bd4e940f1dd55b1aa62f9d701562b54a8-d_640' },
    { component: 'video_item', title: 'Waste Management', description: 'Identifying, sorting, and responsibly removing legacy waste to protect wildlife and water quality.', url: 'https://vimeo.com/1169848533/91223827cc', thumbnail: 'https://i.vimeocdn.com/video/2128755624-46b4b6e552fbbd6dbd9804b6186ea59f76b4c61f4bbb6799ba4bdde6b439e47a-d_640' },
    { component: 'video_item', title: 'Logistics and Safety', description: 'Planning materials, safe working practices, and emergency procedures on fragile bogland.', url: 'https://vimeo.com/1170272267', thumbnail: '/images/site/carrying-equipment.jpg' },
  ];

  // Update documentary
  content.documentary_title = 'Project Overview';
  content.documentary_description = 'A comprehensive overview of the Glashapullagh peatland restoration project.';
  content.documentary_url = 'https://player.vimeo.com/video/1170727891?h=e60603a2b1';

  // Save
  const putRes = await fetch(`${API}/spaces/${SPACE_ID}/stories/${STORY_ID}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ story: { content }, publish: 1 }),
  });

  if (putRes.ok) {
    console.log('✅ Video section updated with thumbnails and published in Storyblok');
  } else {
    console.error('❌ Failed:', await putRes.text());
  }
}

main();
