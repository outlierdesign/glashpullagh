# Design Critique: Glashapullagh Homepage

## Overall Impression

The site has strong visual identity — the peatland colour palette, Cormorant Garamond typography, and bog-amber accents create an atmospheric, place-specific aesthetic. The biggest opportunity is **tightening the content density and reducing visual fatigue** in the middle and lower sections where the page becomes a long scroll of similarly-weighted sections without clear narrative progression.

---

## Usability

| Finding | Severity | Recommendation |
|---------|----------|----------------|
| 15+ sections creates very long scroll without clear waypoints | 🟡 Moderate | Group related sections into 4-5 "chapters" with visual breathing room between them |
| Gallery Carousel, Bento Gallery, Photo Gallery, Hover Reveal Grid, and Zoom Parallax all show photos — 5 separate image sections | 🔴 Critical | Consolidate to 2 photo sections maximum (one curated gallery, one immersive parallax) |
| Video Documentation (11 cards) immediately followed by more visual content creates wall of thumbnails | 🟡 Moderate | Reduce to 4-6 featured videos with a "View All" link to a dedicated page |
| Overview Video placed 2nd (before What We Do) means users hit a 16:9 embed before understanding the project | 🟡 Moderate | Move Overview Video below the About section so users have context first |
| No section anchors visible to user — nav links go to #about, #techniques but no visual indicator of where you are | 🟢 Minor | Add scroll-spy highlighting to nav to show current section |
| Mobile: 15+ stacked sections with no skip/jump mechanism | 🟡 Moderate | Add a floating "Back to top" button and section jump dots |

## Visual Hierarchy

**What draws the eye first**: The scroll-expansion hero video — correctly the highest impact element and the first thing visitors should see.

**Reading flow**: Hero → bento cards → carousel → then the page becomes harder to navigate. The eye loses its guide after the first few sections. Stats, parallax breaks, about, map, video grid, tabs, more parallax, more cards, why larch, more video, more galleries — the rhythm flattens.

**Emphasis**: The "What We Do" section and the Restoration Tabs are the most important informational content but they're separated by 5 sections. The dam techniques (Slowing The Flow) are buried below a parallax break and require scrolling past ~10 sections.

## Consistency

| Element | Issue | Recommendation |
|---------|-------|----------------|
| Section padding | Varies: 4rem, 5rem 2rem, 6rem 0 — inconsistent | Standardise to 6rem 0 with 4rem for compact sections |
| Card border radius | Mix of 12px (--radius-lg) and 16px (--radius-xl) | Standardise cards to 12px, hero/blog images to 16px |
| Section headers | Some use `.label` class, some use inline styles | All section headers should follow label → h2 → divider pattern |
| Image aspect ratios | Video thumbnails 16:9, gallery 1:1, blog cards mixed | Define standard ratios: 16:9 for video, 4:3 for cards, 1:1 for gallery |
| Hover effects | translateY(-4px) on some cards, scale(1.02) on others, some have both | Pick one primary hover: lift (-4px) for interactive cards, scale for gallery |

## Accessibility

**Color contrast**: Cream (#EAE4DA) on bg-deep (#0E0B09) = 13.2:1 ratio — excellent. Gold-dim text on dark backgrounds is the weakest at ~3.8:1 — fails AA for small text. Text-secondary (#B0A99E) on bg-dark (#151110) = 6.8:1 — passes AA.

**Touch targets**: Buttons meet 44px minimum. Tab buttons in restoration section are slightly small on mobile (check padding). Nav hamburger is adequate.

**Text readability**: Body text at 0.95rem with 1.65 line height is comfortable. Some card descriptions at 0.85-0.9rem may be too small for older audiences — consider 0.95rem minimum.

## What Works Well

- The peatland colour palette is distinctive and cohesive — every colour feels like it belongs to the landscape
- Cormorant Garamond gives the site an editorial, documentary quality that matches the storytelling ambition
- The scroll-expansion hero creates a memorable first impression
- Texture overlays add tactile depth without competing with content
- The HoverRevealCards for dam techniques is an engaging interaction pattern
- Photo parallax breaks create natural breathing room between content blocks
- The blog (Bog Diaries) naming is charming and on-brand

## Priority Recommendations

### 1. Consolidate image sections (Critical)
Five separate photo/gallery sections is excessive. Keep the Gallery Carousel (Restoration in Focus) and the Bento Gallery. Remove the Zoom Parallax and Hover Reveal Grid sections — their content can be absorbed into the remaining galleries. This cuts ~3 scrolling screens of redundant imagery.

### 2. Restructure into narrative chapters (High)
Group sections into clear story beats:

- **Chapter 1 — The Vision**: Hero → What We Do → Stats
- **Chapter 2 — The Story**: About → Overview Video → Parallax Break 1
- **Chapter 3 — The Work**: Restoration Tabs → Slowing The Flow → Why Larch
- **Chapter 4 — The Evidence**: Before/After → Video Documentation → Gallery
- **Chapter 5 — The Future**: Parallax Break 2 (Recovery) → Bog Diaries link → Partners

### 3. Reduce video grid density (Moderate)
Show 4-6 featured videos on the homepage with a prominent "View All 11 Videos" link to a dedicated video archive page. Eleven thumbnails in a grid is overwhelming.

### 4. Add scroll progress indicators (Minor)
A subtle progress bar or section dots on the right edge would help users orient themselves on a page this long. The nav bar already has section links but no visual feedback on scroll position.

### 5. Improve gold-dim contrast (Minor)
Replace gold-dim (rgba(184,134,74,0.25)) for text uses with a minimum of rgba(184,134,74,0.6) to meet AA contrast requirements. Keep the 0.25 opacity for borders and decorative elements only.

---

## Proposed Alternative Layout

Based on the critique, here is a restructured section order using the exact same written content, organised into narrative chapters with consolidated imagery:

```
SCROLL EXPANSION HERO (video)

─── CHAPTER 1: THE VISION ───
What We Do (Bento Grid - 6 cards)
Stats (>140 dams, 800m, 800m², 7 hectares)
Parallax Break 1: "A Landscape in Recovery"

─── CHAPTER 2: THE STORY ───
About: The Glashapullagh Project
Overview Video (Documentary embed)
Gallery Carousel: Restoration in Focus

─── CHAPTER 3: THE WORK ───
Restoration Works (Tabbed: 4 techniques)
Slowing The Flow (HoverRevealCards: 5 dam types)
Why Larch (prose + images)
Before/After: Aerial Survey Comparison

─── CHAPTER 4: THE EVIDENCE ───
Video Documentation (6 featured + "View All" link)
Parallax Break 2: "Recovery Takes Time"
Bento Gallery: Glashapullagh in Pictures

─── CONNECT ───
Partners & Funders
Footer
```

**Changes from current**:
- Removed Zoom Parallax, Hover Reveal Grid (redundant imagery)
- Moved Before/After to end of "The Work" chapter as proof of results
- Moved Overview Video next to About for context
- Gallery Carousel serves as visual punctuation between story and work
- Video grid reduced to 6 featured items
- Interactive Map removed from main flow (accessible from nav or footer) — it requires user-uploaded content and breaks flow for first-time visitors
