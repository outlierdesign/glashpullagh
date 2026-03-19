'use client';

import { useEffect, useRef, useState } from 'react';
import { Gallery4 } from '@/components/blocks/gallery4';
import { HoverRevealGrid } from '@/components/blocks/hover-reveal-grid';
import ScrollExpandMedia from '@/components/blocks/scroll-expansion-hero';
import { PartnersSection } from '@/components/blocks/partners-section';
import { BentoGallery } from '@/components/blocks/bento-gallery';
import { ZoomParallax } from '@/components/ui/zoom-parallax';
import { ImageComparisonSlider } from '@/components/ui/image-comparison-slider';
import InteractiveMap from '@/components/blocks/interactive-map';
import { TabbedRestoration } from '@/components/blocks/tabbed-restoration';
import HoverRevealCards from '@/components/ui/cards';

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
        date={content.scrollHero?.date || "Glashpullagh Peatlands"}
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
            className="text-lg leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--cream-dim)' }}
          >
            {content.scrollHero?.paragraph2 || "Restoration works included reprofiling peat banks, installing dams, removing conifers, and stabilising bare peat. The site is now on a path to recovery — rewetting is slowing carbon loss, habitats are improving for wildlife, and peat-forming plants are returning. Recovery takes time, but at Glashapullagh, it has begun."}
          </p>
        </div>
      </ScrollExpandMedia>

      {/* 1. HERO SECTION */}
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

      {/* 2. OVERVIEW VIDEO */}
      {content.documentary && (
        <section className="documentary-section texture-overlay tex-tweed wash-peat">
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

      {/* 3. BENTO GRID */}
      <section className="bento-section texture-overlay tex-felt wash-green">
        <div className="container">
          <div className="bento-header">
            <p className="label">{content.bento?.label || 'Overview'}</p>
            <h2>{content.bento?.title || 'What We Do'}</h2>
            <div className="divider-line divider-line-center" />
          </div>
          <div className="bento-grid">
            {content.bento?.items?.map((item: any, idx: number) => (
              <div key={idx} className={`bento-card${item.image ? ' bento-card-has-image' : ''}`}
                style={item.image ? { backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
              >
                {item.image && <div className="bento-card-overlay" />}
                <div className="bento-card-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. GALLERY CAROUSEL */}
      <div style={{ background: 'var(--bg-deep)' }}>
        <Gallery4 />
      </div>

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
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(184,134,74,0.15)', aspectRatio: '16 / 9' }}>
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

      {/* 8. ABOUT */}
      <section className="about-site-section texture-overlay tex-brushed wash-heather" id="about">
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

      {/* 9. INTERACTIVE MAP */}
      {content.topoMap && (
        <InteractiveMap
          label={content.topoMap.label || 'Location'}
          title={content.topoMap.title || 'Site Map'}
          cmsMapImage={content.topoMap.mapImage || null}
        />
      )}

      {/* 10. VIDEO DOCUMENTATION */}
      {content.videos && (
        <section className="video-section texture-overlay tex-denim wash-water">
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

      {/* 11. RESTORATION TABS */}
      {content.restoration && (
        <TabbedRestoration
          label={content.restoration.label}
          title={content.restoration.title}
          items={content.restoration.items}
        />
      )}

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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <HoverRevealCards
                items={content.monitoring.items?.map((item: any, idx: number) => ({
                  id: idx,
                  title: item.title,
                  subtitle: item.description?.split('.')[0] || '',
                  imageUrl: item.image || '/images/site/peat-pool.jpg',
                })) || []}
                className="md:grid-cols-5"
              />
            </div>
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
                  color: 'var(--cream-dim)',
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
                    border: '1px solid rgba(184,134,74,0.15)',
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

      {/* SECTION: BENTO GALLERY */}
      <BentoGallery
        heading="Glashapullagh in Pictures"
        eyebrow="Visual Journey"
        images={[
          { src: '/images/site/Glashapullagh Restoration West Limerick1.jpg', alt: 'Aerial view of Glashapullagh peatland', caption: 'The vast blanket bog of Glashapullagh' },
          { src: '/images/site/dam-workers.jpg', alt: 'Workers installing a peat dam on the bog', caption: 'Installing peat dams to rewet the bog' },
          { src: '/images/site/peat-pool.jpg', alt: 'Still pool of water on restored peatland', caption: 'Rewetted peat pools supporting new life' },
          { src: '/images/site/Glashapullagh Restoration West Limerick5.jpg', alt: 'Restoration work across the peatland landscape', caption: 'Restoration in progress across the site' },
          { src: '/images/site/carrying-equipment.jpg', alt: 'Team carrying restoration equipment across the bog', caption: 'Carrying materials to remote restoration sites' },
          { src: '/images/site/Glashapullagh Restoration West Limerick12.jpg', alt: 'Close-up of peatland vegetation and mosses', caption: 'Sphagnum mosses returning to restored areas' },
          { src: '/images/site/plank-dam.jpg', alt: 'Timber plank dam blocking a drainage channel', caption: 'Timber dams blocking old drainage channels' },
          { src: '/images/site/landscape-figure.jpg', alt: 'Lone figure surveying the peatland landscape', caption: 'Surveying the scale of the restoration' },
          { src: '/images/site/Glashapullagh Restoration West Limerick16.jpg', alt: 'Peatland restoration site at golden hour', caption: 'Golden light over the restored bogland' },
          { src: '/images/site/bog-walker.jpg', alt: 'Walker crossing the blanket bog', caption: 'Navigating the terrain of the active bog' },
          { src: '/images/site/monitoring-post.jpg', alt: 'Environmental monitoring station on the bog', caption: 'Monitoring water levels and habitat recovery' },
          { src: '/images/site/dusk-silhouette.jpg', alt: 'Silhouette of workers at dusk on the peatland', caption: 'End of a day on the bog' },
        ]}
      />

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
    </>
  );
}
