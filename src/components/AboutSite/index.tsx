'use client';

import { motion } from 'framer-motion';
import { staggerContainerVariants, scrollRevealVariants } from '@/lib/animations';
import { cn } from '@/lib/cn';
import Image from 'next/image';
import { AboutData } from '@/types';

interface AboutSiteProps {
  data: AboutData;
}

export function AboutSite({ data }: AboutSiteProps) {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Two-column layout */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Left column - Text */}
          <motion.div variants={scrollRevealVariants}>
            <h2 className="font-display text-4xl md:text-5xl text-cream mb-6">
              {data.heading}
            </h2>
            <p className="text-gold-light text-lg mb-8 font-body">
              {data.lead}
            </p>
            <div className="space-y-6">
              {data.bodyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-cream-dim leading-relaxed font-body"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Right column - Images */}
          <motion.div
            className="flex flex-col"
            variants={scrollRevealVariants}
          >
            {/* First image */}
            <div className="rounded-lg overflow-hidden mb-4">
              <Image
                src={data.images[0]}
                alt="About section image 1"
                width={500}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Second image with offset */}
            <div className="rounded-lg overflow-hidden -mt-12 ml-8">
              <Image
                src={data.images[1]}
                alt="About section image 2"
                width={500}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Condition cards grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {data.conditionCards.map((card, index) => (
            <motion.div
              key={index}
              className="bg-bg-card border border-gold/10 rounded-lg p-6"
              variants={scrollRevealVariants}
            >
              <h3 className="font-display text-lg text-gold mb-2">
                {card.title}
              </h3>
              <p className="text-cream-dim text-sm font-body">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
