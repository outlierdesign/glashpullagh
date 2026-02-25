'use client';

import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { VideoData } from '@/types';

interface VideoSectionProps {
  data: VideoData;
}

export function VideoSection({ data }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  return (
    <section ref={ref} id="video" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-display text-4xl text-cream mb-4">{data.heading}</h2>
          <p className="text-cream-dim max-w-2xl">{data.description}</p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative aspect-video rounded-lg overflow-hidden bg-bg-card group cursor-pointer"
          onClick={() => data.videoUrl && setIsPlaying(true)}
        >
          {/* Poster Image */}
          <Image
            src={data.posterImage}
            alt={data.heading}
            fill
            className="w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />

          {/* Play Button or Coming Soon Badge */}
          {data.videoUrl ? (
            <>
              {/* Play Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute inset-0 flex items-center justify-center"
                onClick={() => setIsPlaying(true)}
              >
                <div className="w-20 h-20 rounded-full bg-gold/90 hover:bg-gold flex items-center justify-center transition-colors duration-300 shadow-lg">
                  {/* Play Triangle Icon */}
                  <svg
                    className="w-8 h-8 text-bg-deep ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </motion.button>

              {/* Video Player Modal */}
              {isPlaying && (
                <div
                  className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                  onClick={() => setIsPlaying(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-11/12 h-5/6 max-w-4xl rounded-lg overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <iframe
                      src={data.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />

                    {/* Close Button */}
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="absolute top-4 right-4 w-10 h-10 bg-gold/90 rounded-full flex items-center justify-center text-bg-deep hover:bg-gold transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </motion.div>
                </div>
              )}
            </>
          ) : (
            /* Coming Soon Badge */
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gold/90 text-bg-deep px-8 py-4 rounded-lg font-display text-lg">
                Coming Soon
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
