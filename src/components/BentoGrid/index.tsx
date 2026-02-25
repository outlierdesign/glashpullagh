'use client';

import { motion } from 'framer-motion';
import { staggerContainerVariants, scrollRevealVariants } from '@/lib/animations';
import { cn } from '@/lib/cn';
import Image from 'next/image';
import { StoryItem } from '@/types';

interface BentoGridProps {
  items: StoryItem[];
}

export function BentoGrid({ items }: BentoGridProps) {
  const getColSpan = (gridSize: StoryItem['gridSize']) => {
    switch (gridSize) {
      case 'wide':
        return 'md:col-span-8';
      case 'lg':
        return 'md:col-span-6';
      case 'md':
        return 'md:col-span-4';
      case 'sm':
        return 'md:col-span-4';
      default:
        return 'md:col-span-4';
    }
  };

  const getAspectRatio = (gridSize: StoryItem['gridSize']) => {
    switch (gridSize) {
      case 'wide':
        return 'aspect-[16/9]';
      case 'lg':
        return 'aspect-[4/3]';
      case 'md':
        return 'aspect-[3/4]';
      case 'sm':
        return 'aspect-square';
      default:
        return 'aspect-square';
    }
  };

  return (
    <section id="story" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="mb-12">
          <div className="w-12 h-px bg-gold mb-4" />
          <h2 className="font-display text-4xl text-cream">Our Story</h2>
        </div>

        {/* Bento grid */}
        <motion.div
          className="grid grid-cols-12 gap-4"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              className={cn(
                'col-span-12',
                getColSpan(item.gridSize),
                getAspectRatio(item.gridSize),
                'relative rounded-lg overflow-hidden bg-bg-card group cursor-pointer'
              )}
              variants={scrollRevealVariants}
            >
              {/* Background image */}
              <Image
                src={item.image}
                alt={item.heading}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-deep/90" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="font-ui text-xs uppercase tracking-[0.2em] text-gold-light mb-2">
                  {item.label}
                </div>
                <h3 className="font-display text-xl text-cream mb-2">
                  {item.heading}
                </h3>
                <p className="text-cream-dim text-sm line-clamp-3">
                  {item.body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
