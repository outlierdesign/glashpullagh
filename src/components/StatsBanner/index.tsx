'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Counter } from '@/components/shared/Counter';
import { staggerContainerVariants, fadeInUp } from '@/lib/animations';
import type { StatItem } from '@/types';

interface StatsBannerProps {
  stats: StatItem[];
}

export function StatsBanner({ stats }: StatsBannerProps) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const statCardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="stats"
      className="relative w-full bg-bg-dark border-t border-b border-gold/20 py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={containerRef}
          variants={staggerContainerVariants}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={statCardVariants}
              className="flex flex-col items-start"
            >
              {/* Counter Number */}
              <div className="font-display text-4xl md:text-5xl font-medium text-cream mb-4">
                {isInView ? (
                  <Counter target={stat.target} suffix={stat.suffix} />
                ) : (
                  <span>0{stat.suffix}</span>
                )}
              </div>

              {/* Label */}
              <h3 className="font-ui text-xs md:text-sm uppercase tracking-wider text-gold mb-3 font-semibold">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="font-body text-sm text-cream-dim leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
