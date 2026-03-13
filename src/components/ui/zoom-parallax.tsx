'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  const imagePositions = [
    'top-0 flex h-full w-full items-center justify-center',
    'top-[-30vh] flex h-full w-full items-center justify-center',
    'top-[-10vh] flex h-full w-full items-center justify-center left-[-25vw]',
    'left-[27.5vw] flex h-full w-full items-center justify-center',
    'top-[27.5vh] left-[5vw] flex h-full w-full items-center justify-center',
    'top-[27.5vh] left-[-22.5vw] flex h-full w-full items-center justify-center',
    'top-[22.5vh] left-[25vw] flex h-full w-full items-center justify-center',
  ];

  const imageSizes = [
    'h-[25vh] w-[25vw]',
    'h-[30vh] w-[35vw]',
    'h-[45vh] w-[30vw]',
    'h-[25vh] w-[20vw]',
    'h-[25vh] w-[20vw]',
    'h-[15vh] w-[15vw]',
    'h-[15vh] w-[10vw]',
  ];

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: 'var(--bg-deep, #0E0B09)' }}>
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];
          return (
            <motion.div
              key={index}
              style={{ scale }}
              className={`absolute ${imagePositions[index % imagePositions.length]}`}
            >
              <div className={`relative ${imageSizes[index % imageSizes.length]}`}>
                <img
                  src={src}
                  alt={alt || `Peatland restoration image ${index + 1}`}
                  className="h-full w-full object-cover rounded-sm"
                  loading="lazy"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
