'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainerVariants, scrollRevealVariants } from '@/lib/animations';
import { cn } from '@/lib/cn';
import Image from 'next/image';
import { GalleryImage } from '@/types';

interface GalleryProps {
  images: GalleryImage[];
}

export function Gallery({ images }: GalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getVerticalOffset = (index: number) => {
    const offset = index % 3;
    if (offset === 0) return '';
    if (offset === 1) return 'mt-8';
    return 'mt-16';
  };

  return (
    <section id="gallery" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <h2 className="font-display text-4xl text-cream mb-12">Gallery</h2>

        {/* Masonry grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {images.map((item, index) => (
            <motion.div
              key={index}
              className={cn(
                getVerticalOffset(index),
                'rounded-lg overflow-hidden group cursor-pointer'
              )}
              variants={scrollRevealVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image container */}
              <div className="relative w-full overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />

                {/* Hover overlay with alt text */}
                {hoveredIndex === index && (
                  <motion.div
                    className="absolute inset-0 bg-bg-deep/70 flex items-end justify-start p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="font-ui text-sm text-cream">
                      {item.alt}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
