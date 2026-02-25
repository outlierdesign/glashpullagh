#!/usr/bin/env node
/**
 * Storyblok Setup Script for Glashapullagh
 *
 * This script automates the entire Storyblok CMS setup:
 * 1. Creates all component definitions in the Block Library
 * 2. Creates the Home story with all section content pre-populated
 *
 * Usage:
 *   STORYBLOK_PAT=your_personal_access_token node scripts/setup-storyblok.mjs
 *
 * To get a Personal Access Token:
 *   Go to app.storyblok.com → My Account → Personal Access Tokens → Generate New Token
 */

const SPACE_ID = "290781263337901";
const API_BASE = "https://mapi.storyblok.com/v1";
const PAT = process.env.STORYBLOK_PAT;

if (!PAT) {
  console.error("\n❌ Missing STORYBLOK_PAT environment variable.");
  console.error("   Get one from: app.storyblok.com → My Account → Personal Access Tokens");
  console.error("   Usage: STORYBLOK_PAT=your_token node scripts/setup-storyblok.mjs\n");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "Authorization": PAT,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, path, body) {
  const url = `${API_BASE}/spaces/${SPACE_ID}${path}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const text = await res.text();

  if (!res.ok) {
    console.error(`❌ ${method} ${path} → ${res.status}`);
    console.error(text);
    throw new Error(`API error: ${res.status}`);
  }

  return text ? JSON.parse(text) : null;
}

// ─── Helper to create a component ────────────────────────────────────────
async function createComponent(comp) {
  await sleep(250); // Rate limit: max 6 req/s
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await api("POST", "/components", { component: comp });
      console.log(`  ✅ Created component: ${comp.name}`);
      return result.component;
    } catch (e) {
      if (e.message.includes("422")) {
        console.log(`  ⏭️  Component "${comp.name}" already exists, skipping`);
        return null;
      }
      if (e.message.includes("429")) {
        console.log(`  ⏳ Rate limited, waiting 2s...`);
        await sleep(2000);
        continue;
      }
      throw e;
    }
  }
}

// ─── Step 1: Create all component definitions ────────────────────────────
async function createComponents() {
  console.log("\n📦 Creating Storyblok components...\n");

  // --- Nested blocks (must be created first) ---

  await createComponent({
    name: "bento_grid_item",
    display_name: "Bento Grid Item",
    is_root: false,
    is_nestable: true,
    schema: {
      label: { type: "text", pos: 0 },
      heading: { type: "text", pos: 1 },
      body: { type: "textarea", pos: 2 },
      image: { type: "asset", filetypes: ["images"], pos: 3 },
      grid_size: {
        type: "option",
        pos: 4,
        source: "self",
        options: [
          { name: "Small", value: "sm" },
          { name: "Medium", value: "md" },
          { name: "Large", value: "lg" },
          { name: "Wide", value: "wide" },
        ],
      },
    },
  });

  await createComponent({
    name: "stat_item",
    display_name: "Stat Item",
    is_root: false,
    is_nestable: true,
    schema: {
      target: { type: "number", pos: 0 },
      suffix: { type: "text", pos: 1 },
      label: { type: "text", pos: 2 },
      description: { type: "text", pos: 3 },
    },
  });

  await createComponent({
    name: "condition_card",
    display_name: "Condition Card",
    is_root: false,
    is_nestable: true,
    schema: {
      title: { type: "text", pos: 0 },
      description: { type: "textarea", pos: 1 },
    },
  });

  await createComponent({
    name: "map_poi",
    display_name: "Map Point of Interest",
    is_root: false,
    is_nestable: true,
    schema: {
      label: { type: "text", pos: 0 },
      title: { type: "text", pos: 1 },
      description: { type: "textarea", pos: 2 },
      x_position: { type: "number", pos: 3 },
      y_position: { type: "number", pos: 4 },
      color: {
        type: "option",
        pos: 5,
        source: "self",
        options: [
          { name: "Gold", value: "gold" },
          { name: "Water", value: "water" },
        ],
      },
    },
  });

  await createComponent({
    name: "restoration_action",
    display_name: "Restoration Action",
    is_root: false,
    is_nestable: true,
    schema: {
      action_number: { type: "number", pos: 0 },
      title: { type: "text", pos: 1 },
      description: { type: "textarea", pos: 2 },
      technical_detail: { type: "textarea", pos: 3 },
      image: { type: "asset", filetypes: ["images"], pos: 4 },
      grid_span: { type: "number", pos: 5 },
    },
  });

  await createComponent({
    name: "gallery_image",
    display_name: "Gallery Image",
    is_root: false,
    is_nestable: true,
    schema: {
      image: { type: "asset", filetypes: ["images"], pos: 0 },
      alt: { type: "text", pos: 1 },
    },
  });

  // --- Main section blocks ---

  await createComponent({
    name: "hero",
    display_name: "Hero",
    is_root: false,
    is_nestable: true,
    schema: {
      label: { type: "text", pos: 0 },
      heading_lines: { type: "textarea", pos: 1 },
      subtitle: { type: "textarea", pos: 2 },
      background_image: { type: "asset", filetypes: ["images"], pos: 3 },
      latitude: { type: "number", pos: 4 },
      longitude: { type: "number", pos: 5 },
      altitude: { type: "number", pos: 6 },
      location_label: { type: "text", pos: 7 },
    },
  });

  await createComponent({
    name: "bento_grid",
    display_name: "Bento Grid",
    is_root: false,
    is_nestable: true,
    schema: {
      items: {
        type: "bloks",
        pos: 0,
        restrict_type: "",
        restrict_components: true,
        component_whitelist: ["bento_grid_item"],
      },
    },
  });

  await createComponent({
    name: "stats_banner",
    display_name: "Stats Banner",
    is_root: false,
    is_nestable: true,
    schema: {
      stats: {
        type: "bloks",
        pos: 0,
        restrict_type: "",
        restrict_components: true,
        component_whitelist: ["stat_item"],
      },
    },
  });

  await createComponent({
    name: "parallax_break",
    display_name: "Parallax Break",
    is_root: false,
    is_nestable: true,
    schema: {
      text: { type: "textarea", pos: 0 },
      background_image: { type: "asset", filetypes: ["images"], pos: 1 },
      section_id: { type: "text", pos: 2 },
    },
  });

  await createComponent({
    name: "about_site",
    display_name: "About Site",
    is_root: false,
    is_nestable: true,
    schema: {
      heading: { type: "text", pos: 0 },
      lead: { type: "textarea", pos: 1 },
      body_paragraphs: { type: "textarea", pos: 2 },
      image_1: { type: "asset", filetypes: ["images"], pos: 3 },
      image_2: { type: "asset", filetypes: ["images"], pos: 4 },
      condition_cards: {
        type: "bloks",
        pos: 5,
        restrict_type: "",
        restrict_components: true,
        component_whitelist: ["condition_card"],
      },
    },
  });

  await createComponent({
    name: "topo_map",
    display_name: "Topographic Map",
    is_root: false,
    is_nestable: true,
    schema: {
      points_of_interest: {
        type: "bloks",
        pos: 0,
        restrict_type: "",
        restrict_components: true,
        component_whitelist: ["map_poi"],
      },
    },
  });

  await createComponent({
    name: "restoration_grid",
    display_name: "Restoration Grid",
    is_root: false,
    is_nestable: true,
    schema: {
      heading: { type: "text", pos: 0 },
      description: { type: "textarea", pos: 1 },
      actions: {
        type: "bloks",
        pos: 2,
        restrict_type: "",
        restrict_components: true,
        component_whitelist: ["restoration_action"],
      },
    },
  });

  await createComponent({
    name: "monitoring",
    display_name: "Monitoring",
    is_root: false,
    is_nestable: true,
    schema: {
      heading: { type: "text", pos: 0 },
      body_paragraphs: { type: "textarea", pos: 1 },
      image: { type: "asset", filetypes: ["images"], pos: 2 },
    },
  });

  await createComponent({
    name: "video_section",
    display_name: "Video Section",
    is_root: false,
    is_nestable: true,
    schema: {
      heading: { type: "text", pos: 0 },
      description: { type: "textarea", pos: 1 },
      poster_image: { type: "asset", filetypes: ["images"], pos: 2 },
      video_url: { type: "text", pos: 3 },
    },
  });

  await createComponent({
    name: "gallery",
    display_name: "Gallery",
    is_root: false,
    is_nestable: true,
    schema: {
      images: {
        type: "bloks",
        pos: 0,
        restrict_type: "",
        restrict_components: true,
        component_whitelist: ["gallery_image"],
      },
    },
  });

  await createComponent({
    name: "footer",
    display_name: "Footer",
    is_root: false,
    is_nestable: true,
    schema: {
      closing_heading: { type: "text", pos: 0 },
      closing_text: { type: "textarea", pos: 1 },
      logo: { type: "asset", filetypes: ["images"], pos: 2 },
    },
  });

  // --- Page content type (created last, references all section blocks) ---

  await createComponent({
    name: "page",
    display_name: "Page",
    is_root: true,
    is_nestable: false,
    schema: {
      body: {
        type: "bloks",
        pos: 0,
        restrict_type: "",
        restrict_components: true,
        component_whitelist: [
          "hero",
          "bento_grid",
          "stats_banner",
          "parallax_break",
          "about_site",
          "topo_map",
          "restoration_grid",
          "monitoring",
          "video_section",
          "gallery",
          "footer",
        ],
      },
    },
  });

  console.log("\n✅ All components created!\n");
}

// ─── Step 2: Create the Home story with content ──────────────────────────
async function createHomeStory() {
  console.log("📝 Creating Home story with content...\n");

  // Helper to generate a unique-ish ID for blok instances
  let uidCounter = 0;
  const uid = () => `setup-${Date.now()}-${++uidCounter}`;

  const storyContent = {
    component: "page",
    body: [
      // Hero
      {
        _uid: uid(),
        component: "hero",
        label: "Glashapullagh Peatland Restoration",
        heading_lines: "Restoring Ireland's Peatlands\nOne hectare at a time",
        subtitle: "A comprehensive restoration project in West Limerick working to regenerate vital peatland ecosystems",
        latitude: 52.5244,
        longitude: -8.9521,
        altitude: 127,
        location_label: "Glashapullagh, West Limerick",
      },

      // Bento Grid
      {
        _uid: uid(),
        component: "bento_grid",
        items: [
          {
            _uid: uid(),
            component: "bento_grid_item",
            label: "The Challenge",
            heading: "Degraded Peatlands Require Active Restoration",
            body: "Over decades, industrial peat extraction and poor land management have damaged Ireland's precious peatland ecosystems. These vital habitats once covered nearly 17% of the country. Today, only remnants remain, many severely degraded and unable to support their original biodiversity.",
            grid_size: "wide",
          },
          {
            _uid: uid(),
            component: "bento_grid_item",
            label: "Our Vision",
            heading: "Creating Resilient Ecosystems",
            body: "We envision a landscape where peatlands thrive, supporting rare species and sequestering carbon naturally. Through strategic restoration, we're transforming degraded areas back into functioning habitats that benefit wildlife and climate.",
            grid_size: "lg",
          },
          {
            _uid: uid(),
            component: "bento_grid_item",
            label: "Community Partnership",
            heading: "Local Engagement Drives Success",
            body: "Restoration begins with the community. We partner with local landowners, volunteers, and conservation organizations to ensure projects are grounded in regional knowledge and supported by those who care most about the land.",
            grid_size: "md",
          },
          {
            _uid: uid(),
            component: "bento_grid_item",
            label: "Long-term Monitoring",
            heading: "Science Guides Every Step",
            body: "Continuous ecological monitoring ensures our strategies work. We track vegetation recovery, water table changes, and wildlife return to validate our approach and adapt management practices based on real-world results.",
            grid_size: "sm",
          },
        ],
      },

      // Stats Banner
      {
        _uid: uid(),
        component: "stats_banner",
        stats: [
          { _uid: uid(), component: "stat_item", target: 427, suffix: "ha", label: "Total Area", description: "of peatland under restoration management" },
          { _uid: uid(), component: "stat_item", target: 85, suffix: "%", label: "Vegetation Recovery", description: "of target plant species established in restored areas" },
          { _uid: uid(), component: "stat_item", target: 12000, suffix: "+", label: "Trees Planted", description: "native species to support ecosystem recovery" },
          { _uid: uid(), component: "stat_item", target: 2450, suffix: "t", label: "Carbon Sequestered", description: "annually through restored peatland processes" },
        ],
      },

      // Parallax Break 1
      {
        _uid: uid(),
        component: "parallax_break",
        text: "Peatlands are among Earth's most valuable ecosystems. Restoring them is an investment in our climate and our natural heritage.",
        section_id: "quote1",
      },

      // About Site
      {
        _uid: uid(),
        component: "about_site",
        heading: "Understanding Peatland Restoration",
        lead: "Peatlands are unique ecosystems that develop over thousands of years. Restoring them requires patience, science, and commitment to ecological principles.",
        body_paragraphs: [
          "Peat forms when dead plant material accumulates in waterlogged conditions where decomposition is slowed. Over millennia, this process creates deep layers of partially decomposed organic matter—peat—that can reach depths of 10 meters or more. These soils are extraordinarily rich in carbon.",
          "During the 20th century, peatlands across Ireland were extensively drained and excavated for fuel and horticultural use. This extraction destroyed the very conditions that allowed peatlands to exist, causing rapid carbon loss, ecosystem collapse, and the extinction of specialized peatland plants and animals.",
          "True restoration requires re-establishing waterlogged conditions that allow peat formation to resume. This means blocking drainage channels, removing invasive species, and allowing native peatland plants to recolonize. The process is slow—measurable recovery takes decades—but the ecological and climate benefits are immense.",
          "We combine traditional ecological knowledge with modern monitoring technology to guide restoration. Each site presents unique challenges requiring customized approaches based on soil conditions, hydrology, and existing vegetation.",
        ].join("\n\n"),
        condition_cards: [
          { _uid: uid(), component: "condition_card", title: "Waterlogging", description: "Restoration re-establishes high water tables essential for peat formation and specialized plant communities" },
          { _uid: uid(), component: "condition_card", title: "Species Recovery", description: "Sphagnum mosses, heathers, and specialized insects return when conditions are restored" },
          { _uid: uid(), component: "condition_card", title: "Carbon Cycling", description: "Restored peatlands switch from carbon sources to carbon sinks, sequestering CO2 annually" },
          { _uid: uid(), component: "condition_card", title: "Biodiversity", description: "Bird species like golden plover and merlin rely on peatland habitat for breeding and feeding" },
        ],
      },

      // Topo Map
      {
        _uid: uid(),
        component: "topo_map",
        points_of_interest: [
          { _uid: uid(), component: "map_poi", label: "A", title: "Restored Bog Pool", description: "Shallow water bodies that provide habitat for aquatic insects and breeding amphibians", x_position: 25, y_position: 35, color: "water" },
          { _uid: uid(), component: "map_poi", label: "B", title: "Sphagnum Moss Restoration Zone", description: "Areas where peat-forming mosses have been successfully re-established", x_position: 60, y_position: 20, color: "gold" },
          { _uid: uid(), component: "map_poi", label: "C", title: "Drain Blocking Infrastructure", description: "Strategic barriers that restore water levels to pre-drainage conditions", x_position: 45, y_position: 55, color: "gold" },
          { _uid: uid(), component: "map_poi", label: "D", title: "Native Tree Nursery", description: "Where locally-sourced seeds grow into saplings for landscape restoration", x_position: 70, y_position: 70, color: "gold" },
          { _uid: uid(), component: "map_poi", label: "E", title: "Monitoring Station", description: "Continuous sensors track water tables, vegetation, and carbon cycling", x_position: 35, y_position: 65, color: "water" },
          { _uid: uid(), component: "map_poi", label: "F", title: "Visitor Access Point", description: "Educational trails showcasing restoration techniques and wildlife", x_position: 15, y_position: 50, color: "gold" },
          { _uid: uid(), component: "map_poi", label: "G", title: "Degraded Area Under Treatment", description: "Invasive species removal and hydrological restoration in progress", x_position: 55, y_position: 80, color: "water" },
          { _uid: uid(), component: "map_poi", label: "H", title: "Research Transect", description: "Long-term study areas tracking vegetation and species recovery over decades", x_position: 75, y_position: 45, color: "gold" },
        ],
      },

      // Restoration Grid
      {
        _uid: uid(),
        component: "restoration_grid",
        heading: "Restoration Techniques",
        description: "We employ evidence-based methods refined through decades of peatland research across Europe. Each technique targets specific degradation patterns while respecting the unique character of this landscape.",
        actions: [
          { _uid: uid(), component: "restoration_action", action_number: 1, title: "Hydrological Restoration", description: "Re-establishing natural water tables by blocking or removing drainage systems that were installed decades ago", technical_detail: "Installation of peat dams and sluice gates to raise water levels to within 10-30cm of the surface, restoring anaerobic conditions essential for peat preservation", grid_span: 2 },
          { _uid: uid(), component: "restoration_action", action_number: 2, title: "Invasive Species Management", description: "Controlling non-native plants like Rhododendron and Sitka Spruce that outcompete native peatland flora", technical_detail: "Selective removal using mechanized cutting and herbicide application to minimize soil disturbance, followed by monitoring for recruitment", grid_span: 1 },
          { _uid: uid(), component: "restoration_action", action_number: 3, title: "Native Plant Establishment", description: "Sowing and transplanting Sphagnum moss, heather, and sedge species to accelerate ecosystem recovery", technical_detail: "Sphagnum fragments collected from donor sites and carefully transplanted into prepared microsites with optimized microtopography", grid_span: 1 },
          { _uid: uid(), component: "restoration_action", action_number: 4, title: "Habitat Diversification", description: "Creating varied microtopography to support diverse plant communities and provide refuge for specialist species", technical_detail: "Constructing hummocks and hollows that mimic natural bog pools, providing distinct hydrological microhabitats", grid_span: 2 },
          { _uid: uid(), component: "restoration_action", action_number: 5, title: "Grazing Management", description: "Strategic use of livestock grazing to prevent scrub encroachment while maintaining habitat structure", technical_detail: "Rotational grazing by hardy breeds like Belted Galloway cattle at carefully calibrated stocking densities", grid_span: 1 },
          { _uid: uid(), component: "restoration_action", action_number: 6, title: "Continuous Monitoring", description: "Long-term ecological monitoring to track restoration success and guide adaptive management", technical_detail: "Annual vegetation surveys, hydrological measurements, wildlife monitoring, and carbon cycling assessments", grid_span: 1 },
          { _uid: uid(), component: "restoration_action", action_number: 7, title: "Community Stewardship", description: "Engaging local communities through volunteer work days and educational programs", technical_detail: "Monthly volunteer restoration events, school partnerships, and annual public open days sharing restoration progress", grid_span: 2 },
        ],
      },

      // Monitoring
      {
        _uid: uid(),
        component: "monitoring",
        heading: "Science-Driven Management",
        body_paragraphs: [
          "Restoration success cannot be assumed—it must be measured. We maintain a comprehensive monitoring program that tracks dozens of ecological indicators across the restored landscape.",
          "Hydrological sensors installed throughout the site provide continuous data on water levels, allowing us to fine-tune drain-blocking infrastructure to achieve target water tables. Vegetation surveys conducted each summer track the recovery of native plant communities and the decline of invasive species.",
          "Bird point counts at dawn capture changes in community composition, with particular attention to specialist peatland species. Insect surveys reveal the return of rare dragonflies, butterflies, and bog mosses found nowhere else on Earth.",
          "Annual soil sampling measures carbon accumulation rates, validating our hypothesis that restored peatlands resume their role as carbon sinks. This data feeds back into adaptive management—when monitoring reveals an approach isn't working, we adjust course based on evidence rather than assumption.",
        ].join("\n\n"),
      },

      // Video Section
      {
        _uid: uid(),
        component: "video_section",
        heading: "Restoration in Action",
        description: "Watch our restoration teams at work across the Glashapullagh site, from drain blocking to sphagnum transplantation to wildlife monitoring.",
      },

      // Parallax Break 2
      {
        _uid: uid(),
        component: "parallax_break",
        text: "When we restore a peatland, we don't just save a wetland. We're healing a landscape that stores as much carbon as all the forests in Ireland combined.",
        section_id: "quote2",
      },

      // Gallery
      {
        _uid: uid(),
        component: "gallery",
        images: [
          { _uid: uid(), component: "gallery_image", alt: "Restored peatland habitat with sphagnum mosses" },
          { _uid: uid(), component: "gallery_image", alt: "Volunteer team working on habitat restoration" },
          { _uid: uid(), component: "gallery_image", alt: "Golden plover nesting in restored peatland" },
          { _uid: uid(), component: "gallery_image", alt: "Drain blocking infrastructure" },
          { _uid: uid(), component: "gallery_image", alt: "Bog pool habitat for aquatic insects" },
          { _uid: uid(), component: "gallery_image", alt: "Native plant propagation at nursery" },
        ],
      },

      // Footer
      {
        _uid: uid(),
        component: "footer",
        closing_heading: "Join the Restoration Movement",
        closing_text: "Whether through volunteering, supporting our work, or simply learning more about peatland conservation, every contribution helps restore these irreplaceable ecosystems.",
      },
    ],
  };

  await sleep(1000); // Extra pause before story creation
  try {
    const result = await api("POST", "/stories", {
      story: {
        name: "Home",
        slug: "home",
        content: storyContent,
      },
      publish: 1,
    });
    console.log(`  ✅ Created and published Home story (ID: ${result.story.id})`);
  } catch (e) {
    if (e.message.includes("422")) {
      console.log("  ⏭️  Home story already exists. Trying to update...");

      // Fetch existing stories to find the home story
      const stories = await api("GET", "/stories?with_slug=home");
      if (stories.stories && stories.stories.length > 0) {
        const homeStory = stories.stories[0];
        await api("PUT", `/stories/${homeStory.id}`, {
          story: {
            name: "Home",
            slug: "home",
            content: storyContent,
          },
          publish: 1,
        });
        console.log(`  ✅ Updated and published Home story (ID: ${homeStory.id})`);
      }
    } else {
      throw e;
    }
  }

  console.log("\n✅ Home story created with all content!\n");
  console.log("📸 Note: Images need to be uploaded manually in Storyblok.");
  console.log("   Go to each section in the Visual Editor and upload images to the asset fields.\n");
}

// ─── Main ────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌿 Glashapullagh — Storyblok Setup Script");
  console.log("==========================================\n");
  console.log(`Space ID: ${SPACE_ID}`);

  // Verify access
  try {
    const space = await api("GET", "");
    console.log(`Space Name: ${space.space.name}`);
    console.log(`Region: ${space.space.region || "EU"}\n`);
  } catch {
    console.error("❌ Could not access space. Check your Personal Access Token.");
    process.exit(1);
  }

  await createComponents();
  await createHomeStory();

  console.log("🎉 Setup complete!");
  console.log("\nNext steps:");
  console.log("  1. Add NEXT_PUBLIC_STORYBLOK_TOKEN to Vercel environment variables");
  console.log("     → Go to: https://vercel.com/dashboard → Project Settings → Environment Variables");
  console.log("     → Key: NEXT_PUBLIC_STORYBLOK_TOKEN");
  console.log("     → Value: Your Preview access token");
  console.log("  2. Redeploy the site on Vercel");
  console.log("  3. Upload images in Storyblok Visual Editor");
  console.log("  4. Open the Visual Editor to start editing!\n");
}

main().catch((err) => {
  console.error("\n💥 Setup failed:", err.message);
  process.exit(1);
});
