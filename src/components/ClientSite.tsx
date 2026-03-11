'use client';

import { useEffect, useRef, useState } from 'react';
import { Gallery4 } from '@/components/blocks/gallery4';
import { HoverRevealGrid } from '@/components/blocks/hover-reveal-grid';
import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';

interface ClientSiteProps {
  content: Record<string, any>;
}

interface LenisType {
  raf: (time: number) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    gsap?: any;
    ScrollTrigger?: any;
    Lenis?: any;
  }
}

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
};

export default function ClientSite({ content }: ClientSiteProps) {
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const beforeAfterRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const lenis = useRef<LenisType | null>(null);

  // Water ripple effect for hero canvas
  const initWaterRipple = () => {
    if (!heroCanvasRef.current) return;

    const canvas = heroCanvasRef.current;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Vertex shader
    const vsSource = `
      #version 300 es
      precision highp float;

      in vec3 position;
      in vec2 texCoord;

      out vec2 vTexCoord;

      void main() {
        gl_Position = vec4(position, 1.0);
        vTexCoord = texCoord;
      }
    `;

    // Fragment shader with water ripple effect
    const fsSource = `
      #version 300 es
      precision highp float;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform sampler2D uTexture;

      in vec2 vTexCoord;
      out vec4 outColor;

      float simplex(vec2 v){
        const vec2  C = vec2(0.211324865405187, 0.366025403784439);
        vec2  i  = floor(v + dot(v, C.yy) );
        vec2  x0 = v -   i + dot(i, C.xx);
        vec2  i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec2  x1 = x0.xy + C.xx -        i1;
        vec2  x2 = x0.xy + C.zz;
        i  = mod(i, 289.0);
        vec3  p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3  m = max(0.5 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
        m = m*m;
        m = m*m;
        vec3  x = fract(p * 0.024390243902439) * 2.0 - 1.0;
        vec3  y = abs(x) - 0.5;
        vec3  b = step(y, vec3(0.0));
        x = mix(x, y, b);
        return dot(m, sin(acos(x)));
      }

      float permute(float x) {
        return mod((34.0*x+1.0)*x, 289.0);
      }

      void main() {
        vec2 uv = vTexCoord;
        float time = uTime * 0.5;

        // Create ripple effect
        float wave1 = sin(length(uv - 0.5) * 10.0 - time) * 0.01;
        float wave2 = sin(length(uv - 0.5) * 8.0 - time * 0.7) * 0.008;
        float noise = simplex(uv * 3.0 + time * 0.3) * 0.03;

        vec2 distortion = vec2(wave1 + wave2 + noise);
        vec2 distortedUv = uv + distortion;

        vec4 texColor = texture(uTexture, distortedUv);

        // Add subtle glow at the edges
        float vignette = smoothstep(0.8, 0.3, length(uv - 0.5));
        vec3 glowColor = vec3(0.196, 0.141, 0.061) * vignette * 0.3;

        outColor = vec4(texColor.rgb + glowColor, texColor.a);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);

      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Create position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, 1.0, 0.0,
      1.0, 1.0, 0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttrib = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttrib);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 12, 0);

    // Create texture coordinate buffer
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    const texCoords = [0, 1, 1, 1, 0, 0, 1, 0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

    const texCoordAttrib = gl.getAttribLocation(program, 'texCoord');
    gl.enableVertexAttribArray(texCoordAttrib);
    gl.vertexAttribPointer(texCoordAttrib, 2, gl.FLOAT, false, 8, 0);

    // Get uniform locations
    const timeUniform = gl.getUniformLocation(program, 'uTime');
    const resolutionUniform = gl.getUniformLocation(program, 'uResolution');

    // Animation loop
    let startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      gl!.uniform1f(timeUniform, elapsed);
      gl!.uniform2f(resolutionUniform, canvas.width, canvas.height);

      gl!.clearColor(0.031, 0.024, 0.016, 1.0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(animate);
    };

    animate();
  };

  // Before/After slider functionality
  const initBeforeAfter = () => {
    if (!beforeAfterRef.current) return;

    const wrapper = beforeAfterRef.current;
    const afterImage = wrapper.querySelector('.after-image') as HTMLImageElement;
    const handle = wrapper.querySelector('.before-after-handle') as HTMLDivElement;

    if (!afterImage || !handle) return;

    const updatePosition = (e: MouseEvent | TouchEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const x = (e instanceof TouchEvent ? e.touches[0].clientX : e.clientX) - rect.left;
      const percent = Math.max(0, Math.min(x / rect.width, 1));

      afterImage.style.clipPath = `inset(0 ${(1 - percent) * 100}% 0 0)`;
      handle.style.left = `${percent * 100}%`;
    };

    const onMouseDown = () => {
      document.addEventListener('mousemove', updatePosition);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', updatePosition);
      });
    };

    const onTouchStart = () => {
      document.addEventListener('touchmove', updatePosition);
      document.addEventListener('touchend', () => {
        document.removeEventListener('touchmove', updatePosition);
      });
    };

    handle.addEventListener('mousedown', onMouseDown);
    handle.addEventListener('touchstart', onTouchStart);
  };

  // GSAP animations initialization
  const initAnimations = async () => {
    if (!window.gsap || !window.ScrollTrigger) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    // Hero title animation
    gsap.fromTo(
      '.hero h1',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    gsap.fromTo(
      '.hero .lead',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 }
    );

    gsap.fromTo(
      '.hero-cta',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out', delay: 0.6 }
    );

    // Bento cards stagger animation
    const bentoCards = document.querySelectorAll('.bento-card');
    bentoCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            once: true,
          },
        }
      );
    });

    // Parallax effect
    const parallaxElements = document.querySelectorAll('.parallax-content');
    parallaxElements.forEach((el) => {
      gsap.to(el, {
        y: -50,
        scrollTrigger: {
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
          markers: false,
        },
      });
    });

    // Restoration cards animation
    const restorationCards = document.querySelectorAll('.restoration-card');
    restorationCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            once: true,
          },
        }
      );
    });

    // Stats counter animation
    const statItems = document.querySelectorAll('.stat-item h3');
    statItems.forEach((stat) => {
      gsap.fromTo(
        stat,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stat,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });

    // Video cards animation
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            once: true,
          },
        }
      );
    });

    // Gallery items stagger
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out',
          delay: index * 0.05,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });
  };

  // Lenis smooth scroll initialization
  const initLenis = async () => {
    if (!window.Lenis) return;

    const Lenis = window.Lenis;
    const lenis = new Lenis();

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
    lenis.ref = lenis;
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
        await loadScript('https://unpkg.com/lenis@1.1.13/dist/lenis.min.js');

        initWaterRipple();
        initBeforeAfter();
        initAnimations();
        initLenis();
      } catch (error) {
        console.error('Failed to initialize animations:', error);
      }
    };

    init();
  }, []);

  const openLightbox = (src: string) => {
    setLightboxSrc(src);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      {/* SCROLL EXPANSION HERO — TOP OF PAGE */}
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1920&auto=format&fit=crop"
        bgImageSrc="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop"
        title="Restoring Nature"
        date="Glashpullagh Peatlands"
        scrollToExpand="Scroll to explore"
        textBlend
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
          >
            A Living Landscape
          </h2>
          <p
            className="text-lg mb-8 leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--cream)' }}
          >
            The Glashpullagh peatlands represent one of Ireland&apos;s most significant ecological restoration projects. Through careful rewetting, drain blocking, and community engagement, we are working to restore this ancient landscape to its natural function — storing carbon, filtering water, and supporting biodiversity for generations to come.
          </p>
          <p
            className="text-lg leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--cream-dim)' }}
          >
            Every hectare of restored peatland captures an estimated 0.7 tonnes of CO₂ per year. With over 200 hectares under active management, the Glashpullagh project is making a measurable contribution to Ireland&apos;s climate goals while preserving a landscape of deep cultural and ecological significance.
          </p>
        </div>
      </ScrollExpandMedia>

      {/* HERO SECTION */}
      <section className="hero">
        <canvas ref={heroCanvasRef} className="hero-canvas" />
        <div className="hero-content">
          <h1>{content.hero?.title || 'Glashapullagh'}</h1>
          <p className="lead">{content.hero?.subtitle || 'Peatland restoration in West Limerick'}</p>
          <button className="hero-cta" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore the Project
          </button>
        </div>
      </section>

      {/* BENTO GRID SECTION */}
      <section className="bento-section">
        <div className="container">
          <div className="bento-header">
            <p className="label">{content.bento?.label || 'Overview'}</p>
            <h2>{content.bento?.title || 'What We Do'}</h2>
            <div className="divider-line divider-line-center" />
          </div>
          <div className="bento-grid">
            {content.bento?.items?.map((item: any, idx: number) => (
              <div key={idx} className="bento-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER SECTION */}
      {content.beforeAfter && (
        <section className="before-after-section">
          <div className="container">
            <div className="before-after-container">
              <h2>{content.beforeAfter.title}</h2>
              <div className="divider-line" />
              <div className="before-after-wrapper" ref={beforeAfterRef}>
                <div className="before-after-comparison">
                  <img
                    src={content.beforeAfter.beforeImage}
                    alt="Before"
                    className="before-image"
                  />
                  <img
                    src={content.beforeAfter.afterImage}
                    alt="After"
                    className="after-image"
                  />
                  <div className="before-after-handle" />
                  <span className="before-label">Before</span>
                  <span className="after-label">After</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STATS SECTION */}
      {content.stats && (
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {content.stats.items?.map((stat: any, idx: number) => (
                <div key={idx} className="stat-item">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PARALLAX BREAK 1 */}
      {content.parallaxBreaks?.[0] && (
        <section className="parallax-break">
          <div className="parallax-content">
            <h2>{content.parallaxBreaks[0].title}</h2>
            <p>{content.parallaxBreaks[0].text}</p>
          </div>
        </section>
      )}

      {/* ABOUT SITE SECTION */}
      <section className="about-site-section" id="about">
        <div className="container">
          <div className="about-site-container">
            <div className="about-site-content">
              <p className="label">{content.about?.label || 'About'}</p>
              <h2>{content.about?.title || 'The Site'}</h2>
              <div className="divider-line" />
              {content.about?.paragraphs?.map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
            {content.about?.image && (
              <div className="about-site-image">
                <img src={content.about.image} alt="About the site" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TOPO MAP SECTION */}
      {content.topoMap && (
        <section className="topo-map-section">
          <div className="container">
            <div className="topo-map-container">
              <div className="topo-map-header">
                <p className="label">{content.topoMap.label || 'Map'}</p>
                <h2>{content.topoMap.title || 'Topographical Map'}</h2>
                <div className="divider-line divider-line-center" />
              </div>
              <div className="topo-map-wrapper">
                <svg className="topo-map-svg" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                  {/* Base map background */}
                  <defs>
                    <linearGradient id="terrainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'var(--green-deep)', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: 'var(--bg-card)', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <rect width="800" height="600" fill="var(--bg-card)" />
                  <path d="M50,300 Q200,200 400,300 T800,300 L800,600 L0,600 Z" fill="url(#terrainGradient)" opacity="0.7" />
                  {/* Contour lines */}
                  <path d="M100,250 Q200,240 300,250 Q400,260 500,250" stroke="var(--gold-dim)" strokeWidth="2" fill="none" opacity="0.5" />
                  <path d="M80,350 Q250,340 450,350 Q600,360 750,350" stroke="var(--gold-dim)" strokeWidth="2" fill="none" opacity="0.5" />
                  {/* Markers */}
                  <circle cx="400" cy="300" r="8" fill="var(--gold)" />
                  <text x="420" y="310" fill="var(--gold)" fontSize="14" fontFamily="var(--font-ui)">
                    Main Site
                  </text>
                </svg>
              </div>
              <div className="topo-map-legend">
                <div className="legend-item">
                  <div className="legend-color" style={{ background: 'var(--green-deep)' }} />
                  <span>Elevated</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: 'var(--water)' }} />
                  <span>Water</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ background: 'var(--gold-dim)' }} />
                  <span>Contours</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* RESTORATION GRID SECTION */}
      {content.restoration && (
        <section className="restoration-section">
          <div className="container">
            <div className="restoration-header">
              <p className="label">{content.restoration.label || 'Process'}</p>
              <h2>{content.restoration.title || 'Restoration Methods'}</h2>
              <div className="divider-line divider-line-center" />
            </div>
            <div className="restoration-grid">
              {content.restoration.items?.map((item: any, idx: number) => (
                <div key={idx} className="restoration-card">
                  {item.image && <img src={item.image} alt={item.title} className="restoration-image" />}
                  <div className="restoration-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PARALLAX BREAK 2 */}
      {content.parallaxBreaks?.[1] && (
        <section className="parallax-break">
          <div className="parallax-content">
            <h2>{content.parallaxBreaks[1].title}</h2>
            <p>{content.parallaxBreaks[1].text}</p>
          </div>
        </section>
      )}


      {/* VIDEO GRID SECTION */}
      {content.videos && (
        <section className="video-section">
          <div className="container">
            <div className="video-header">
              <p className="label">{content.videos.label || 'Media'}</p>
              <h2>{content.videos.title || 'Video Content'}</h2>
              <div className="divider-line divider-line-center" />
            </div>
            <div className="video-grid">
              {content.videos.items?.map((video: any, idx: number) => (
                <div
                  key={idx}
                  className="video-card"
                  onClick={() => openLightbox(video.url)}
                >
                  <div className="video-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    <div className="video-play-icon" />
                  </div>
                  <div className="video-content">
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DOCUMENTARY SECTION */}
      {content.documentary && (
        <section className="documentary-section">
          <div className="container">
            <div className="documentary-container">
              <div className="documentary-header">
                <p className="label">{content.documentary.label || 'Featured'}</p>
                <h2>{content.documentary.title || 'Full Documentary'}</h2>
                <div className="divider-line divider-line-center" />
              </div>
              <div className="documentary-wrapper">
                <iframe
                  className="documentary-iframe"
                  src={content.documentary.url}
                  title="Documentary"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      )}


      {/* SECTION: GALLERY CAROUSEL */}
      <div style={{ background: 'var(--bg-deep)' }}>
        <Gallery4 />
      </div>

      {/* SECTION: HOVER REVEAL GRID */}
      <div style={{ background: 'var(--bg-dark)' }}>
        <HoverRevealGrid />
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            {content.footer?.sections?.map((section: any, idx: number) => (
              <div key={idx} className="footer-section">
                <h4>{section.title}</h4>
                <ul>
                  {section.links?.map((link: any, linkIdx: number) => (
                    <li key={linkIdx}>
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <p>{content.footer?.copyright || '© 2026 Glashapullagh. All rights reserved.'}</p>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX */}
      <div className={`lightbox-overlay ${lightboxOpen ? 'active' : ''}`} onClick={closeLightbox}>
        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
          <button className="lightbox-close" onClick={closeLightbox}>
            ✕
          </button>
          {lightboxSrc.includes('youtube.com') || lightboxSrc.includes('vimeo.com') ? (
            <iframe
              className="lightbox-iframe"
              src={lightboxSrc}
              title="Video"
              allowFullScreen
            />
          ) : (
            <img src={lightboxSrc} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          )}
        </div>
      </div>
    </>
  );
}
