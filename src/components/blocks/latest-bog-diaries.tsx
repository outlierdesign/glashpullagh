'use client';

import Link from 'next/link';

interface DiaryPost {
  slug: string;
  title: string;
  date: string;
  season: string;
  excerpt: string;
  image: string;
  thumbnail?: string;
}

interface LatestBogDiariesProps {
  posts: DiaryPost[];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function LatestBogDiaries({ posts }: LatestBogDiariesProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section
      id="bog-diaries"
      style={{
        background: 'var(--bg-deep)',
        padding: '6rem 0',
        borderTop: '1px solid rgba(184,134,74,0.1)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p
            className="label"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '0.75rem',
            }}
          >
            Bog Diaries
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 400,
              color: 'var(--cream)',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            Latest from the Field
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'var(--cream-dim)',
              maxWidth: '550px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Observations, updates, and discoveries from the Glashapullagh restoration site.
          </p>
        </div>

        {/* Post cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                textDecoration: 'none',
                display: 'block',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(184,134,74,0.12)',
                background: 'rgba(184,134,74,0.03)',
                transition: 'border-color 0.3s ease, transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,134,74,0.35)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,134,74,0.12)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {/* Image */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16/9',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={post.thumbnail || post.image}
                  alt={post.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(14,11,9,0.7) 0%, transparent 50%)',
                  }}
                />
                {/* Season badge */}
                <span
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    background: 'rgba(14,11,9,0.7)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {post.season}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.7rem',
                    color: 'var(--cream-dim)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {formatDate(post.date)}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 400,
                    color: 'var(--cream)',
                    lineHeight: 1.3,
                    marginBottom: '0.65rem',
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    color: 'var(--cream-dim)',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.excerpt}
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '1rem',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'var(--gold)',
                    letterSpacing: '0.08em',
                  }}
                >
                  Read more â
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link
            href="/blog"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'var(--gold)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              padding: '0.75rem 2rem',
              border: '1px solid rgba(184,134,74,0.25)',
              borderRadius: '8px',
              transition: 'border-color 0.3s ease, background 0.3s ease',
            }}
          >
            All Bog Diaries â
          </Link>
        </div>
      </div>
    </section>
  );
}
