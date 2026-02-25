'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { MonitoringData } from '@/types';

interface MonitoringProps {
  data: MonitoringData;
}

export function Monitoring({ data }: MonitoringProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <section ref={ref} id="monitoring" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Column - Text */}
          <motion.div variants={itemVariants}>
            <p className="font-ui text-xs uppercase tracking-[0.2em] text-gold-light mb-4">
              Monitoring Program
            </p>
            <h2 className="font-display text-4xl text-cream mb-8">{data.heading}</h2>
            <div className="space-y-6">
              {data.bodyParagraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  variants={itemVariants}
                  className="text-cream-dim leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-lg overflow-hidden"
          >
            <motion.div
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
              transition={{ duration: 0.8, ease: 'easeOut' as const }}
              className="relative w-full"
            >
              <Image
                src={data.image}
                alt={data.heading}
                width={700}
                height={500}
                className="w-full h-auto object-cover rounded-lg"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
