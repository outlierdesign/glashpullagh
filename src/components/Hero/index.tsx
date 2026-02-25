'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { staggerContainerVariants, fadeInUp } from '@/lib/animations';
import type { HeroData } from '@/types';

const scrollIndicatorVariants = {
  animate: {
    y: [0, 12, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const pathVariants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 0.4,
    transition: { duration: 2, ease: 'easeInOut' as const },
  },
};

interface HeroProps {
  data: HeroData;
}

export function Hero({ data }: HeroProps) {
  const headingVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <Image
        src={data.backgroundImage}
        alt="Glashapullagh peatland"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/40 via-bg-deep/50 to-bg-deep/60" />

      {/* SVG Decorative Elements */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 100,200 Q 300,150 500,200 T 900,200"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-gold/20"
          variants={pathVariants}
          initial="initial"
          animate="animate"
        />
        <motion.path
          d="M 150,600 Q 400,550 700,600 T 1100,600"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-gold/15"
          variants={pathVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
        />
      </svg>

      <div className="relative h-full min-h-screen flex flex-col items-center justify-center px-6">
        {/* Label Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-32 left-6 md:left-12 border border-gold/30 px-3 py-1 rounded-sm bg-bg-deep/40"
        >
          <span className="font-ui text-xs uppercase tracking-[0.2em] text-gold-light">
            {data.label}
          </span>
        </motion.div>

        {/* Main Heading Content */}
        <motion.div
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center max-w-5xl text-center"
        >
          {data.headingLines.map((line, idx) => (
            <motion.h1
              key={idx}
              variants={headingVariants}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-cream leading-tight"
            >
              {line}
            </motion.h1>
          ))}

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            transition={{ delay: 0.6 }}
            className="font-body text-lg text-cream-dim mt-6 max-w-2xl leading-relaxed"
          >
            {data.subtitle}
          </motion.p>
        </motion.div>

        {/* Coordinates Badge - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-12 right-6 md:right-12 font-ui text-xs text-gold-light/70 text-right"
        >
          <div className="flex flex-col gap-1">
            <div>
              {data.coordinates.label}
            </div>
            <div>
              {data.coordinates.latitude.toFixed(4)}° N
            </div>
            <div>
              {Math.abs(data.coordinates.longitude).toFixed(4)}° W
            </div>
            <div>
              {data.coordinates.altitude}m altitude
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator - Bottom Center */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <p className="font-ui text-xs uppercase tracking-[0.1em] text-cream-dim">
            Scroll to explore
          </p>
          <motion.div variants={scrollIndicatorVariants} animate="animate">
            <svg
              className="w-6 h-6 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
