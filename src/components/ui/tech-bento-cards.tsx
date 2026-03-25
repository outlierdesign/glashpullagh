'use client';

import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface TechItem {
  title: string;
  description: string;
  image: string;
  gallery?: string[];
}

interface TechBentoCardsProps {
  items: TechItem[];
  onCardClick?: (item: TechItem) => void;
}

const cardVariants = [
  'tech-card--stone',
  'tech-card--coir',
  'tech-card--geo',
  'tech-card--composite',
  'tech-card--timber',
];

function TechCard({ item, variant, onCardClick }: { item: TechItem; variant: string; onCardClick?: (item: TechItem) => void }) {
  const images = item.gallery && item.gallery.length > 0 ? item.gallery : [item.image];
  const hasMultiple = images.length > 1;
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

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <div className={`tech-card ${variant}`} onClick={() => onCardClick?.(item)} style={{ cursor: onCardClick ? 'pointer' : undefined }}>
      <div className="tech-card-image">
        {hasMultiple ? (
          <div className="tech-carousel" ref={emblaRef}>
            <div className="tech-carousel-container">
              {images.map((src, idx) => (
                <div className="tech-carousel-slide" key={idx}>
                  <img src={src} alt={`${item.title} — ${idx + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <img src={item.image} alt={item.title} loading="lazy" />
        )}

        {/* Shimmer animation layer */}
        <div className="tech-card-shimmer" />

        {/* Carousel nav */}
        {hasMultiple && (
          <>
            <button className="tech-carousel-btn tech-carousel-prev" onClick={scrollPrev} aria-label="Previous">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className="tech-carousel-btn tech-carousel-next" onClick={scrollNext} aria-label="Next">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <div className="tech-carousel-dots">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`tech-carousel-dot ${idx === selectedIndex ? 'active' : ''}`}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  aria-label={`Image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="tech-card-content">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </div>
  );
}

export default function TechBentoCards({ items, onCardClick }: TechBentoCardsProps) {
  return (
    <div className="tech-bento-grid">
      {items.map((item, idx) => (
        <TechCard key={idx} item={item} variant={cardVariants[idx % cardVariants.length]} onCardClick={onCardClick} />
      ))}
    </div>
  );
}
