'use client';

import { useEffect, useRef, useState } from 'react';
import { Gallery4 } from '@/components/blocks/gallery4';
// PhotoBentoGallery removed — replaced by scroll sequence
import ElegantCarousel from '@/components/ui/elegant-carousel';
import { HoverRevealGrid } from '@/components/blocks/hover-reveal-grid';
import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';
import { PartnersSection } from '@/components/blocks/partners-section';
// BentoGallery removed — replaced by scroll sequence
import ImageSequenceScroll from '@/components/blocks/image-sequence-scroll';
import { ZoomParallax } from '@/components/ui/zoom-parallax';
import { ImageComparisonSlider } from '@/components/ui/image-comparison-slider';
import InteractiveMap from '@/components/blocks/interactive-map';
import { TabbedRestoration } from '@/components/blocks/tabbed-restoration';
import HoverRevealCards from '@/components/ui/cards';
import TechBentoCards from '@/components/ui/tech-bento-cards';
import CardModal from '@/components/ui/card-modal';
import TopographicBackground from '@/components/ui/topographic-bg';

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

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const [cardModal, setCardModal] = useState<{
    title: string; description: string; image: string; gallery?: string[]; icon?: React.ReactNode; variant?: string;
  } | null>(null);
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
        mediaType="video"
        mediaSrc={content.scrollHero?.videoUrl || "https://vimeo.com/1170727891/e60603a2b1"}
        bgImageSrc={content.scrollHero?.bgImage || "/images/site/hero-bg.jpg"}
        title={content.scrollHero?.title || "Restoring Nature"}
        titleLine1={content.scrollHero?.titleLine1}
        titleLine2={content.scrollHero?.titleLine2}
        date={content.scrollHero?.date || "Glashapullagh Peatlands"}
        scrollToExpand="Scroll to explore"
        textBlend
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
          >
            {content.scrollHero?.heading || "Reversing Decades of Drainage"}
          </h2>
          <p
            className="text-lg mb-8 leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--cream)' }}
          >
            {content.scrollHero?.paragraph1 || "The Glashapullagh site is a cutover blanket bog in West Limerick that had been historically drained, leading to severe peat compaction, the spread of scrub and rushes, and significant peat loss. A comprehensive Restoration Action Plan was developed using extensive drone and ground surveys, approved by the National Parks and Wildlife Service."}
          </p>
          <p
            className="text-lg mb-8 leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--cream-dim)' }}
          >
            {content.scrollHero?.paragraph2 || "Restoration works included reprofiling peat banks, installing dams, removing conifers, and stabilising bare peat. The site is now on a path to recovery — rewetting is slowing carbon loss, habitats are improving for wildlife, and peat-forming plants are returning. Recovery takes time, but at Glashapullagh, it has begun."}
          </p>
          {content.scrollHero?.paragraph3 && (
            <p
              className="text-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--cream-dim)' }}
            >
              {content.scrollHero.paragraph3}
            </p>
          )}
        </div>
      </ScrollExpandMedia>

      {/* 1. HERO SECTION */}
      <section className="hero">
        <canvas ref={heroCanvasRef} className="hero-canvas" />
        <div className="hero-content">
          <h1>{content.hero?.title || 'Glashapullagh'}</h1>
          <div className="hero-paragraphs">
            <p>{content.hero?.paragraph1 || ''}</p>
            <p>{content.hero?.paragraph2 || ''}</p>
            <p>{content.hero?.paragraph3 || ''}</p>
          </div>
          <button className="hero-cta" onClick={() => {
            if (content.documentary?.url) {
              openLightbox(content.documentary.url);
            } else {
              openLightbox('https://vimeo.com/1170727891/e60603a2b1');
            }
          }}>
            {content.hero?.ctaText || 'About the Project | Video'}
          </button>
        </div>
      </section>

      {/* 3. BENTO GRID — Watery Gradient Cards */}
      <section className="bento-section texture-overlay tex-felt wash-green">
        <div className="container-wide">
          <div className="bento-header">
            <p className="label">{content.bento?.label || 'Objectives'}</p>
            <h2>{content.bento?.title || 'What We Do'}</h2>
            <div className="divider-line divider-line-center" />
          </div>
          <div className="bento-grid">
            {(content.bento?.items || []).map((item: any, idx: number) => {
              const cardClasses = [
                'bento-card--habitats',
                'bento-card--peat',
                'bento-card--rewet',
                'bento-card--carbon',
                'bento-card--story',
                'bento-card--ahead',
              ];
              const icons = [
                /* Habitats — bird/droplet */ '<path d="M12 3c-1.5 6-6 7.5-6 12a6 6 0 0 0 12 0c0-4.5-4.5-6-6-12Z"/><path d="M12 21v-6"/><path d="M9.5 17.5 12 15l2.5 2.5"/>',
                /* Peat plants */ '<path d="M7 20h10"/><path d="M12 20V8"/><path d="M12 8c-2-2-5-2.5-5 1 0 2 3 3 5 1"/><path d="M12 8c2-2 5-2.5 5 1 0 2-3 3-5 1"/><path d="M12 13c-1.5-1.5-4-2-4 .5s2.5 2.5 4 1"/><path d="M12 13c1.5-1.5 4-2 4 .5s-2.5 2.5-4 1"/>',
                /* Rewet — water */ '<path d="M2 12h4l3-9 4 18 3-9h4"/><path d="M4 18c1-1 2-2 4-2s3 1 4 2 2 2 4 2 3-1 4-2"/>',
                /* Carbon — clock */ '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/><path d="M8.5 3.5 6 2"/><path d="M15.5 3.5 18 2"/>',
                /* Story — book */ '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h4"/>',
                /* Ahead — lightbulb */ '<path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.5 4.5-3 5.5V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.5C6.5 13.5 5 11.5 5 9a7 7 0 0 1 7-7Z"/><path d="M9 21h6"/><path d="M10 17v4"/><path d="M14 17v4"/>',
              ];
              return (
                <div
                  key={idx}
                  className={`bento-card ${cardClasses[idx] || ''}`}
                  onClick={() => setCardModal({
                    title: item.title,
                    description: item.description,
                    image: item.image || '',
                    icon: <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: icons[idx] || icons[0] }} />,
                    variant: 'card-modal--bento',
                  })}
                  style={{ cursor: 'pointer' }}
                >
                  {item.image && (
                    <div
                      className="bento-card-image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  )}
                  <div className="bento-card-icon">
                    <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: icons[idx] || icons[0] }} />
                  </div>
                  <div className="bento-card-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. RESTORATION IN FOCUS — Elegant Carousel */}
      <section style={{ background: 'var(--bg-deep)', padding: '5rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p className="label">{content.restorationInFocus?.label || 'Restoration in Focus'}</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--cream)',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            margin: '0.5rem 0 1rem',
          }}>{content.restorationInFocus?.title || 'Explore the Ongoing Work'}</h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-muted)',
            fontSize: '1rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}>{content.restorationInFocus?.description || 'From ecological surveys to community action — the restoration and protection of the Glashapullagh peatlands.'}</p>
          <div className="divider-line divider-line-center" style={{ marginTop: '1.5rem' }} />
        </div>
        <ElegantCarousel />
      </section>

      {/* 5. BEFORE/AFTER — Aerial Survey */}
      <section className="texture-overlay tex-speckled wash-amber" style={{ background: 'var(--bg-deep)', padding: '6rem 0' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="label">Aerial Survey</p>
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)', fontSize: '2.5rem', margin: '0.5rem 0 1rem' }}>
              Landscape Transformation
            </h2>
            <div className="divider-line divider-line-center" />
          </div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', aspectRatio: '16 / 9' }}>
            <ImageComparisonSlider
              leftImage="/images/site/orthophoto-before.jpg"
              rightImage="/images/site/orthophoto-after.jpg"
              altLeft="Glashapullagh aerial survey — before restoration"
              altRight="Glashapullagh aerial survey — after restoration"
              initialPosition={50}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', padding: '0 0.25rem' }}>
            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Before</span>
            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>After</span>
          </div>
        </div>
      </section>

      {/* 6. STATS */}
      {content.stats && (
        <section className="stats-section texture-overlay tex-speckled wash-moss">
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

      {/* 7. PARALLAX BREAK 1 */}
      {content.parallaxBreaks?.[0] && (
        <section className="parallax-break">
          <div className="parallax-content">
            <h2>{content.parallaxBreaks[0].title}</h2>
            <p>{content.parallaxBreaks[0].text}</p>
          </div>
        </section>
      )}

      {/* 9. INTERACTIVE SITE */}
      <section className="interactive-site-section texture-overlay tex-felt wash-green" id="interactive-site">
        <div className="container">
          <div className="interactive-site-header">
            <p className="label">Explore</p>
            <h2>Interactive Site</h2>
            <div className="divider-line divider-line-center" />
            <p className="interactive-site-desc">Explore the Glashapullagh restoration site in 3D. Navigate the landscape, discover restoration techniques, and see the work up close.</p>
          </div>
          <div className="interactive-site-embed">
            <iframe
              src="/viewer/"
              title="Interactive Glashapullagh Site"
              allow="accelerometer; gyroscope; xr-spatial-tracking; autoplay; fullscreen"
              allowFullScreen
            />
          </div>
          <div className="interactive-site-footer">
            <a href="/interactive-site" className="hero-cta" style={{ textDecoration: 'none' }}>
              Open Full Experience
            </a>
          </div>
        </div>
      </section>

      {/* 10. VIDEO DOCUMENTATION — Featured Hero + Bento Grid */}
      {content.videos && (() => {
        const videos = content.videos.items || [];
        const featured = videos[0];
        const rest = videos.slice(1);
        // Bento span patterns for visual variety (applied cyclically)
        const bentoPatterns = [
          { col: 'span 4', row: 'span 1' },
          { col: 'span 4', row: 'span 1' },
          { col: 'span 4', row: 'span 1' },
          { col: 'span 6', row: 'span 1' },
          { col: 'span 6', row: 'span 1' },
          { col: 'span 4', row: 'span 1' },
          { col: 'span 4', row: 'span 1' },
          { col: 'span 4', row: 'span 1' },
          { col: 'span 6', row: 'span 1' },
          { col: 'span 6', row: 'span 1' },
        ];
        return (
          <section className="video-section texture-overlay tex-denim wash-water">
            <TopographicBackground />
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
              <div className="video-header">
                <p className="label">{content.videos.label || 'Media'}</p>
                <h2>{content.videos.title || 'Video Content'}</h2>
                <div className="divider-line divider-line-center" />
              </div>

              {/* Featured hero video */}
              {featured && (
                <div
                  className="video-featured"
                  onClick={() => openLightbox(featured.url)}
                >
                  <div className="video-featured-thumb">
                    <img src={featured.thumbnail} alt={featured.title} />
                    <div className="video-featured-overlay">
                      <div className="video-play-icon video-play-icon-lg" />
                    </div>
                  </div>
                  <div className="video-featured-info">
                    <span className="video-featured-badge">Featured</span>
                    <h3>{featured.title}</h3>
                    <p>{featured.description}</p>
                  </div>
                </div>
              )}

              {/* Bento grid for remaining videos */}
              <div className="video-bento-grid">
                {rest.map((video: any, idx: number) => {
                  const pattern = bentoPatterns[idx % bentoPatterns.length];
                  return (
                    <div
                      key={idx}
                      className="video-bento-card"
                      style={{ gridColumn: pattern.col }}
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
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 11. RESTORATION TABS — removed from page, retained as template
      {content.restoration && (
        <TabbedRestoration
          label={content.restoration.label}
          title={content.restoration.title}
          items={content.restoration.items}
        />
      )}
      */}

      {/* 12. PARALLAX BREAK 2 — Recovery Takes Time */}
      {content.parallaxBreaks?.[1] && (
        <section style={{
          position: 'relative',
          height: '70vh',
          minHeight: '450px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            inset: '-20% 0',
            backgroundImage: 'url(/images/site/Glashapullagh Restoration West Limerick1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(26,46,28,0.78) 0%, rgba(14,11,9,0.7) 100%)',
          }} />
          <div className="parallax-content" style={{ position: 'relative', zIndex: 2 }}>
            <h2>{content.parallaxBreaks[1].title}</h2>
            <p>{content.parallaxBreaks[1].text}</p>
          </div>
        </section>
      )}

      {/* 13. SLOWING THE FLOW OF WATER */}
      {content.monitoring && (
        <section id="techniques" className="texture-overlay tex-concrete wash-deep" style={{ background: 'var(--bg-deep)', padding: '6rem 0' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p className="label">{content.monitoring.label || 'Techniques'}</p>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', margin: '0.5rem 0 1rem' }}>{content.monitoring.title || 'Slowing The Flow Of Water'}</h2>
              <div className="divider-line divider-line-center" />
            </div>
            <TechBentoCards
              items={content.monitoring.items || []}
              onCardClick={(item) => setCardModal({
                title: item.title,
                description: item.description,
                image: item.image,
                gallery: item.gallery,
                variant: 'card-modal--tech',
              })}
            />
          </div>
        </section>
      )}

      {/* 14. WHY LARCH */}
      {content.whyLarch && (
        <section style={{
          padding: '5rem 2rem',
          background: 'var(--bg-card)',
        }}>
          <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p className="label">{content.whyLarch.label || 'Materials'}</p>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--cream)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                marginBottom: '1rem',
              }}>{content.whyLarch.title || 'Why Larch'}</h2>
              <div className="divider-line divider-line-center" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {content.whyLarch.paragraphs?.map((para: string, idx: number) => (
                <p key={idx} style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text-secondary)',
                  fontSize: '1.05rem',
                  lineHeight: '1.8',
                }}>{para}</p>
              ))}
            </div>
            {content.whyLarch.images && content.whyLarch.images.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginTop: '2.5rem',
              }}>
                {content.whyLarch.images.map((img: any, idx: number) => (
                  <div key={idx} style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                  }}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      padding: '0.75rem 1rem',
                      textAlign: 'center',
                    }}>{img.alt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION: ZOOM PARALLAX */}
      <ZoomParallax
        images={[
          { src: '/images/site/parallax-walkers.jpg', alt: 'Workers walking across the restored peatland' },
          { src: '/images/site/parallax-lichen.jpg', alt: 'Macro detail of lichen and moss on peat' },
          { src: '/images/site/parallax-peat-hag.jpg', alt: 'Peat hag with lone spruce under moody sky' },
          { src: '/images/site/parallax-dam-site.jpg', alt: 'Two people at dam installation site' },
          { src: '/images/site/parallax-bog-grass.jpg', alt: 'Soft focus bog grass against moody sky' },
          { src: '/images/site/parallax-peat-bank.jpg', alt: 'Exposed peat bank close-up' },
          { src: '/images/site/parallax-bog-trail.jpg', alt: 'Two people walking across the bog' },
        ]}
      />

      {/* SECTION: HOVER REVEAL GRID */}
      <div style={{ background: 'var(--bg-dark)' }}>
        <HoverRevealGrid />
      </div>

      {/* SECTION: SCROLL-DRIVEN IMAGE SEQUENCE — Geotextile Animation */}
      <ImageSequenceScroll
        videoSrc="/sequence/geotextile.mp4"
        scrollDistance={4}
        eyebrow="Geotextile Restoration"
        overlays={[
          {
            text: 'It Has Begun.',
            startAt: 0.15,
            endAt: 0.45,
            className: 'seq-overlay--center',
          },
          {
            text: 'Protecting bare peat with geotextile fabric — stabilising the surface and encouraging natural regrowth.',
            startAt: 0.55,
            endAt: 0.85,
            className: 'seq-overlay--subtitle',
          },
        ]}
      />

      {/* BENTO GALLERY — removed, replaced by geotextile scroll sequence above */}

      {/* PARTNERS & FUNDERS */}
      <PartnersSection />

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
          {lightboxSrc.includes('youtube.com') || lightboxSrc.includes('vimeo.com') || lightboxSrc.includes('player.vimeo.com') ? (
            <iframe
              className="lightbox-iframe"
              src={(() => {
                // Convert vimeo.com/ID/HASH → player.vimeo.com embed URL
                if (lightboxSrc.includes('vimeo.com') && !lightboxSrc.includes('player.vimeo.com')) {
                  const match = lightboxSrc.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/);
                  if (match) {
                    const id = match[1];
                    const hash = match[2];
                    return `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ''}`;
                  }
                }
                return lightboxSrc;
              })()}
              title="Video"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img src={lightboxSrc} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          )}
        </div>
      </div>

      {/* CARD DETAIL MODAL */}
      {cardModal && (
        <CardModal
          isOpen={true}
          onClose={() => setCardModal(null)}
          title={cardModal.title}
          description={cardModal.description}
          image={cardModal.image}
          gallery={cardModal.gallery}
          icon={cardModal.icon}
          variant={cardModal.variant}
        />
      )}
    </>
  );
}
