#!/usr/bin/env node
/**
 * Update bento items and damming methods text in Storyblok.
 * Usage: STORYBLOK_MANAGEMENT_TOKEN=xxx node scripts/update-content-text.mjs
 */

const TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN;
if (!TOKEN) { console.error('Set STORYBLOK_MANAGEMENT_TOKEN'); process.exit(1); }

const SPACE_ID = 290781263337901;
const STORY_ID = 148900586424632;
const API = 'https://mapi.storyblok.com/v1';
const headers = { Authorization: TOKEN, 'Content-Type': 'application/json' };

async function main() {
  const res = await fetch(`${API}/spaces/${SPACE_ID}/stories/${STORY_ID}`, { headers });
  const { story } = await res.json();
  const content = story.content;

  // Update bento items
  content.bento_items = [
    { component: 'bento_item', title: 'Slow Carbon Loss', description: 'Preventing the oxidation of dry peat by raising water tables, slowing carbon loss to the atmosphere and ultimately turning a degraded bog back into a carbon store.' },
    { component: 'bento_item', title: 'Improve Habitats', description: 'Protecting and enhancing habitats for ground-nesting birds including Snipe, and Hen Harrier by restoring the vegetation of the bog and removing self-sown conifers that facilitate predators.' },
    { component: 'bento_item', title: 'Restore Peat-Forming Plants', description: 'Encouraging the return of Sphagnum mosses and native bog vegetation by raising the local water table and stabilising exposed peat surfaces. This is the only way to secure the bogs future.' },
    { component: 'bento_item', title: 'Rewet the Landscape', description: 'Blocking historic drainage channels using timber dams, peat plugs, composite dams, stone dams, and coir logs to restore the bog\'s natural hydrology. There is no bog without water, by retaining water on the bog for longer we restore the site but also slow the runoff into rivers after intense rainfall reducing erosion and flood risks.' },
    { component: 'bento_item', title: 'Thinking Ahead', description: 'Glashapullagh is a small site, but it does serve to demonstrate the positives that restoration delivers. The restoration of a blanket bog does not mean flooding, but it does mean managing the bog for the future. Restoring its hydrology, securing the remaining peat and helping bring back the natural bog vegetation that will in time create new peat.' },
    { component: 'bento_item', title: 'Tell the Story of a Recovering Bog', description: 'While the site looked a bit messy in the first few months after the works were completed, we did not have to wait long for signs of life coming back. Frogs spawning in the pools, wintering snipe feeding in the soft mud. By the summer vegetation will start to cover the bare peat, and insects will colonise the pools. We will monitor these changes, film them and tell you the story of how life returns.' },
  ];

  // Update damming methods
  content.damming_items = [
    { component: 'damming_item', title: 'Timber Dams', description: 'Used in shallow drains where there is still a thick layer of peat at the base of the drain. Untreated larch planks embedded deeply into shallow drains, with a small notch to direct water safely. Notch controls the depth of the pool, preventing water from flowing around or over the dam. Place a stone or timber "shoe" beneath the notch to break the fall of water and limit erosion. Longer lasting than Coir logs, useful where machinery access is not possible or where only a small number of dams are required. Expected to last 8–10 years while vegetation fills the drains naturally.' },
    { component: 'damming_item', title: 'Peat Plugs', description: 'Native peat dug from nearby borrow pits, packed firmly into large deep drains and topped with original surface vegetation. Used where a thick peat layer remains at the base.' },
    { component: 'damming_item', title: 'Composite Peat/Timber Dams', description: 'Used where there is a risk of timber dams failing due to high water pressure during peak flows. Heavy larch planks keyed into the banks of the drain and reinforced with timber piles driven deep into the drain base. A peat plug is placed upslope from the frame, a second plug can also be applied on the downslope side. The timber framework provides the strength and stability; the compacted peat provides the seal holding the water back. Used on drains up to 2.5m with gentle gradients, anything larger or where peak flows are potentially very strong seek engineering advice.' },
    { component: 'damming_item', title: 'Stone Dams', description: 'Stone dams are used where the drain has eroded down to the mineral layer. They slow the flow of water preventing further erosion and widening of the drain. On this site round stones were used as the slope is shallow and water velocities are low. Where peak flows are stronger, key the dam into the banks and use angular stones that will lock together.' },
    { component: 'damming_item', title: 'Coir Logs', description: 'Biodegradable rolls made from coconut husks used to block gullies, dam small drains, and act as bunds in rush-dominated areas to raise the water table and encourage moss growth. Coir logs must be dug into the peat to prevent water from flowing underneath them. Good choice for repairing small gullies and where access for machines is difficult.' },
    { component: 'damming_item', title: 'Geotextiles', description: 'Biodegradable jute netting laid on exposed bare peat and secured with wooden pins. Shields peat from heavy rain, prevents erosion, stabilises the surface, and retains surface moisture helping mosses and plants to establish. Can be used with a mulch of straw or Heather brash.' },
  ];

  const putRes = await fetch(`${API}/spaces/${SPACE_ID}/stories/${STORY_ID}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ story: { content }, publish: 1 }),
  });

  if (putRes.ok) {
    console.log('✅ Bento items and damming methods updated in Storyblok');
  } else {
    console.error('❌ Failed:', await putRes.text());
  }
}

main();
