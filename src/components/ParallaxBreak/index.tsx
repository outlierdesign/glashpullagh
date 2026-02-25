'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import type { QuoteData } from '@/types';

interface ParallaxBreakProps {
  data: QuoteData;
  id?: string;
}

export function ParallaxBreak({ data, id = 'quote' }: ParallaxBreakProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const { scrollY } = useScroll();
  const [containerTop, setContainerTop] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerTop(containerRef.current.offsetTop);
    }
  }, []);

  // Parallax effect for the image
  const imageY = useTransform(
    scrollY,
    [containerTop - 500, containerTop + 500],
    [100, -100]
  );

  return (
    <section
      id={id}
      ref={containerRef}
      className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden"
    >
      {/* Parallax Background Image */}
      <div ref={imageRef} className="absolute inset-0">
        <motion.div
          style={{ y: imageY }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={data.backgroundImage}
            alt="Quote background"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/60 via-bg-deep/40 to-bg-deep/60" />

      {/* Quote Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
        className="relative h-full flex flex-col items-center justify-center px-6"
      >
        {/* Decorative Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: '4rem' } : { width: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="h-px bg-gold mb-8"
        />

        {/* Quote Text */}
        <blockquote className="max-w-3xl text-center">
          <p className="font-display text-2xl md:text-4xl italic text-cream leading-relaxed">
            {data.text}
          </p>
        </blockquote>
      </motion.div>
    </section>
  );
}
