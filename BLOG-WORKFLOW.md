# Bog Diaries — Blog Workflow

This is the lightweight process for updating the Bog Diaries going forward.
No CMS UI. Alan texts Claude an itemised instruction; Claude edits the files;
Vercel auto-deploys from `main`.

---

## Where blog content lives

| File / folder                                | What it is                                                          |
|----------------------------------------------|---------------------------------------------------------------------|
| `src/data/blog/<slug>.json`                  | **Source of truth** for each post. Read by `loadPosts()`.           |
| `src/data/blog-posts.json`                   | Flat array, same data. Read by homepage gallery + sitemap.          |
| `public/images/blog/<slug>/*`                | Images for that post (hero + gallery), usually `.webp`.             |
| `src/lib/blog.ts`                            | `BlogPost` type. Update here if the schema changes.                 |
| `src/app/blog/[slug]/page.tsx`               | Post template. Hero, body, video, gallery and tags render here.     |
| `src/components/blocks/latest-bog-diaries.tsx` | Homepage "latest posts" block.                                    |

**Rule: every new post needs a file in both `src/data/blog/<slug>.json` AND
an entry in `src/data/blog-posts.json`.** Claude handles this automatically.

---

## The BlogPost schema

```ts
interface BlogPost {
  slug: string;          // URL segment, kebab-case
  title: string;
  date: string;          // "YYYY-MM-DD"
  season: string;        // "Spring" | "Summer" | "Autumn" | "Winter"
  excerpt: string;       // 1–2 sentences for SEO + gallery card
  body: string[];        // One string per paragraph
  image: string;         // Hero image path, e.g. /images/blog/<slug>/hero.webp
  thumbnail?: string;    // Optional different image for the gallery card
  tags: string[];
  video?: {              // Optional, renders after 2nd paragraph
    src: string;
    title: string;
    poster?: string;
    type?: "native" | "iframe";
  };
  gallery?: Array<{      // Optional, renders after the body
    src: string;
    alt?: string;
    caption?: string;
  }>;
  videos?: Array<{...}>; // Optional additional videos
  links?: Array<{...}>;  // Optional related links
  audio?: Array<{...}>;  // Optional audio embeds
}
```

---

## How to ask Claude for a new post

Paste into chat in roughly this shape. Any field you skip, Claude will draft
and flag for review.

```
New Bog Diary post

Title: <title>              (optional — Claude can propose)
Date: <YYYY-MM-DD>          (defaults to today)
Season: <Spring|...>        (defaults from the date)
Tags: <a, b, c>             (optional)
Excerpt: <1–2 sentences>    (optional)

Body:
<paragraph 1>

<paragraph 2>

<paragraph 3>
...

Images:
- hero: <filename or attachment>
- gallery: <filename or attachment> — caption: <optional caption>
- gallery: <filename or attachment> — caption: <optional caption>

Video (optional):
- src: <url>
- title: <title>
- type: native | iframe
- poster: <url>
```

Claude will:

1. Choose a slug (kebab-case of the title) and confirm it.
2. Create `public/images/blog/<slug>/` and tell Alan the exact filenames to
   drop the images as.
3. Write `src/data/blog/<slug>.json` with the post content.
4. Insert the same post at the top of `src/data/blog-posts.json`.
5. Clean obvious typos, preserving voice. Every correction is flagged back.
6. Commit with a message like `diary: add "<Title>"` and push to `main`.
7. Vercel deploys automatically; Claude shares the live URL once the build is
   green.

---

## How to ask Claude to edit an existing post

```
Edit post: <slug>
Change: <describe>
```

Examples:

- `Edit post: the-dams-are-working — change date to 2026-02-21 and add tag "monitoring"`
- `Edit post: first-signs-of-recovery — replace paragraph 2 with: "<new text>"`
- `Edit post: thermal-survey-a-birds-eye-view — swap hero image for the new one attached`

Claude edits `src/data/blog/<slug>.json`, mirrors the changes into
`src/data/blog-posts.json`, commits, and pushes.

---

## Image handling

**Today:** images live in the repo under `public/images/blog/<slug>/`.
Zero cost, deploys with the site. Fine for a dozen posts a year.

**Phase 2 (not done yet):** move to Vercel Blob so the repo doesn't bloat.
When we switch, this runbook gets a one-line update: image paths start with
`https://...blob.vercel-storage.com/` instead of `/images/blog/...`.
Nothing else changes for Alan — he still just drops image files and Claude
handles the upload.

---

## What Claude should NOT do without asking

- Delete posts — confirm first; unpublishing by setting a `draft: true` flag
  is a safer option to add later if needed.
- Edit the schema (`BlogPost` interface) without good reason — it ripples to
  the template, gallery, and sitemap.
- Rewrite an existing post's body beyond typo fixes without flagging the
  change.

---

## Removing CloudCannon (when ready)

Separate from the blog workflow but related. To fully cut CloudCannon:

1. Delete `cloudcannon.config.yml` and the `.cloudcannon/` folder.
2. Cancel the CloudCannon subscription in their dashboard.
3. Remove any `cloudcannon` scripts from `package.json` (none currently).
4. Confirm deploys still work on Vercel (they will — Vercel is the deploy
   target, CloudCannon was only editing and previewing).

Storyblok is also installed (`@storyblok/react`, `storyblok-js-client`).
If it's unused on the live site, those deps can be removed too — check
`src/lib/storyblok.ts` references first.
