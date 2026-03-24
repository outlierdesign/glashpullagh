'use client';

import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface DamItem {
  title: string;
  description: string;
  image: string;
  gallery?: string[];
}

interface DamGalleryCardsProps {
  items: DamItem[];
}

function DamCard({ item }: { item: DamItem }) {
  const images = item.gallery && item.gallery.length > 0 ? item.gallery : [item.image];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="dam-gallery-card">
      {/* Carousel */}
      <div className="dam-carousel-wrapper">
        <div className="dam-carousel" ref={emblaRef}>
          <div className="dam-carousel-container">
            {images.map((src, idx) => (
              <div className="dam-carousel-slide" key={idx}>
                <img src={src} alt={`${item.title} — image ${idx + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button className="dam-carousel-btn dam-carousel-prev" onClick={scrollPrev} aria-label="Previous image">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className="dam-carousel-btn dam-carousel-next" onClick={scrollNext} aria-label="Next image">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="dam-carousel-dots">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`dam-carousel-dot ${idx === selectedIndex ? 'active' : ''}`}
                onClick={() => emblaApi?.scrollTo(idx)}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="dam-card-content">
        <h3 className="dam-card-title">{item.title}</h3>
        <p className="dam-card-description">{item.description}</p>
      </div>
    </div>
  );
}

export default function DamGalleryCards({ items }: DamGalleryCardsProps) {
  return (
    <div className="dam-gallery-grid">
      {items.map((item, idx) => (
        <DamCard key={idx} item={item} />
      ))}
    </div>
  );
}
