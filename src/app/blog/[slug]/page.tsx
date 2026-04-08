import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadPosts, loadPost, formatDate } from '@/lib/blog';

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

        {/* Gallery */}
        {post.gallery && post.gallery.length > 0 && (
          <div style={{
            marginTop: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(184,134,74,0.15)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.25rem',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}>Gallery</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.75rem',
            }}>
              {post.gallery.map((img, idx) => (
                <div key={idx} style={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  border: '1px solid rgba(184,134,74,0.12)',
                }}>
                  <img
                    src={img.src}
                    alt={img.alt || ''}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {img.caption && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '0.5rem 0.75rem',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.7rem',
                      color: 'var(--cream-dim)',
                    }}>{img.caption}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Videos */}
        {post.videos && post.videos.length > 0 && (
          <div style={{
            marginTop: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(184,134,74,0.15)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.25rem',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}>Videos</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {post.videos.map((vid, idx) => (
                <div key={idx} style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(184,134,74,0.2)',
                  background: '#0a0908',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(184,134,74,0.06)',
                    borderBottom: '1px solid rgba(184,134,74,0.12)',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                    }}>{vid.title}</span>
                  </div>
                  {vid.type === 'native' ? (
                    <video controls preload="metadata" poster={vid.poster} style={{ width: '100%', display: 'block', background: '#0a0908' }}>
                      <source src={vid.src} type="video/mp4" />
                    </video>
                  ) : (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                      <iframe
                        title={vid.title}
                        src={vid.src}
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audio */}
        {post.audio && post.audio.length > 0 && (
          <div style={{
            marginTop: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(184,134,74,0.15)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.25rem',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}>Audio</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {post.audio.map((clip, idx) => (
                <div key={idx} style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(184,134,74,0.15)',
                  background: 'rgba(184,134,74,0.04)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--cream)',
                    marginBottom: '0.25rem',
                  }}>{clip.title}</p>
                  {clip.description && (
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      color: 'var(--cream-dim)',
                      marginBottom: '0.75rem',
                    }}>{clip.description}</p>
                  )}
                  <audio controls preload="metadata" style={{ width: '100%' }}>
                    <source src={clip.src} />
                  </audio>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* External Links */}
        {post.links && post.links.length > 0 && (
          <div style={{
            marginTop: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(184,134,74,0.15)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.25rem',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}>Related Links</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {post.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(184,134,74,0.12)',
                    textDecoration: 'none',
                    transition: 'border-color 0.3s ease',
                  }}
                >
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: 'var(--gold)',
                    marginBottom: link.description ? '0.25rem' : 0,
                  }}>{link.text} ↗</p>
                  {link.description && (
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      color: 'var(--cream-dim)',
                    }}>{link.description}</p>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

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
