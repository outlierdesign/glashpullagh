'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog error:', error);
  }, [error]);

  return (
    <main style={{ background: 'var(--bg-deep)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--cream)',
          fontSize: '1.75rem',
          marginBottom: '1rem',
        }}>
          Something went wrong
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--cream-dim)',
          marginBottom: '2rem',
        }}>
          There was a problem loading this page.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'var(--bg-deep)',
              background: 'var(--gold)',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Try again
          </button>
          <Link
            href="/blog"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'var(--gold)',
              border: '1px solid var(--gold)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Back to Bog Diaries
          </Link>
        </div>
      </div>
    </main>
  );
}
