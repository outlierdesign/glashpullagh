'use client';

import React, { useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  image: string;
  gallery?: string[];
  icon?: React.ReactNode;
  variant?: string;
}

function ModalGallery({ images, title }: { images: string[]; title: string }) {
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

  return (
    <div className="card-modal-gallery">
      {hasMultiple ? (
        <div className="card-modal-carousel" ref={emblaRef}>
          <div className="card-modal-carousel-container">
            {images.map((src, idx) => (
              <div className="card-modal-carousel-slide" key={idx}>
                <img src={src} alt={`${title} — ${idx + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
          <button
            className="card-modal-carousel-btn card-modal-carousel-prev"
            onClick={(e) => { e.stopPropagation(); emblaApi?.scrollPrev(); }}
            aria-label="Previous"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="card-modal-carousel-btn card-modal-carousel-next"
            onClick={(e) => { e.stopPropagation(); emblaApi?.scrollNext(); }}
            aria-label="Next"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <div className="card-modal-carousel-dots">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`card-modal-carousel-dot ${idx === selectedIndex ? 'active' : ''}`}
                onClick={() => emblaApi?.scrollTo(idx)}
                aria-label={`Image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <img src={images[0]} alt={title} className="card-modal-single-image" />
      )}
    </div>
  );
}

export default function CardModal({
  isOpen,
  onClose,
  title,
  description,
  image,
  gallery,
  icon,
  variant,
}: CardModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const images = gallery && gallery.length > 0 ? gallery : [image];

  return (
    <div className="card-modal-overlay" onClick={onClose}>
      <div
        className={`card-modal ${variant || ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button className="card-modal-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="card-modal-body">
          <div className="card-modal-image-side">
            <ModalGallery images={images} title={title} />
          </div>
          <div className="card-modal-text-side">
            {icon && <div className="card-modal-icon">{icon}</div>}
            <h3 className="card-modal-title">{title}</h3>
            <div className="card-modal-description">
              {description.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
