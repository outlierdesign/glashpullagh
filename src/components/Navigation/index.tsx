'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/cn';

const navLinks = [
  { label: 'Story', href: '#story' },
  { label: 'About', href: '#about' },
  { label: 'Map', href: '#map' },
  { label: 'Restoration', href: '#restoration' },
  { label: 'Gallery', href: '#gallery' },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    if (typeof latest === 'number' && typeof previous === 'number') {
      if (latest > previous && latest > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    }
  });

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isHidden ? -64 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-30 h-16 bg-bg-deep/80 backdrop-blur-md border-b border-gold/10"
    >
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-display text-2xl text-gold tracking-wide"
        >
          Glashapullagh
        </motion.div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link, idx) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              className="relative text-cream-dim hover:text-cream font-ui text-sm uppercase tracking-[0.1em] transition-colors"
              onClick={handleNavClick}
            >
              {link.label}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gold"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden relative w-8 h-8 flex flex-col justify-center gap-1.5"
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 8 : 0 }}
            className="w-full h-0.5 bg-gold"
          />
          <motion.div
            animate={{ opacity: isMenuOpen ? 0 : 1 }}
            className="w-full h-0.5 bg-gold"
          />
          <motion.div
            animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -8 : 0 }}
            className="w-full h-0.5 bg-gold"
          />
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          'md:hidden absolute top-full left-0 right-0 bg-bg-dark/95 backdrop-blur-md border-b border-gold/10 overflow-hidden',
          isMenuOpen ? 'block' : 'hidden'
        )}
      >
        <div className="flex flex-col gap-0 p-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="text-cream-dim hover:text-gold font-ui text-sm uppercase tracking-[0.1em] py-3 px-4 transition-colors border-b border-gold/5 last:border-b-0"
            >
              {link.label}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}
