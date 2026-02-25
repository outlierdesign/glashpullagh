#!/usr/bin/env node
/**
 * Adds the interactive_viewer component to Storyblok and inserts it into the Home story
 */
const SPACE_ID = "290781263337901";
const API_BASE = "https://mapi.storyblok.com/v1";
const PAT = process.env.STORYBLOK_PAT;

if (!PAT) {
  console.error("Missing STORYBLOK_PAT");
  process.exit(1);
}

const headers = { "Content-Type": "application/json", Authorization: PAT };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, path, body) {
  const url = `${API_BASE}/spaces/${SPACE_ID}${path}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  if (!res.ok && !text.includes("already been taken")) {
    console.error(`${method} ${path} → ${res.status}: ${text}`);
    throw new Error(`API error: ${res.status}`);
  }
  return text ? JSON.parse(text) : null;
}

async function main() {
  console.log("1. Creating interactive_viewer component...");
  try {
    await api("POST", "/components", {
      component: {
        name: "interactive_viewer",
        display_name: "Interactive 3D Viewer",
        is_root: false,
        is_nestable: true,
        schema: {
          heading: { type: "text", pos: 0 },
          description: { type: "textarea", pos: 1 },
          embed_url: { type: "text", pos: 2 },
          aspect_ratio: { type: "text", pos: 3, default_value: "16/9" },
        },
      },
    });
    console.log("   ✅ Created interactive_viewer");
  } catch {
    console.log("   ⏭️  Already exists");
  }

  await sleep(500);

  // Update the page component to include interactive_viewer in its whitelist
  console.log("2. Updating page component whitelist...");
  const comps = await api("GET", "/components");
  const pageComp = comps.components.find((c) => c.name === "page");
  if (pageComp) {
    const whitelist = pageComp.schema.body?.component_whitelist || [];
    if (!whitelist.includes("interactive_viewer")) {
      whitelist.push("interactive_viewer");
      pageComp.schema.body.component_whitelist = whitelist;
      await api("PUT", `/components/${pageComp.id}`, { component: { schema: pageComp.schema } });
      console.log("   ✅ Added interactive_viewer to page body whitelist");
    } else {
      console.log("   ⏭️  Already in whitelist");
    }
  }

  await sleep(500);

  // Insert interactive_viewer blok into Home story (before topo_map)
  console.log("3. Updating Home story...");
  const stories = await api("GET", "/stories?with_slug=home");
  if (stories.stories && stories.stories.length > 0) {
    const homeStory = stories.stories[0];
    const fullStory = await api("GET", `/stories/${homeStory.id}`);
    const body = fullStory.story.content.body || [];

    // Check if already added
    if (body.some((b) => b.component === "interactive_viewer")) {
      console.log("   ⏭️  interactive_viewer already in Home story");
    } else {
      // Find topo_map index and insert before it
      const topoIdx = body.findIndex((b) => b.component === "topo_map");
      const viewerBlok = {
        _uid: `viewer-${Date.now()}`,
        component: "interactive_viewer",
        heading: "Explore the Landscape",
        description: "Navigate the Glashapullagh restoration site in 3D. Place markers to explore key areas of peatland recovery and ecological monitoring.",
        embed_url: "https://point-and-place-ar.lovable.app",
        aspect_ratio: "16/9",
      };

      if (topoIdx >= 0) {
        body.splice(topoIdx, 0, viewerBlok);
      } else {
        body.push(viewerBlok);
      }

      fullStory.story.content.body = body;
      await api("PUT", `/stories/${homeStory.id}`, {
        story: { content: fullStory.story.content },
        publish: 1,
      });
      console.log("   ✅ Inserted interactive_viewer before topo_map and published");
    }
  }

  console.log("\n🎉 Done!");
}

main().catch((e) => { console.error("Failed:", e.message); process.exit(1); });
