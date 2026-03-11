# Glashapullagh Peatland Restoration Website

A sophisticated Next.js website showcasing the Glashapullagh peatland restoration project in West Limerick, Ireland. This is a server-rendered site with immersive dark design, advanced animations, and interactive media.

## Project Overview

**Glashapullagh** is a working peatland restoration landscape spanning 287 hectares. This website presents the science, craft, and long-term stewardship of bogland recovery through engaging visuals, video documentation, and interactive elements.

## Technology Stack

- **Framework**: Next.js 13+ (App Router)
- **Styling**: CSS with custom design tokens
- **Animations**: GSAP 3.12.5 + ScrollTrigger
- **Scroll**: Lenis smooth scroll library
- **Graphics**: WebGL 2 for water ripple effects
- **Fonts**: Playfair Display, Lora, Inter from Google Fonts
- **Content Management**: JSON-based content structure

## Design System

### Color Palette
- **Deep Background**: `#050604` (--bg-deep)
- **Gold Accent**: `#C4903D` (--gold) with light/bright variants
- **Green Tones**: Peatland-inspired greens from deep to sage
- **Water Blues**: `#4A6B82` (--water) and variants
- **Text**: Cream `#E8E2D6` to dim `#6B6860`

### Typography
- **Display**: Playfair Display (serif, elegant)
- **Body**: Lora (serif, readable)
- **UI**: Inter (sans-serif, modern)

### Spacing & Radius
- Design tokens for consistent spacing
- Border radius: `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (12px)

## Project Structure

```
glashpullagh-project/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── globals.css         # Complete design system & all CSS
│   │   └── page.tsx            # Server component entry point
│   ├── components/
│   │   └── ClientSite.tsx      # Main client component (1500+ lines)
│   └── data/
│       └── content.json        # Content structure for all sections
├── public/                     # Static assets (to be added)
└── package.json               # Dependencies
```

## File Descriptions

### 1. `src/app/layout.tsx`
Root layout component that sets up:
- Metadata for the site (title, description)
- Google Fonts imports (Playfair Display, Lora, Inter)
- HTML structure

### 2. `src/app/globals.css`
Comprehensive stylesheet containing:
- Design token definitions (colors, fonts, spacing)
- Reset and global styles
- Component styles for all 12+ sections:
  - Hero section with canvas
  - Bento grid cards
  - Before/After slider
  - Stats grid
  - Parallax breaks
  - About section
  - Topographical map
  - Restoration grid
  - Monitoring cards
  - Video grid with lightbox
  - Documentary embed
  - Gallery with overlays
  - Footer
- Responsive breakpoints for mobile/tablet

### 3. `src/app/page.tsx`
Server component that:
- Reads content from `src/data/content.json`
- Passes data to the main client component
- Handles file system operations on the server

### 4. `src/components/ClientSite.tsx`
Main client component (1600+ lines) featuring:
- **Water Ripple Effect**: WebGL 2 shader with simplex noise
  - Fragment shader creates water distortion over hero canvas
  - Includes glow effect and animated timing
- **Before/After Slider**: Drag-to-compare functionality
  - Uses clip-path for real-time position updates
  - Touch and mouse event support
- **GSAP Animations**: Scroll-triggered entrance animations
  - Hero text stagger animation
  - Card animations on scroll
  - Parallax scrolling effects
  - Gallery item scale/fade
- **Lenis Integration**: Smooth scrolling throughout
- **Lightbox Modal**: For images and embedded videos
- **All 12 Sections Rendered**:
  1. Hero (with WebGL canvas)
  2. Bento Grid
  3. Before/After Comparison
  4. Stats
  5. Parallax Break 1
  6. About Section
  7. Topographical Map
  8. Restoration Techniques Grid
  9. Parallax Break 2
  10. Monitoring & Research
  11. Video Grid with Lightbox
  12. Documentary Embed
  13. Photo Gallery
  14. Footer

### 5. `src/data/content.json`
Structured content file containing:
- Hero title and subtitle
- Bento grid items (4 cards)
- Before/After image URLs
- Stats with values and labels
- Parallax break text
- About section with multi-paragraph text
- Topographical map metadata
- Restoration techniques (3 items with images)
- Monitoring metrics (6 items)
- Video grid (6 videos with thumbnails)
- Documentary featured video
- Gallery items (9 images)
- Footer sections and links

## Features

### Interactive Elements

1. **WebGL Water Ripple**
   - Animates over the hero background
   - Uses OpenGL fragment shader with Simplex noise
   - Real-time distortion effect

2. **Before/After Slider**
   - Drag handle to compare images
   - Smooth clip-path animation
   - Works on touch and mouse devices

3. **GSAP Scroll Animations**
   - Stagger entrance animations
   - Scroll-triggered parallax
   - Gallery item scaling
   - ScrollTrigger integration

4. **Lenis Smooth Scroll**
   - Smooth, physics-based scrolling
   - Integrated with GSAP
   - Mobile-friendly

5. **Video Lightbox**
   - Click any video card or gallery image to open
   - Supports YouTube/Vimeo embeds and images
   - Close button and click-outside dismiss

6. **Responsive Design**
   - Mobile-first CSS
   - Breakpoints at 768px
   - Flexible grid layouts
   - Touch-friendly interactions

### Sections

**Hero**: Eye-catching intro with dynamic canvas effect and CTA button

**Bento Grid**: Four key aspects of the project (Restoration, Science, Stewardship, Community)

**Before/After**: Visual transformation timeline with draggable comparison

**Stats**: Key metrics (287 hectares, 15+ years, CO₂ sequestered, water rise)

**Parallax Breaks**: Full-width immersive sections with moving text

**About**: Project history and vision with accompanying image

**Topo Map**: SVG-based topographical overview of the site

**Restoration**: Three-column grid of restoration techniques with images

**Monitoring**: Six monitoring metrics with icons and descriptions

**Videos**: 3x2 grid of video cards with play buttons and lightbox integration

**Documentary**: Featured full-width video embed

**Gallery**: 3x3 grid of gallery images with hover overlays and lightbox

**Footer**: Three-column footer with project, resources, and social links

## Content Structure

All content is driven by the JSON file. To customize:

1. Edit `/src/data/content.json`
2. Update text, image URLs, links
3. Site automatically renders with new content
4. No code changes needed for content updates

## Setup Instructions

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## External Dependencies

Loaded from CDN in `ClientSite.tsx`:
- GSAP 3.12.5 (animations)
- ScrollTrigger 3.12.5 (scroll animations)
- Lenis 1.1.13 (smooth scroll)

These are loaded dynamically on component mount to avoid SSR issues.

## Browser Support

- Modern browsers with WebGL 2 support
- Chrome, Safari, Firefox, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Fallback for non-WebGL environments (graceful degradation)

## Performance Optimizations

- Server-side rendering for SEO
- CSS design tokens for minimal redundancy
- Script loading deferred to client mount
- CSS classes use semantic naming
- Responsive images via external URLs
- Minimal JavaScript on initial load

## Customization

### Colors
Edit CSS custom properties in `globals.css`:
```css
:root {
  --gold: #C4903D;
  --bg-deep: #050604;
  /* ... etc */
}
```

### Fonts
Change font imports in `layout.tsx` and CSS variables in `globals.css`

### Content
Update `/src/data/content.json` with new text, images, and links

### Animations
Adjust GSAP timing in `ClientSite.tsx` `initAnimations()` function

## Deployment

Optimized for Vercel, Netlify, or any Node.js hosting:

```bash
npm run build
npm start
```

Or deploy directly to Vercel:
```bash
vercel deploy
```

## File Sizes

- `layout.tsx`: ~500 bytes
- `globals.css`: ~15 KB (all styles)
- `page.tsx`: ~300 bytes
- `ClientSite.tsx`: ~45 KB (comprehensive component)
- `content.json`: ~12 KB (sample data)

## Future Enhancements

- Add TypeScript types for content schema
- Implement image optimization (Next.js Image)
- Add newsletter signup integration
- Create admin panel for content management
- Add multi-language support
- Implement analytics integration
- Add contact form with backend
- Create blog/news section
- Add team member profiles
- Implement email notifications

## License

Glashapullagh Project - 2026. All rights reserved.

---

**Created**: 2026
**Technology**: Next.js, GSAP, WebGL, Lenis
**Status**: Production-ready
