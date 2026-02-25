'use client';

import { motion } from 'framer-motion';
import { scrollRevealVariants } from '@/lib/animations';
import Image from 'next/image';
import { FooterData } from '@/types';

interface FooterProps {
  data: FooterData;
}

export function Footer({ data }: FooterProps) {
  return (
    <footer id="footer" className="py-24 md:py-32 bg-bg-deep">
      {/* Closing section */}
      <motion.div
        className="text-center max-w-3xl mx-auto px-6 mb-12"
        variants={scrollRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Gold decorative line */}
        <div className="w-16 h-px bg-gold mx-auto mb-8" />

        {/* Closing heading */}
        <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
          {data.closingHeading}
        </h2>

        {/* Closing text */}
        <p className="text-cream-dim text-lg leading-relaxed font-body">
          {data.closingText}
        </p>
      </motion.div>

      {/* Footer separator */}
      <div className="h-px bg-gold/20 max-w-7xl mx-auto mb-8" />

      {/* Footer bar */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto px-6 py-8 gap-6"
        variants={scrollRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            src={data.logoUrl}
            alt="Glashapullagh logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
        </div>

        {/* Site name */}
        <div className="font-display text-cream text-center flex-grow sm:flex-grow-0">
          Glashapullagh
        </div>

        {/* Copyright */}
        <div className="font-ui text-xs text-text-dim">
          © 2026 All Rights Reserved
        </div>
      </motion.div>
    </footer>
  );
}
