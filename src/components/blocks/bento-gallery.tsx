'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';

interface BentoImage {
  src: string;
  alt: string;
  caption?: string;
}

interface BentoGalleryProps {
  images: BentoImage[];
  heading?: string;
  eyebrow?: string;
}

const BENTO_PATTERNS = [
  { colSpan: 2, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 2, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
];

export function BentoGallery({ images, heading = 'Gallery', eyebrow = 'Visual Journey' }: BentoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const navigateLightbox = (direction: number) => {
    if (lightboxIndex === null) return;
    const next = lightboxIndex + direction;
    if (next >= 0 && next < images.length) setLightboxIndex(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setLightboxIndex(null);
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  };

  const bentoImages = useMemo(
    () =>
      images.map((img, i) => ({
        ...img,
        ...BENTO_PATTERNS[i % BENTO_PATTERNS.length],
      })),
    [images]
  );

  return (
    <section
      style={{
        background: '#050604',
        padding: 'clamp(4rem, 8vw, 8rem) 0',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {(heading || eyebrow) && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            {eyebrow && (
              <p
                style={{
                  color: '#C4903D',
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2
                style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 400,
                  color: '#F5F0E8',
                  margin: 0,
                }}
              >
                {heading}
              </h2>
            )}
          </div>
        )}

        <div
          className="bento-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: 'minmax(160px, 1fr)',
            gap: 'clamp(8px, 1vw, 16px)',
          }}
        >
          {bentoImages.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setLightboxIndex(idx)}
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: 'none',
                padding: 0,
                gridColumn: `span ${item.colSpan}`,
                gridRow: `span ${item.rowSpan}`,
                background: 'rgba(255,255,255,0.03)',
              }}
              className="bento-item"
              aria-label={`View ${item.caption || item.alt || 'image'}`}
            >
              <Image
                src={item.src}
                alt={item.alt || ''}
                fill
                className="bento-img"
                style={{ objectFit: 'cover', transition: 'transform 0.7s ease' }}
                sizes={
                  item.colSpan === 2
                    ? '(max-width: 768px) 100vw, 50vw'
                    : '(max-width: 768px) 50vw, 25vw'
                }
              />
              <div
                className="bento-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0)',
                  transition: 'background 0.3s ease',
                }}
              />
              {item.caption && (
                <div
                  className="bento-caption"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 'clamp(8px, 1.5vw, 16px)',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <p
                    style={{
                      color: '#fff',
                      fontSize: 'clamp(0.7rem, 1vw, 0.875rem)',
                      fontFamily: 'DM Sans, sans-serif',
                      fontWeight: 500,
                      margin: 0,
                    }}
                  >
                    {item.caption}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>

        <style jsx global>{`
          .bento-item:hover .bento-img {
            transform: scale(1.05);
          }
          .bento-item:hover .bento-overlay {
            background: rgba(0,0,0,0.2) !important;
          }
          .bento-item:hover .bento-caption {
            opacity: 1 !important;
          }
          @media (max-width: 639px) {
            .bento-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              grid-auto-rows: minmax(120px, 1fr) !important;
            }
          }
        `}</style>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-label="Image lightbox"
          tabIndex={0}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          {/* Close */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              fontSize: '1.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              transition: 'background 0.2s',
            }}
            aria-label="Close lightbox"
          >
            ✕
          </button>

          {/* Counter */}
          <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', zIndex: 10, fontFamily: 'DM Sans, sans-serif' }}>
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
              aria-label="Previous image"
            >
              ‹
            </button>
          )}

          {/* Next */}
          {lightboxIndex < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
              aria-label="Next image"
            >
              ›
            </button>
          )}

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '1200px', maxHeight: '85vh', width: '100%', height: '100%' }}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt || ''}
              fill
              style={{ objectFit: 'contain' }}
              sizes="100vw"
            />
          </div>

          {/* Caption */}
          {images[lightboxIndex].caption && (
            <p style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center', maxWidth: '30rem', fontFamily: 'DM Sans, sans-serif' }}>
              {images[lightboxIndex].caption}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
