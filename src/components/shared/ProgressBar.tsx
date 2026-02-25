'use client';

import { useScroll, useTransform, motion } from 'framer-motion';

export function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gold z-40 origin-left"
      style={{ scaleX }}
    />
  );
}
