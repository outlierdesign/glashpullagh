'use client';

import { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────────
 * ImageSequenceScroll  (video-seek implementation)
 *
 * Scroll-driven video animation (Apple-style).
 * Uses a <video> element and seeks through it based on scroll
 * progress via GSAP ScrollTrigger. Much more connection-friendly
 * than loading 96+ individual frame images.
 * ──────────────────────────────────────────────────────────── */

interface TextOverlay {
  text: string;
  startAt: number;
  endAt: number;
  className?: string;
}

interface ImageSequenceScrollProps {
  /** Path to the video file */
  videoSrc?: string;
  /** How many viewport heights the pinned scroll should last */
  scrollDistance?: number;
  /** Text overlays that fade in/out at specific scroll positions */
  overlays?: TextOverlay[];
  /** Eyebrow label above the section */
  eyebrow?: string;
  /** Poster image for initial display */
  poster?: string;
  /* Legacy props — ignored in video mode */
  frameCount?: number;
  framePath?: string;
}

export default function ImageSequenceScroll({
  videoSrc = '/sequence/geotextile.mp4',
  scrollDistance = 4,
  overlays = [],
  eyebrow,
  poster,
}: ImageSequenceScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // Wait for GSAP to be loaded (CDN in ClientSite)
    const waitForGsap = (): Promise<void> => {
      return new Promise((resolve) => {
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

    let scrollTriggerInstance: any = null;
    let overlayTriggers: any[] = [];

    const setup = async () => {
      await waitForGsap();

      // Wait for video metadata to load so we know the duration
      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) {
          resolve();
        } else {
          video.addEventListener('loadedmetadata', () => resolve(), { once: true });
        }
      });

      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const duration = video.duration;

      // Pin section and scrub video on scroll
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${window.innerHeight * scrollDistance}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self: any) => {
          const progress = self.progress;
          const targetTime = progress * duration;
          // Only seek if difference is significant (avoids jitter)
          if (Math.abs(video.currentTime - targetTime) > 0.03) {
            video.currentTime = targetTime;
          }
        },
      });

      // Animate text overlays
      const overlayEls = section.querySelectorAll('.seq-overlay');
      overlayEls.forEach((el, i) => {
        const overlay = overlays[i];
        if (!overlay) return;

        const trigger = gsap.fromTo(
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
        overlayTriggers.push(trigger);
      });
    };

    setup();

    return () => {
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
      overlayTriggers.forEach((t: any) => {
        if (t && t.scrollTrigger) t.scrollTrigger.kill();
      });
    };
  }, [videoSrc, scrollDistance, overlays, prefersReducedMotion]);

  // Reduced motion fallback — show poster or paused video at midpoint
  if (prefersReducedMotion) {
    return (
      <section className="image-sequence-section image-sequence-section--static">
        <div className="image-sequence-container">
          <video
            src={videoSrc}
            muted
            playsInline
            preload="metadata"
            poster={poster}
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
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          poster={poster}
          className="image-sequence-canvas"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
