'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Restoration', href: '/#restoration' },
    { label: 'Techniques', href: '/#techniques' },
    { label: 'Bog Diaries', href: '/blog' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        padding: scrolled ? '0.6rem 2rem' : '1rem 2rem',
        background: scrolled ? 'rgba(14,11,9,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(200,169,100,0.12)' : '1px solid transparent',
        transition: 'all 0.4s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.3rem',
          fontWeight: 300,
          color: 'var(--cream)',
          textDecoration: 'none',
          letterSpacing: '0.02em',
        }}
      >
        Glashapullagh
      </Link>

      {/* Desktop links */}
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
        }}
        className="nav-desktop"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'var(--cream-dim)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--cream-dim)')}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
        }}
      >
        <div style={{
          width: '24px',
          height: '2px',
          background: 'var(--cream)',
          transition: 'all 0.3s ease',
          transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none',
        }} />
        <div style={{
          width: '24px',
          height: '2px',
          background: 'var(--cream)',
          margin: '6px 0',
          transition: 'all 0.3s ease',
          opacity: menuOpen ? 0 : 1,
        }} />
        <div style={{
          width: '24px',
          height: '2px',
          background: 'var(--cream)',
          transition: 'all 0.3s ease',
          transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none',
        }} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(14,11,9,0.98)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(200,169,100,0.12)',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: 'var(--cream-dim)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
