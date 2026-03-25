'use client';

import { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────────
 * ImageSequenceScroll
 *
 * A scroll-driven canvas image sequence animation (Apple-style).
 * Frames are pre-extracted JPEGs served from /public/sequence/.
 * GSAP ScrollTrigger pins the section and scrubs through frames
 * as the user scrolls.
 * ──────────────────────────────────────────────────────────── */

interface TextOverlay {
  text: string;
  /** When to start showing (0–1 scroll progress) */
  startAt: number;
  /** When to finish showing (0–1 scroll progress) */
  endAt: number;
  /** CSS class for positioning / styling */
  className?: string;
}

interface ImageSequenceScrollProps {
  /** Total number of frames */
  frameCount?: number;
  /** Path pattern — use %d for frame number (padded to 4 digits) */
  framePath?: string;
  /** How many viewport heights the pinned scroll should last */
  scrollDistance?: number;
  /** Text overlays that fade in/out at specific scroll positions */
  overlays?: TextOverlay[];
  /** Eyebrow label above the section */
  eyebrow?: string;
}

export default function ImageSequenceScroll({
  frameCount = 96,
  framePath = '/sequence/frame_%04d.jpg',
  scrollDistance = 4,
  overlays = [],
  eyebrow,
}: ImageSequenceScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Wait for GSAP to be loaded (it's loaded from CDN in ClientSite)
    const waitForGsap = () => {
      return new Promise<void>((resolve) => {
        const check = () => {
          if (window.gsap && window.ScrollTrigger) {
            resolve();
          } else {
            requestAnimationFrame(check);
          }
        };
        check();
      });
    };

    // Build frame URL from pattern
    const getFrameUrl = (index: number): string => {
      const num = String(index + 1).padStart(4, '0');
      return framePath.replace('%04d', num);
    };

    // State
    const images: HTMLImageElement[] = [];
    const state = { frame: 0 };
    let tween: any = null;

    // Render current frame to canvas
    const render = () => {
      const img = images[state.frame];
      if (!img || !img.complete || !img.naturalWidth) return;

      // High-DPI support
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const displayW = rect.width;
      const displayH = rect.height;

      // Only resize if needed
      if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;
        ctx.scale(dpr, dpr);
      }

      ctx.clearRect(0, 0, displayW, displayH);

      // Cover-fit the image
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = displayW / displayH;
      let drawW: number, drawH: number, drawX: number, drawY: number;

      if (imgRatio > canvasRatio) {
        // Image is wider — crop sides
        drawH = displayH;
        drawW = displayH * imgRatio;
        drawX = (displayW - drawW) / 2;
        drawY = 0;
      } else {
        // Image is taller — crop top/bottom
        drawW = displayW;
        drawH = displayW / imgRatio;
        drawX = 0;
        drawY = (displayH - drawH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    // Preload images
    const preload = (): Promise<void> => {
      return new Promise((resolve) => {
        let loaded = 0;
        for (let i = 0; i < frameCount; i++) {
          const img = new Image();
          img.src = getFrameUrl(i);
          img.onload = () => {
            loaded++;
            // Render first frame immediately
            if (i === 0) render();
            if (loaded === frameCount) resolve();
          };
          img.onerror = () => {
            loaded++;
            if (loaded === frameCount) resolve();
          };
          images.push(img);
        }
      });
    };

    // Setup GSAP animation
    const setup = async () => {
      await waitForGsap();
      await preload();

      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // Animate frame index based on scroll
      tween = gsap.to(state, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        onUpdate: render,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${window.innerHeight * scrollDistance}`,
          scrub: 0.15,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Animate text overlays based on scroll progress
      const overlayEls = section.querySelectorAll('.seq-overlay');
      overlayEls.forEach((el, i) => {
        const overlay = overlays[i];
        if (!overlay) return;

        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: `top+=${window.innerHeight * scrollDistance * overlay.startAt} top`,
              end: `top+=${window.innerHeight * scrollDistance * overlay.endAt} top`,
              scrub: true,
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    };

    setup();

    // Handle resize
    const handleResize = () => {
      render();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (tween) tween.kill();
      if (window.ScrollTrigger) {
        window.ScrollTrigger.getAll().forEach((t: any) => {
          if (t.trigger === section || t.trigger === canvas) {
            t.kill();
          }
        });
      }
    };
  }, [frameCount, framePath, scrollDistance, overlays, prefersReducedMotion]);

  // Reduced motion fallback — show static middle frame
  if (prefersReducedMotion) {
    const midFrame = Math.floor(frameCount / 2);
    const num = String(midFrame + 1).padStart(4, '0');
    const staticSrc = framePath.replace('%04d', num);

    return (
      <section className="image-sequence-section image-sequence-section--static">
        <div className="image-sequence-container">
          <img
            src={staticSrc}
            alt="Geotextile restoration animation"
            style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
          />
          {overlays.map((overlay, i) => (
            <div key={i} className={`seq-overlay seq-overlay--visible ${overlay.className || ''}`}>
              {overlay.text}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="image-sequence-section">
      {eyebrow && (
        <div className="seq-eyebrow">{eyebrow}</div>
      )}
      <div className="image-sequence-container">
        <canvas
          ref={canvasRef}
          className="image-sequence-canvas"
        />
        {/* Text overlays */}
        {overlays.map((overlay, i) => (
          <div key={i} className={`seq-overlay ${overlay.className || ''}`}>
            {overlay.text}
          </div>
        ))}
      </div>
    </section>
  );
}
