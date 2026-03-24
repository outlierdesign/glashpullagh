'use client';

import React, { useState } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
  span: string; // CSS grid-column + grid-row
}

const galleryImages: GalleryImage[] = [
  {
    src: '/images/site/carrying-equipment.jpg',
    alt: 'Community volunteers carrying restoration equipment across the bog',
    span: 'col-span-2 row-span-2',
  },
  {
    src: '/images/site/dam-workers.jpg',
    alt: 'Workers installing wooden dam structures in drainage channels',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/site/sphagnum-closeup.jpg',
    alt: 'Sphagnum moss close-up showing new growth on restored peatland',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/site/monitoring-post.jpg',
    alt: 'Field monitoring post measuring water table levels',
    span: 'col-span-1 row-span-2',
  },
  {
    src: '/images/site/Glashapullagh Restoration West Limerick23.jpg',
    alt: 'Timber plank dam holding water in a restored drain',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/site/peat-pool.jpg',
    alt: 'Pool of water forming behind a dam, rewetting the peat',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/site/landscape-figure.jpg',
    alt: 'Surveyor walking across the Glashapullagh bogland',
    span: 'col-span-2 row-span-1',
  },
  {
    src: '/images/site/plank-dam.jpg',
    alt: 'Wooden plank dam installed across a shallow drain',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/site/dusk-silhouette.jpg',
    alt: 'Silhouette at dusk across the restored peatland landscape',
    span: 'col-span-1 row-span-1',
  },
];

export default function PhotoBentoGallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <>
      <div className="photo-bento-grid">
        {galleryImages.map((img, idx) => (
          <div
            key={idx}
            className={`photo-bento-cell ${img.span}`}
            onClick={() => setLightboxIdx(idx)}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
            <div className="photo-bento-hover">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="photo-lightbox-overlay"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            className="photo-lightbox-close"
            onClick={() => setLightboxIdx(null)}
          >
            ✕
          </button>
          <button
            className="photo-lightbox-nav photo-lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((lightboxIdx - 1 + galleryImages.length) % galleryImages.length);
            }}
          >
            ‹
          </button>
          <img
            src={galleryImages[lightboxIdx].src}
            alt={galleryImages[lightboxIdx].alt}
            className="photo-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="photo-lightbox-nav photo-lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((lightboxIdx + 1) % galleryImages.length);
            }}
          >
            ›
          </button>
          <p className="photo-lightbox-caption">
            {galleryImages[lightboxIdx].alt}
          </p>
        </div>
      )}
    </>
  );
}
