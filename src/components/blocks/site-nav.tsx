'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const techniqueLinks = [
  { label: 'Overview', href: '/overview' },
  { label: 'Timber Dams', href: '/timber-dams' },
  { label: 'Stone Dams', href: '/stone-dams' },
  { label: 'Peat Plugs', href: '/peat-plugs' },
  { label: 'Composite Wood-Peat Dams', href: '/composite-wood-peat-dams' },
  { label: 'Coir Logs', href: '/coir-logs' },
  { label: 'Geotextiles', href: '/geotextiles' },
  { label: 'Removing Conifers', href: '/removing-conifers' },
  { label: 'Reprofiling Peat Banks', href: '/reprofiling-peat-banks' },
  { label: 'Logistics & Safety', href: '/logistics-and-safety' },
  { label: 'Waste Management', href: '/waste-management' },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 200);
  };

  const navLinkStyle = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'var(--cream-dim)',
    textDecoration: 'none',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
    transition: 'color 0.3s ease',
  };

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Restoration', href: '/#restoration' },
    { label: 'Techniques', href: '/#techniques', hasDropdown: true },
    { label: 'Interactive Site', href: '/interactive-site' },
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
        style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}
        className="nav-desktop"
      >
        {links.map((link) =>
          link.hasDropdown ? (
            <div
              key={link.href}
              ref={dropdownRef}
              style={{ position: 'relative' }}
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href={link.href}
                style={navLinkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--cream-dim)')}
              >
                {link.label}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    marginLeft: '4px',
                    verticalAlign: 'middle',
                    transition: 'transform 0.2s ease',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>

              {/* Dropdown */}
              <div
                className="nav-dropdown"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  paddingTop: '12px',
                  opacity: dropdownOpen ? 1 : 0,
                  pointerEvents: dropdownOpen ? 'auto' : 'none',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                }}
              >
                <div
                  style={{
                    background: 'rgba(14,11,9,0.96)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(200,169,100,0.15)',
                    borderRadius: '12px',
                    padding: '8px 0',
                    minWidth: '240px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  {techniqueLinks.map((tl) => (
                    <Link
                      key={tl.href}
                      href={tl.href}
                      className="nav-dropdown-item"
                      style={{
                        display: 'block',
                        padding: '10px 20px',
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.75rem',
                        fontWeight: 400,
                        color: 'var(--cream-dim)',
                        textDecoration: 'none',
                        letterSpacing: '0.04em',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--gold)';
                        e.currentTarget.style.background = 'rgba(200,169,100,0.08)';
                        e.currentTarget.style.paddingLeft = '24px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--cream-dim)';
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {tl.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              style={navLinkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--cream-dim)')}
            >
              {link.label}
            </Link>
          )
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="nav-hamburger"
        onClick={() => { setMenuOpen(!menuOpen); setMobileDropdownOpen(false); }}
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
            gap: '0',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          {links.map((link) =>
            link.hasDropdown ? (
              <div key={link.href}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link
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
                      padding: '0.625rem 0',
                    }}
                  >
                    {link.label}
                  </Link>
                  <button
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      color: 'var(--gold)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label="Toggle techniques submenu"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transition: 'transform 0.2s ease',
                        transform: mobileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
                {mobileDropdownOpen && (
                  <div style={{
                    paddingLeft: '1rem',
                    borderLeft: '2px solid rgba(200,169,100,0.2)',
                    marginLeft: '0.5rem',
                    marginBottom: '0.5rem',
                  }}>
                    {techniqueLinks.map((tl) => (
                      <Link
                        key={tl.href}
                        href={tl.href}
                        onClick={() => { setMenuOpen(false); setMobileDropdownOpen(false); }}
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-ui)',
                          fontSize: '0.78rem',
                          fontWeight: 400,
                          color: 'var(--cream-dim)',
                          textDecoration: 'none',
                          letterSpacing: '0.04em',
                          padding: '0.5rem 0',
                        }}
                      >
                        {tl.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
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
                  padding: '0.625rem 0',
                }}
              >
                {link.label}
              </Link>
            )
          )}
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
