import { Metadata } from 'next';
import { readFileSync } from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  season: string;
  excerpt: string;
  body: string[];
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

export async function generateStaticParams() {
  const posts = loadPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const posts = loadPosts();
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} — Blog Diaries — Glashapullagh`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const posts = loadPosts();
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) notFound();

  const currentIdx = posts.findIndex((p) => p.slug === params.slug);
  const prevPost = currentIdx < posts.length - 1 ? posts[currentIdx + 1] : null;
  const nextPost = currentIdx > 0 ? posts[currentIdx - 1] : null;

  return (
    <main style={{ background: 'var(--bg-deep)', minHeight: '100vh' }}>
      {/* Hero image */}
      <div style={{
        position: 'relative',
        height: '55vh',
        minHeight: '350px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${post.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, var(--bg-deep) 0%, rgba(14,11,9,0.3) 60%, rgba(14,11,9,0.5) 100%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '750px',
          padding: '0 2rem',
          zIndex: 2,
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '1rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              background: 'rgba(14,11,9,0.6)',
              padding: '0.25rem 0.65rem',
              borderRadius: '4px',
              backdropFilter: 'blur(4px)',
            }}>
              {post.season}
            </span>
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              color: 'var(--cream-dim)',
            }}>
              {formatDate(post.date)}
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--cream)',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 400,
            lineHeight: 1.2,
          }}>
            {post.title}
          </h1>
        </div>
      </div>

      {/* Article body */}
      <article style={{
        maxWidth: '750px',
        margin: '0 auto',
        padding: '3rem 2rem 5rem',
      }}>
        {post.body.map((paragraph, idx) => (
          <p
            key={idx}
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--cream-dim)',
              fontSize: '1.1rem',
              lineHeight: 1.85,
              marginBottom: '1.5rem',
            }}
          >
            {paragraph}
          </p>
        ))}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(184,134,74,0.15)',
          }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-dim)',
                  background: 'rgba(184,134,74,0.08)',
                  border: '1px solid rgba(184,134,74,0.15)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '4px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Prev/Next navigation */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(184,134,74,0.15)',
        }}>
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              style={{
                textDecoration: 'none',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(184,134,74,0.12)',
                transition: 'border-color 0.3s ease',
              }}
            >
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.7rem',
                color: 'var(--gold-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.4rem',
              }}>
                Older
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--cream)',
                fontSize: '1rem',
              }}>
                {prevPost.title}
              </p>
            </Link>
          ) : <div />}
          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              style={{
                textDecoration: 'none',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(184,134,74,0.12)',
                textAlign: 'right',
                transition: 'border-color 0.3s ease',
              }}
            >
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.7rem',
                color: 'var(--gold-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.4rem',
              }}>
                Newer
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--cream)',
                fontSize: '1rem',
              }}>
                {nextPost.title}
              </p>
            </Link>
          ) : <div />}
        </div>

        {/* Back to blog */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
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
            }}
          >
            ← All Blog Diaries
          </Link>
        </div>
      </article>
    </main>
  );
}
