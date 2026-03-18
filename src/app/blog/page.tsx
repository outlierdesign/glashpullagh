import { Metadata } from 'next';
import { readFileSync } from 'fs';
import path from 'path';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog Diaries — Glashapullagh',
  description: 'Stories from the recovering bog. Follow the seasons at Glashapullagh as the peatland heals, wildlife returns, and the landscape transforms.',
};

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  season: string;
  excerpt: string;
  image: string;
  tags: string[];
}

function loadPosts(): BlogPost[] {
  const filePath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Bento grid span patterns for visual variety
const bentoSpans = [
  { col: 'span 2', row: 'span 2' },  // Large featured
  { col: 'span 1', row: 'span 1' },  // Standard
  { col: 'span 1', row: 'span 1' },  // Standard
  { col: 'span 2', row: 'span 1' },  // Wide
  { col: 'span 1', row: 'span 2' },  // Tall
  { col: 'span 1', row: 'span 1' },  // Standard
];

export default function BlogPage() {
  const posts = loadPosts();

  return (
    <main style={{ background: 'var(--bg-deep)', minHeight: '100vh', paddingTop: '6rem' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{
            fontFamily: 'var(--font-ui)',
            color: 'var(--gold-dim)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            Field Notes
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--cream)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 400,
            marginBottom: '1rem',
          }}>
            Blog Diaries
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--cream-dim)',
            fontSize: '1.05rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Stories from the recovering bog. Follow the seasons at Glashapullagh as the peatland heals, wildlife returns, and the landscape transforms.
          </p>
          <div style={{
            width: '60px',
            height: '2px',
            background: 'var(--gold)',
            margin: '2rem auto 0',
          }} />
        </div>

        {/* Bento grid */}
        <div
          className="blog-bento-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
            gridAutoRows: '280px',
          }}
        >
          {posts.map((post, idx) => {
            const span = bentoSpans[idx % bentoSpans.length];
            const isLarge = span.col === 'span 2' && span.row === 'span 2';

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  gridColumn: span.col,
                  gridRow: span.row,
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  border: '1px solid rgba(184,134,74,0.12)',
                  transition: 'border-color 0.3s ease, transform 0.3s ease',
                }}
                className="blog-card"
              >
                {/* Background image */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${post.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.5s ease',
                }} className="blog-card-bg" />

                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(14,11,9,0.92) 0%, rgba(14,11,9,0.4) 50%, rgba(14,11,9,0.15) 100%)',
                }} />

                {/* Season tag */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  background: 'rgba(14,11,9,0.7)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '4px',
                  backdropFilter: 'blur(4px)',
                  zIndex: 2,
                }}>
                  {post.season}
                </div>

                {/* Content */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: isLarge ? '2rem' : '1.25rem',
                  zIndex: 2,
                }}>
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.7rem',
                    color: 'var(--gold-dim)',
                    letterSpacing: '0.08em',
                    marginBottom: '0.4rem',
                  }}>
                    {formatDate(post.date)}
                  </p>
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--cream)',
                    fontSize: isLarge ? '1.6rem' : '1.15rem',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    marginBottom: isLarge ? '0.75rem' : '0.4rem',
                  }}>
                    {post.title}
                  </h2>
                  {isLarge && (
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--cream-dim)',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        .blog-card:hover {
          border-color: rgba(184,134,74,0.35) !important;
          transform: translateY(-2px);
        }
        .blog-card:hover .blog-card-bg {
          transform: scale(1.04);
        }
        @media (max-width: 900px) {
          .blog-bento-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .blog-bento-grid > * {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
          .blog-bento-grid > *:first-child {
            grid-column: span 2 !important;
          }
        }
        @media (max-width: 560px) {
          .blog-bento-grid {
            grid-template-columns: 1fr !important;
          }
          .blog-bento-grid > * {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </main>
  );
}
