'use client';

import React from 'react';

/**
 * Animated topographic contour lines background.
 * Renders slowly drifting SVG contour paths in muted peatland tones.
 */
export default function TopographicBackground() {
  return (
    <div className="topo-bg" aria-hidden="true">
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="topo-lines-group">
          {/* Contour layer 1 — earthy greens */}
          <path d="M-50,80 Q100,40 200,90 T400,70 T600,100 T850,60" stroke="#3B4E34" />
          <path d="M-30,130 Q120,95 250,140 T450,110 T650,150 T870,105" stroke="#3B4E34" />
          <path d="M-60,190 Q80,155 220,195 T430,175 T620,210 T840,170" stroke="#4A6340" />
          <path d="M-40,250 Q130,215 270,260 T480,230 T670,270 T860,225" stroke="#4A6340" />

          {/* Contour layer 2 — moss/teal tones */}
          <path d="M-20,310 Q150,275 300,320 T520,290 T700,340 T880,295" stroke="#4A8A8A" />
          <path d="M-50,370 Q110,335 260,375 T490,350 T680,395 T850,355" stroke="#4A8A8A" />
          <path d="M-30,420 Q140,390 280,430 T510,405 T710,450 T870,410" stroke="#3B6B6B" />

          {/* Contour layer 3 — warm amber undertones */}
          <path d="M-40,470 Q120,440 250,480 T470,455 T660,500 T850,460" stroke="#8A7A5A" />
          <path d="M-60,520 Q90,490 230,530 T450,510 T640,550 T830,515" stroke="#8A7A5A" />
          <path d="M-20,570 Q160,545 310,580 T530,555 T720,590 T880,555" stroke="#6B6040" />

          {/* Second wave — offset for density */}
          <path d="M-80,55 Q70,20 180,60 T380,40 T580,75 T830,35" stroke="#3B4E34" />
          <path d="M-70,160 Q60,125 200,165 T410,145 T600,180 T820,140" stroke="#4A6340" />
          <path d="M-40,280 Q110,245 250,285 T460,260 T650,300 T840,255" stroke="#3B6B6B" />
          <path d="M-60,345 Q100,310 240,350 T470,325 T670,370 T860,330" stroke="#4A8A8A" />
          <path d="M-30,445 Q130,415 270,455 T500,430 T690,475 T870,435" stroke="#6B6040" />
          <path d="M-50,545 Q100,515 250,555 T480,530 T680,570 T860,535" stroke="#8A7A5A" />
        </g>
      </svg>
    </div>
  );
}
