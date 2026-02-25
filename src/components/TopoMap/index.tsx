'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/cn';
import { MapPOI } from '@/types';

interface TopoMapProps {
  pois: MapPOI[];
}

export function TopoMap({ pois }: TopoMapProps) {
  const [activePOI, setActivePOI] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  const handlePOIClick = (poi: MapPOI, event: React.MouseEvent) => {
    if (activePOI === poi.id) {
      setActivePOI(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setActivePOI(poi.id);
      setTooltipPos({
        x: rect.left,
        y: rect.top,
      });
    }
  };

  const handleClickOutside = () => {
    setActivePOI(null);
  };

  return (
    <section ref={ref} id="map" className="py-24 md:py-32 bg-bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-ui text-xs uppercase tracking-[0.2em] text-gold-light mb-4">
            Site Overview
          </p>
          <h2 className="font-display text-4xl text-cream mb-4">Restoration Map</h2>
          <p className="text-cream-dim max-w-2xl">
            Explore the topography of our restoration site and discover key points of interest where
            active monitoring and intervention work takes place.
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div
            className="relative rounded-lg overflow-hidden bg-bg-card border border-gold/10"
            onClick={handleClickOutside}
          >
            {/* SVG Topographic Map */}
            <svg
              viewBox="0 0 1000 620"
              className="w-full h-auto block"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Grid Pattern */}
                <pattern
                  id="gridPattern"
                  x="0"
                  y="0"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="50" height="50" fill="none" />
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#6b7b5e" strokeWidth="0.5" opacity="0.04" />
                </pattern>

                {/* Bog Fill Gradient */}
                <radialGradient id="bogFill" cx="40%" cy="40%">
                  <stop offset="0%" stopColor="#1a2e1c" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1a2e1c" stopOpacity="0" />
                </radialGradient>

                {/* Water Gradient */}
                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4a6b82" />
                  <stop offset="100%" stopColor="#7a9db5" />
                </linearGradient>

                {/* Forest Pattern */}
                <pattern id="forestPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="2" fill="#6b7b5e" opacity="0.3" />
                  <circle cx="15" cy="12" r="1.5" fill="#6b7b5e" opacity="0.3" />
                  <circle cx="8" cy="16" r="1.8" fill="#6b7b5e" opacity="0.3" />
                </pattern>
              </defs>

              {/* Background Grid */}
              <rect width="1000" height="620" fill="url(#gridPattern)" />

              {/* Forest Patches */}
              <path
                d="M720,40 C780,50 850,80 900,130 C940,170 960,240 950,300 L1000,300 L1000,0 L720,0 Z"
                fill="url(#forestPattern)"
                opacity="0.3"
              />
              <path
                d="M0,350 C30,280 60,220 100,180 C140,140 100,100 60,60 L0,60 Z"
                fill="url(#forestPattern)"
                opacity="0.3"
              />
              <path d="M300,600 C400,590 500,600 620,610 L620,620 L300,620 Z" fill="url(#forestPattern)" opacity="0.3" />

              {/* Central Bog Area */}
              <path
                d="M180,120 C280,80 420,70 560,90 C700,110 800,160 840,240 C870,310 850,400 800,460 C740,530 620,560 480,550 C340,540 220,500 160,430 C100,360 110,280 130,210 C145,160 160,135 180,120 Z"
                fill="url(#bogFill)"
              />

              {/* Contour Lines - 6 concentric circles */}
              <path
                d="M160,140 C270,90 430,75 570,95 C710,115 810,170 850,250 C880,325 860,410 810,470 C750,540 630,570 490,560 C350,550 230,510 170,440 C110,370 120,290 140,220 C155,170 155,150 160,140 Z"
                fill="none"
                stroke="#6b7b5e"
                strokeWidth="1"
                opacity="0.1"
              />
              <path
                d="M200,170 C300,125 420,110 550,125 C680,140 770,190 810,265 C840,330 825,400 780,450 C720,510 610,535 485,528 C360,520 255,488 200,425 C145,362 150,295 168,235 C180,195 192,178 200,170 Z"
                fill="none"
                stroke="#6b7b5e"
                strokeWidth="1.1"
                opacity="0.15"
              />
              <path
                d="M240,200 C330,160 430,148 535,158 C640,168 730,190 810,265 C840,330 825,400 780,450 C720,510 610,535 485,528 C360,520 255,488 200,425 C145,362 150,295 168,235 C180,195 192,178 200,170 Z"
                fill="none"
                stroke="#6b7b5e"
                strokeWidth="1.2"
                opacity="0.2"
              />
              <path
                d="M280,235 C360,200 430,148 535,158 C640,168 730,210 765,275 C795,335 782,390 748,432 C700,485 600,508 488,502 C376,496 285,468 238,412 C191,356 190,305 202,255 C212,220 228,208 240,200 Z"
                fill="none"
                stroke="#6b7b5e"
                strokeWidth="1.3"
                opacity="0.24"
              />
              <path
                d="M320,270 C390,242 440,190 530,198 C620,206 700,238 730,295 C755,345 742,390 715,420 C675,462 585,480 490,476 C395,472 315,450 280,400 C245,350 248,310 258,270 C265,248 272,240 280,235 Z"
                fill="none"
                stroke="#6b7b5e"
                strokeWidth="1.4"
                opacity="0.28"
              />
              <path
                d="M370,305 C420,285 470,234 520,285 C570,290 620,308 640,340 C658,370 648,395 630,412 C605,435 555,442 500,440 C445,438 400,422 378,395 C356,368 360,342 366,320 C369,310 370,307 370,305 Z"
                fill="none"
                stroke="#6b7b5e"
                strokeWidth="1.6"
                opacity="0.32"
              />

              {/* Drainage Lines */}
              <path
                d="M490,350 C470,380 445,420 430,460 C418,495 410,530 405,570"
                fill="none"
                stroke="url(#waterGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M510,345 C540,375 570,405 610,440 C640,465 680,490 730,510"
                fill="none"
                stroke="url(#waterGrad)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M480,330 C440,310 390,290 340,275 C290,260 240,250 190,248"
                fill="none"
                stroke="url(#waterGrad)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M505,340 C520,310 540,275 550,240 C558,210 560,180 558,145"
                fill="none"
                stroke="url(#waterGrad)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            {/* POI Markers - Outside SVG using absolute positioning */}
            <div className="absolute inset-0 pointer-events-none">
              {pois.map((poi) => (
                <div
                  key={poi.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
                >
                  {/* Pulse Animation */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full animate-ping',
                      poi.color === 'gold' ? 'bg-gold/40' : 'bg-water/40'
                    )}
                    style={{ width: '24px', height: '24px', left: '-12px', top: '-12px' }}
                  />

                  {/* POI Circle Button */}
                  <button
                    onClick={(e) => handlePOIClick(poi, e)}
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-ui font-bold border-2 transition-all duration-300 hover:scale-110',
                      poi.color === 'gold'
                        ? 'bg-gold/80 text-bg-deep border-gold hover:bg-gold'
                        : 'bg-water/80 text-cream border-water-light hover:bg-water'
                    )}
                  >
                    {poi.label}
                  </button>
                </div>
              ))}
            </div>

            {/* Tooltip */}
            <AnimatePresence>
              {activePOI && (
                <div className="absolute inset-0 pointer-events-none">
                  {pois
                    .filter((p) => p.id === activePOI)
                    .map((poi) => (
                      <motion.div
                        key={poi.id}
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute transform -translate-x-1/2 -translate-y-full -top-2 pointer-events-auto"
                        style={{ left: `${poi.x}%` }}
                      >
                        <div className="bg-bg-elevated border border-gold/20 rounded-lg p-4 shadow-xl whitespace-nowrap mb-2">
                          <h3 className="font-display text-gold mb-1">{poi.title}</h3>
                          <p className="text-cream-dim text-sm">{poi.description}</p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
