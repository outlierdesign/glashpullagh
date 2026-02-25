# Storyblok CMS Setup Guide — Glashapullagh

This guide walks through connecting Storyblok to the Glashapullagh website for full visual editing of all content sections.

## 1. Create a Storyblok Space

1. Go to [app.storyblok.com](https://app.storyblok.com) and sign up / log in
2. Click **Create New Space** → choose a name (e.g. "Glashapullagh")
3. Select the **EU** region (the app is configured for EU)

## 2. Get Your Access Token

1. In your space, go to **Settings → Access Tokens**
2. Copy the **Preview** token (this allows draft content in development)
3. Add it to Vercel: **Project Settings → Environment Variables**
   - Key: `NEXT_PUBLIC_STORYBLOK_TOKEN`
   - Value: your preview token
4. Redeploy the site

## 3. Set Up the Visual Editor

1. In Storyblok, go to **Settings → Visual Editor**
2. Set the **Preview URL** to: `https://glashpullagh.vercel.app/`
3. For local development, use: `https://localhost:3000/` (HTTPS required)

## 4. Create Component Definitions

In Storyblok, go to **Block Library** and create these components. Each one maps to a section on the site.

### `page` (Content Type)
This is the main page container. Set it as a **Content Type** (not nestable).

| Field | Type | Technical Name |
|-------|------|---------------|
| Body | Blocks | `body` |

The `body` field accepts all the section bloks below.

---

### `hero` (Nestable Block)

| Field | Type | Technical Name |
|-------|------|---------------|
| Label | Text | `label` |
| Heading Lines | Textarea | `heading_lines` |
| Subtitle | Textarea | `subtitle` |
| Background Image | Asset (Images) | `background_image` |
| Latitude | Number | `latitude` |
| Longitude | Number | `longitude` |
| Altitude | Number | `altitude` |
| Location Label | Text | `location_label` |

**Note:** Heading lines are separated by newlines. Each line becomes a separate heading element.

---

### `bento_grid` (Nestable Block)

| Field | Type | Technical Name |
|-------|------|---------------|
| Items | Blocks | `items` |

**Nested block: `bento_grid_item`**

| Field | Type | Technical Name |
|-------|------|---------------|
| Label | Text | `label` |
| Heading | Text | `heading` |
| Body | Textarea | `body` |
| Image | Asset (Images) | `image` |
| Grid Size | Single-Option (sm, md, lg, wide) | `grid_size` |

---

### `stats_banner` (Nestable Block)

| Field | Type | Technical Name |
|-------|------|---------------|
| Stats | Blocks | `stats` |

**Nested block: `stat_item`**

| Field | Type | Technical Name |
|-------|------|---------------|
| Target | Number | `target` |
| Suffix | Text | `suffix` |
| Label | Text | `label` |
| Description | Text | `description` |

---

### `parallax_break` (Nestable Block)

| Field | Type | Technical Name |
|-------|------|---------------|
| Quote Text | Textarea | `text` |
| Background Image | Asset (Images) | `background_image` |
| Section ID | Text | `section_id` |

---

### `about_site` (Nestable Block)

| Field | Type | Technical Name |
|-------|------|---------------|
| Heading | Text | `heading` |
| Lead Text | Textarea | `lead` |
| Body Paragraphs | Textarea | `body_paragraphs` |
| Image 1 | Asset (Images) | `image_1` |
| Image 2 | Asset (Images) | `image_2` |
| Condition Cards | Blocks | `condition_cards` |

**Note:** Body paragraphs are separated by double newlines (`\n\n`). Each double-newline-separated block becomes a paragraph.

**Nested block: `condition_card`**

| Field | Type | Technical Name |
|-------|------|---------------|
| Title | Text | `title` |
| Description | Textarea | `description` |

---

### `topo_map` (Nestable Block)

| Field | Type | Technical Name |
|-------|------|---------------|
| Points of Interest | Blocks | `points_of_interest` |

**Nested block: `map_poi`**

| Field | Type | Technical Name |
|-------|------|---------------|
| Label | Text | `label` |
| Title | Text | `title` |
| Description | Textarea | `description` |
| X Position (%) | Number | `x_position` |
| Y Position (%) | Number | `y_position` |
| Color | Single-Option (gold, water) | `color` |

---

### `restoration_grid` (Nestable Block)

| Field | Type | Technical Name |
|-------|------|---------------|
| Heading | Text | `heading` |
| Description | Textarea | `description` |
| Actions | Blocks | `actions` |

**Nested block: `restoration_action`**

| Field | Type | Technical Name |
|-------|------|---------------|
| Action Number | Number | `action_number` |
| Title | Text | `title` |
| Description | Textarea | `description` |
| Technical Detail | Textarea | `technical_detail` |
| Image | Asset (Images) | `image` |
| Grid Span | Number (1 or 2) | `grid_span` |

---

### `monitoring` (Nestable Block)

| Field | Type | Technical Name |
|-------|------|---------------|
| Heading | Text | `heading` |
| Body Paragraphs | Textarea | `body_paragraphs` |
| Image | Asset (Images) | `image` |

**Note:** Body paragraphs are separated by double newlines.

---

### `video_section` (Nestable Block)

| Field | Type | Technical Name |
|-------|------|---------------|
| Heading | Text | `heading` |
| Description | Textarea | `description` |
| Poster Image | Asset (Images) | `poster_image` |
| Video URL | Text | `video_url` |

**Note:** If video URL is empty, a "Coming Soon" badge displays instead of a play button.

---

### `gallery` (Nestable Block)

| Field | Type | Technical Name |
|-------|------|---------------|
| Images | Blocks | `images` |

**Nested block: `gallery_image`**

| Field | Type | Technical Name |
|-------|------|---------------|
| Image | Asset (Images) | `image` |
| Alt Text | Text | `alt` |

---

### `footer` (Nestable Block)

| Field | Type | Technical Name |
|-------|------|---------------|
| Closing Heading | Text | `closing_heading` |
| Closing Text | Textarea | `closing_text` |
| Logo | Asset (Images) | `logo` |

---

## 5. Create the Home Story

1. Go to **Content** in your Storyblok space
2. Create a new story with slug `home` using the `page` content type
3. In the `body` field, add bloks in this order:
   - `hero`
   - `bento_grid`
   - `stats_banner`
   - `parallax_break` (quote 1)
   - `about_site`
   - `topo_map`
   - `restoration_grid`
   - `monitoring`
   - `video_section`
   - `parallax_break` (quote 2)
   - `gallery`
   - `footer`
4. Fill in content for each blok, upload images
5. Click **Publish**

## 6. How the Fallback Works

The site is designed with graceful degradation:

- **With Storyblok token configured:** Content is fetched from the CMS API. The Visual Editor enables click-to-edit on any section.
- **Without Storyblok token:** The site renders using the static data in `src/lib/data.ts`. This means the site always works, even without CMS access.

This means you can deploy and iterate on the CMS setup at your own pace without breaking the live site.

## 7. Visual Editor Usage

Once connected, the Storyblok Visual Editor lets you:

- **Click any section** on the live preview to jump to its fields in the editor
- **Drag and reorder** sections by moving bloks in the body field
- **Add new sections** by adding more bloks to the page body
- **Upload and swap images** directly in the asset fields
- **Preview changes** before publishing (draft vs. published)
- **Reuse bloks** — sections like `parallax_break` can be added multiple times with different content

## 8. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_STORYBLOK_TOKEN` | Yes | Storyblok Preview or Public access token |

Add to Vercel via **Project Settings → Environment Variables**, then redeploy.
