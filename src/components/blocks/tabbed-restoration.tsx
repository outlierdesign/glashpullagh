'use client';

import { useState } from 'react';

interface RestorationItem {
  title: string;
  description: string;
  image?: string;
}

interface TabbedRestorationProps {
  label?: string;
  title?: string;
  items: RestorationItem[];
}

export function TabbedRestoration({ label, title, items }: TabbedRestorationProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!items || items.length === 0) return null;

  const active = items[activeTab];

  return (
    <section
      id="restoration"
      className="texture-overlay"
      style={{ background: 'var(--bg-section)', padding: '6rem 0' }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              color: 'var(--gold-dim)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            {label || 'Works Completed'}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--cream)',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              marginBottom: '1rem',
            }}
          >
            {title || 'Detailed Restoration Works'}
          </h2>
          <div className="divider-line divider-line-center" />
        </div>

        {/* Tab buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            marginBottom: '2.5rem',
          }}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.85rem',
                fontWeight: activeTab === idx ? 700 : 500,
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: activeTab === idx
                  ? '1px solid var(--gold)'
                  : '1px solid rgba(184,134,74,0.2)',
                background: activeTab === idx
                  ? 'rgba(184,134,74,0.15)'
                  : 'rgba(255,255,255,0.03)',
                color: activeTab === idx ? 'var(--gold)' : 'var(--cream-dim)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Tab content: text left, image right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'stretch',
            minHeight: '400px',
          }}
          className="tabbed-restoration-content"
        >
          {/* Left: text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '2rem 0',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--gold)',
                fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)',
                marginBottom: '1.25rem',
                lineHeight: 1.3,
              }}
            >
              {active.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--cream-dim)',
                fontSize: '1.05rem',
                lineHeight: 1.85,
              }}
            >
              {active.description}
            </p>
          </div>

          {/* Right: image */}
          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(184,134,74,0.15)',
              position: 'relative',
              minHeight: '350px',
            }}
          >
            {active.image ? (
              <img
                src={active.image}
                alt={active.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  inset: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'rgba(184,134,74,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                }}
              >
                Image coming soon
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .tabbed-restoration-content {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
