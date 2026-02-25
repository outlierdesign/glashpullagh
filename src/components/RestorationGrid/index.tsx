'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { RestorationSection } from '@/types';

interface RestorationGridProps {
  data: RestorationSection;
}

export function RestorationGrid({ data }: RestorationGridProps) {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  const toggleExpand = (actionNumber: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(actionNumber)) {
        newSet.delete(actionNumber);
      } else {
        newSet.add(actionNumber);
      }
      return newSet;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
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
    <section ref={ref} id="restoration" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-ui text-xs uppercase tracking-[0.2em] text-gold-light mb-4">
            Our Approach
          </p>
          <h2 className="font-display text-4xl text-cream mb-4">{data.heading}</h2>
          <p className="text-cream-dim max-w-2xl">{data.description}</p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.actions.map((action) => (
            <motion.div
              key={action.number}
              variants={itemVariants}
              className={cn(
                'bg-bg-card border border-gold/10 rounded-lg overflow-hidden group',
                action.gridSpan === 2 ? 'lg:col-span-2' : ''
              )}
            >
              {/* Image Area */}
              <div className="relative aspect-[16/10] overflow-hidden bg-bg-card">
                <Image
                  src={action.image}
                  alt={action.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent opacity-30" />

                {/* Number Badge */}
                <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gold/90 flex items-center justify-center text-bg-deep font-ui font-bold text-sm">
                  {action.number}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6">
                <h3 className="font-display text-xl text-cream mb-2">{action.title}</h3>
                <p className="text-cream-dim text-sm mb-4">{action.description}</p>

                {/* Technical Detail Toggle */}
                <button
                  onClick={() => toggleExpand(action.number)}
                  className="text-gold text-sm font-ui hover:text-gold-light transition-colors"
                >
                  {expandedCards.has(action.number) ? 'Technical Detail −' : 'Technical Detail +'}
                </button>

                {/* Expandable Technical Detail */}
                <AnimatePresence>
                  {expandedCards.has(action.number) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 border-t border-gold/10">
                        <p className="text-cream-dim/70 text-sm">{action.technicalDetail}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
