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
  video?: {
    src: string;
    title: string;
    poster?: string;
    type?: 'native' | 'iframe';
  };
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
    title: `${post.title} — Bog Diaries`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — Bog Diaries — Glashapullagh`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      images: post.image ? [{ url: post.image, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
    alternates: {
      canonical: `https://glashapullagh.ie/blog/${post.slug}/`,
    },
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
        {post.body.map((paragraph, idx) => {
          // Insert video player after the 2nd paragraph if the post has a video
          const showVideoAfter = post.video && idx === 1;
          return (
            <div key={idx}>
              <p
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
              {showVideoAfter && (
                <div
                  className="video-embed"
                  style={{
                    position: 'relative',
                    margin: '2.5rem 0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(184,134,74,0.2)',
                    background: '#0a0908',
                  }}
                >
                  {/* Decorative label */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(184,134,74,0.06)',
                    borderBottom: '1px solid rgba(184,134,74,0.12)',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                    }}>
                      {post.video!.title}
                    </span>
                  </div>
                  {/* Video player */}
                  {post.video!.type === 'native' ? (
                    <div style={{ position: 'relative' }}>
                      <video
                        controls
                        preload="metadata"
                        poster={post.video!.poster}
                        style={{
                          width: '100%',
                          display: 'block',
                          background: '#0a0908',
                        }}
                      >
                        <source src={post.video!.src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div style={{
                      position: 'relative',
                      paddingBottom: '56.25%',
                      height: 0,
                      overflow: 'hidden',
                    }}>
                      <iframe
                        title={post.video!.title}
                        src={post.video!.src}
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none',
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

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
            ← All Bog Diaries
          </Link>
        </div>
      </article>
    </main>
  );
}
