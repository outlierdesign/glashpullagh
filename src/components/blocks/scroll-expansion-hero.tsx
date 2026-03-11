'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import Image from 'next/image';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [viewportWidth, setViewportWidth] = useState<number>(1200);

  // Track scroll position relative to the tall container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = containerHeight - viewportHeight;

      if (scrollableDistance <= 0) return;

      // How far we've scrolled into the container
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setViewportWidth(window.innerWidth);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Interpolated values
  const minW = isMobile ? 280 : 360;
  const mediaWidthPx = minW + scrollProgress * (viewportWidth - minW);
  const mediaHeightVh = 50 + scrollProgress * 50; // 50vh -> 100vh
  const borderRadius = 16 * (1 - scrollProgress); // 16px -> 0
  const bgOpacity = 1 - scrollProgress;
  const overlayOpacity = 0.5 - scrollProgress * 0.4;
  const textOffsetX = scrollProgress * (isMobile ? 120 : 100);
  const contentOpacity = scrollProgress >= 0.85 ? (scrollProgress - 0.85) / 0.15 : 0;

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div
      ref={containerRef}
      style={{ height: '300vh' }}
      className="relative"
    >
      {/* Sticky viewport that stays fixed while we scroll through the tall container */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* Background image — fades out as media expands */}
        <div
          className="absolute inset-0 z-0 transition-opacity duration-100"
          style={{ opacity: bgOpacity }}
        >
          <Image
            src={bgImageSrc}
            alt="Background"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Centered expanding media */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div
            className="relative overflow-hidden transition-none"
            style={{
              width: `min(${mediaWidthPx}px, 100vw)`,
              height: `${mediaHeightVh}vh`,
              maxWidth: '100vw',
              maxHeight: '100vh',
              borderRadius: `${borderRadius}px`,
              boxShadow:
                scrollProgress < 0.95
                  ? '0px 0px 50px rgba(0, 0, 0, 0.3)'
                  : 'none',
            }}
          >
            {mediaType === 'video' ? (
              mediaSrc.includes('youtube.com') ? (
                <div className="relative w-full h-full pointer-events-none">
                  <iframe
                    width="100%"
                    height="100%"
                    src={
                      mediaSrc.includes('embed')
                        ? mediaSrc +
                          (mediaSrc.includes('?') ? '&' : '?') +
                          'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                        : mediaSrc.replace('watch?v=', 'embed/') +
                          '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                          mediaSrc.split('v=')[1]
                    }
                    className="w-full h-full"
                    style={{ borderRadius: `${borderRadius}px` }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div
                    className="absolute inset-0 z-10"
                    style={{ pointerEvents: 'none' }}
                  />
                  <div
                    className="absolute inset-0 bg-black/30"
                    style={{
                      opacity: overlayOpacity,
                      borderRadius: `${borderRadius}px`,
                    }}
                  />
                </div>
              ) : (
                <div className="relative w-full h-full pointer-events-none">
                  <video
                    src={mediaSrc}
                    poster={posterSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: `${borderRadius}px` }}
                    controls={false}
                    disablePictureInPicture
                    disableRemotePlayback
                  />
                  <div
                    className="absolute inset-0 z-10"
                    style={{ pointerEvents: 'none' }}
                  />
                  <div
                    className="absolute inset-0 bg-black/30"
                    style={{
                      opacity: overlayOpacity,
                      borderRadius: `${borderRadius}px`,
                    }}
                  />
                </div>
              )
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={mediaSrc}
                  alt={title || 'Media content'}
                  width={1920}
                  height={1080}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: `${borderRadius}px` }}
                  priority
                />
                <div
                  className="absolute inset-0 bg-black/50"
                  style={{
                    opacity: 0.7 - scrollProgress * 0.4,
                    borderRadius: `${borderRadius}px`,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Title text — splits apart as you scroll */}
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center flex-col gap-3 pointer-events-none ${
            textBlend ? 'mix-blend-difference' : ''
          }`}
          style={{ opacity: 1 - scrollProgress * 1.2 }}
        >
          <h2
            className="text-4xl md:text-5xl lg:text-7xl font-bold"
            style={{
              transform: `translateX(-${textOffsetX}vw)`,
              color: 'var(--cream)',
              fontFamily: 'var(--font-display)',
              transition: 'none',
            }}
          >
            {firstWord}
          </h2>
          <h2
            className="text-4xl md:text-5xl lg:text-7xl font-bold"
            style={{
              transform: `translateX(${textOffsetX}vw)`,
              color: 'var(--cream)',
              fontFamily: 'var(--font-display)',
              transition: 'none',
            }}
          >
            {restOfTitle}
          </h2>
        </div>

        {/* Date + scroll prompt — below center, fades out early */}
        <div
          className="absolute z-20 bottom-16 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: 1 - scrollProgress * 3 }}
        >
          {date && (
            <p
              className="text-xl md:text-2xl"
              style={{
                color: 'var(--gold-light)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {date}
            </p>
          )}
          {scrollToExpand && (
            <p
              className="text-sm font-medium tracking-wider uppercase"
              style={{
                color: 'var(--cream-dim)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {scrollToExpand}
            </p>
          )}
          {/* Animated scroll indicator */}
          <div className="mt-3 flex flex-col items-center animate-bounce">
            <svg
              width="20"
              height="28"
              viewBox="0 0 20 28"
              fill="none"
              className="opacity-60"
            >
              <rect
                x="1"
                y="1"
                width="18"
                height="26"
                rx="9"
                stroke="var(--cream-dim)"
                strokeWidth="1.5"
              />
              <circle cx="10" cy="8" r="2" fill="var(--cream-dim)">
                <animate
                  attributeName="cy"
                  values="8;18;8"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="1;0.3;1"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        </div>
      </div>

      {/* Content that appears after the sticky section */}
      <div
        className="relative z-30"
        style={{
          opacity: contentOpacity,
          transform: `translateY(${(1 - contentOpacity) * 30}px)`,
          transition: 'none',
        }}
      >
        <div
          className="px-8 py-16 md:px-16 lg:py-24"
          style={{ background: 'var(--bg-deep)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpandMedia;
