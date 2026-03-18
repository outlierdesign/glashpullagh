#!/usr/bin/env node
/**
 * Update all text content in Storyblok: bento, stats, parallax, damming, whyLarch.
 * Usage: STORYBLOK_MANAGEMENT_TOKEN=xxx node scripts/update-all-content.mjs
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
    { component: 'bento_item', title: 'Drain Blocking', description: 'Slow the flow of water, create pools where Sphagnum can get started, let water soak into the peat rather than flow out of the bog.' },
    { component: 'bento_item', title: 'Sphagnum Recovery', description: 'There is no bog without Sphagnum moss, there is no Sphagnum Moss without a bog. Some Sphagnum plants survived on this site, raising the water table will give them a chance to expand.' },
    { component: 'bento_item', title: 'Water Table Management', description: 'Rewetting is not flooding; the goal is to bring the water table nearer to the surface and to keep the peat wet.' },
    { component: 'bento_item', title: 'Monitoring', description: 'The site will look a bit messy for a while, but it will settle down quickly. Growing vegetation will bring it back to life. We will use acoustic monitors, trail cameras and human observers to record what species of birds and bats use the site over the next few years.' },
    { component: 'bento_item', title: 'Timber Dam Construction', description: 'Timber dams are easily installed by hand, simple structures that slow the flow of water, preventing erosion, encouraging water to soak in and recharge the peat. The timber will decay into the bog but it will last long enough for Sphagnum and other plants to take its place.' },
    { component: 'bento_item', title: 'Community Engagement', description: 'Telling the story of Glashapullagh as it recovers is a big part of what we want to achieve here. By using short films and digital models of the site, large numbers of people can see what was done here and see how plants and animals are responding without disturbing a sensitive site.' },
  ];

  // Update stats
  content.stat_items = [
    { component: 'stat_item', value: '>40', label: 'Composite, peat, timber, stone dams' },
    { component: 'stat_item', value: '800m', label: 'Peat bank reprofiled' },
    { component: 'stat_item', value: '800m\u00B2', label: 'of bare peat protected with geotextiles' },
    { component: 'stat_item', value: '7', label: 'Hectares of bog restored' },
  ];

  // Update parallax breaks
  content.parallax_items = [
    { component: 'parallax_break_item', title: 'A Landscape in Recovery', text: 'The Glashapullagh site is a cutover blanket bog that had been historically drained, leading to severe peat compaction, the spread of scrub and rushes, and significant peat loss. A comprehensive Restoration Action Plan was developed using extensive drone and ground surveys to reverse this degradation.' },
    { component: 'parallax_break_item', title: 'Recovery Takes Time', text: 'But at Glashapullagh, it has begun. Water is being held on the site for longer, the peat is not flooding, it is rewetting, like a sponge it is soaking up water and expanding. The bog is healing \u2014 its hydrology is recovering, the loss of Carbon is slowing, frogs are spawning, Snipe are coming here to feed. Soon, the pools will support swarms of insects, Meadow Pipits and perhaps Snipe will start to breed, and the Hen Harrier will hunt here again. As the years pass the rushes will diminish, Sphagnum will spread and in time new peat will begin to form.' },
  ];

  // Update damming methods
  content.damming_items = [
    { component: 'damming_item', title: 'Timber Dams', description: 'Used in shallow drains where there is still a thick layer of peat at the base of the drain. Untreated larch planks embedded deeply into shallow drains, with a small notch to direct water safely. Notch controls the depth of the pool, preventing water from flowing around or over the dam. Place a stone or timber "shoe" beneath the notch to break the fall of water and limit erosion. Longer lasting than Coir logs, useful where machinery access is not possible or where only a small number of dams are required. Expected to last 8\u201310 years while vegetation fills the drains naturally.' },
    { component: 'damming_item', title: 'Peat Plugs', description: 'Native peat dug from nearby borrow pits, packed firmly into large deep drains and topped with original surface vegetation. Used where a thick peat layer remains at the base.' },
    { component: 'damming_item', title: 'Composite Peat/Timber Dams', description: 'Heavy Larch planks keyed into the bank and reinforced with Larch piling and backed with one or more peat plugs. This sturdy frame provides extra stability where a peat dam could fail.' },
    { component: 'damming_item', title: 'Stone Dams', description: 'Stone dams to slow the flow of water where the drain is down to the mineral layer. Helps prevent erosion and encourages sediment to accumulate and plants to establish.' },
    { component: 'damming_item', title: 'Coir Logs', description: 'Biodegradable rolls made from coconut husks used to block gullies, dam small drains, and act as bunds in rush-dominated areas to raise the water table and encourage moss growth. Coir logs must be dug into the peat to prevent water from flowing underneath them. Good choice for repairing small gullies and where access for machines is difficult.' },
    { component: 'damming_item', title: 'Geotextiles', description: 'Biodegradable jute netting laid on exposed bare peat and secured with wooden pins. Shields peat from heavy rain, prevents erosion, stabilises the surface, and retains surface moisture helping mosses and plants to establish. Can be used with a mulch of straw or Heather brash.' },
  ];

  // Add Why Larch fields
  content.why_larch_label = 'Materials';
  content.why_larch_title = 'Why Larch';
  content.why_larch_text = 'Larch is a fast-growing conifer; it is grown in Ireland (24,000 ha in 2021) so availability is good and there are less transport issues than coir. Untreated Larch timber has natural resins that allow the wood to resist decay. Most other woods are either too expensive Oak or decay too quickly White Deal. Using treated timbers introduces toxic long-lasting chemicals to the bog which we would prefer not to do.\n\nIf Larch planks are embedded in the peat as in a composite peat/timber dam they will last for decades. If they are exposed to the air as with a timber dam and subject to wet/dry cycles they will not last as long. They will still last longer than coir and long enough for the pools behind them to fill in and revegetate. By the time the Larch planks break down, they should no longer be needed.\n\nLarch was traditionally used for the hulls of lake boats used for angling on our lakes.';

  const putRes = await fetch(`${API}/spaces/${SPACE_ID}/stories/${STORY_ID}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ story: { content }, publish: 1 }),
  });

  if (putRes.ok) {
    console.log('\u2705 All content updated in Storyblok');
  } else {
    console.error('\u274C Failed:', await putRes.text());
  }
}

main();
