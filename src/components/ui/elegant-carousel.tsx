'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SlideData {
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  image: string;
}

const defaultSlides: SlideData[] = [
  {
    title: 'Blanket Bog',
    subtitle: 'Ecological Survey',
    description:
      'Over 130 hectares of Atlantic blanket bog — one of Ireland\'s rarest habitats. Aerial surveys reveal the vast mosaic of pools, hummocks, and sphagnum carpets that define the Glashapullagh landscape.',
    accent: '#7A9E7E',
    image: '/images/site/Glashapullagh Restoration West Limerick1.jpg',
  },
  {
    title: 'Rewetting the Bog',
    subtitle: 'Dam Installation',
    description:
      'Hundreds of peat and timber dams now block the old drainage channels, raising water tables and breathing life back into degraded peatland. Each dam is a step toward a self-sustaining ecosystem.',
    accent: '#4A8A8A',
    image: '/images/site/dam-workers.jpg',
  },
  {
    title: 'Sphagnum Recovery',
    subtitle: 'Habitat Regeneration',
    description:
      'The return of sphagnum moss is the truest sign of recovery — these remarkable plants hold up to twenty times their weight in water, rebuilding the living peat that stores carbon for millennia.',
    accent: '#6B8F3C',
    image: '/images/site/sphagnum-closeup.jpg',
  },
  {
    title: 'Community Action',
    subtitle: 'People & Place',
    description:
      'Restoration at Glashapullagh is driven by local communities, conservation volunteers, and scientific expertise — a collective effort to protect West Limerick\'s peatland heritage for future generations.',
    accent: '#C8A964',
    image: '/images/site/carrying-equipment.jpg',
  },
];

interface ElegantCarouselProps {
  slides?: SlideData[];
}

export default function ElegantCarousel({ slides: propSlides }: ElegantCarouselProps) {
  const slides = propSlides && propSlides.length > 0 ? propSlides : defaultSlides;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const SLIDE_DURATION = 6000;
  const TRANSITION_DURATION = 800;

  const goToSlide = useCallback(
    (index: number, dir?: 'next' | 'prev') => {
      if (isTransitioning || index === currentIndex) return;
      setDirection(dir || (index > currentIndex ? 'next' : 'prev'));
      setIsTransitioning(true);
      setProgress(0);
      setTimeout(() => {
        setCurrentIndex(index);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, TRANSITION_DURATION / 2);
    },
    [isTransitioning, currentIndex]
  );

  const goNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex, 'next');
  }, [currentIndex, goToSlide]);

  const goPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex, 'prev');
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    if (isPaused) return;
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 100 / (SLIDE_DURATION / 50);
      });
    }, 50);
    intervalRef.current = setInterval(() => {
      goNext();
    }, SLIDE_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [currentIndex, isPaused, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <div
      className="ec-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background accent wash */}
      <div
        className="ec-bg-wash"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${currentSlide.accent}18 0%, transparent 70%)`,
        }}
      />
      <div className="ec-inner">
        {/* Left: Text Content */}
        <div className="ec-content">
          <div className="ec-content-inner">
            {/* Collection number */}
            <div className={`ec-collection-num ${isTransitioning ? 'ec-transitioning' : 'ec-visible'}`}>
              <span className="ec-num-line" />
              <span className="ec-num-text">
                {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>
            {/* Title */}
            <h2 className={`ec-title ${isTransitioning ? 'ec-transitioning' : 'ec-visible'}`}>
              {currentSlide.title}
            </h2>
            {/* Subtitle */}
            <p
              className={`ec-subtitle ${isTransitioning ? 'ec-transitioning' : 'ec-visible'}`}
              style={{ color: currentSlide.accent }}
            >
              {currentSlide.subtitle}
            </p>
            {/* Description */}
            <p className={`ec-description ${isTransitioning ? 'ec-transitioning' : 'ec-visible'}`}>
              {currentSlide.description}
            </p>
            {/* Navigation Arrows */}
            <div className="ec-nav-arrows">
              <button onClick={goPrev} className="ec-arrow-btn" aria-label="Previous slide">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={goNext} className="ec-arrow-btn" aria-label="Next slide">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Right: Image */}
        <div className="ec-image-container">
          <div className={`ec-image-frame ${isTransitioning ? 'ec-transitioning' : 'ec-visible'}`}>
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="ec-image"
            />
            <div
              className="ec-image-overlay"
              style={{
                background: `linear-gradient(135deg, ${currentSlide.accent}22 0%, transparent 50%)`,
              }}
            />
          </div>
          {/* Decorative frame corners */}
          <div className="ec-frame-corner ec-frame-corner--tl" style={{ borderColor: currentSlide.accent }} />
          <div className="ec-frame-corner ec-frame-corner--br" style={{ borderColor: currentSlide.accent }} />
        </div>
      </div>
      {/* Progress Indicators */}
      <div className="ec-progress-bar">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`ec-progress-item ${index === currentIndex ? 'ec-active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className="ec-progress-track">
              <div
                className="ec-progress-fill"
                style={{
                  width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%',
                  backgroundColor: index === currentIndex ? currentSlide.accent : undefined,
                }}
              />
            </div>
            <span className="ec-progress-label">{slide.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
