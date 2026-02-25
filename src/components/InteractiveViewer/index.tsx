'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface InteractiveViewerData {
  heading: string;
  description: string;
  embedUrl: string;
  aspectRatio?: string;
}

interface InteractiveViewerProps {
  data: InteractiveViewerData;
}

export function InteractiveViewer({ data }: InteractiveViewerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  return (
    <section ref={ref} id="3d-viewer" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="font-ui text-xs uppercase tracking-[0.2em] text-gold">
              Interactive
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-4">
            {data.heading}
          </h2>
          <p className="text-cream-dim max-w-2xl text-lg leading-relaxed">
            {data.description}
          </p>
        </motion.div>

        {/* Embed Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-xl overflow-hidden border border-gold/20 bg-bg-card shadow-2xl shadow-black/30"
        >
          {/* Gold accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <div
            className="relative w-full"
            style={{ aspectRatio: data.aspectRatio || '16/9' }}
          >
            <iframe
              src={data.embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking; camera"
              allowFullScreen
              loading="lazy"
              title={data.heading}
            />
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </motion.div>

        {/* Interaction hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-4 text-center text-cream-dim/50 text-sm font-ui"
        >
          Click and drag to interact with the 3D model
        </motion.p>
      </div>
    </section>
  );
}
