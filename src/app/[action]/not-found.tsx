import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', background: '#0E0B09', color: '#E4DDD2', fontFamily: 'Proza Libre, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' as const }}>
      <div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '1rem' }}>
          Page not found
        </h1>
        <Link href='/' style={{ color: '#B8864A', textDecoration: 'none' }}>
          Back to Glashapullagh
        </Link>
      </div>
    </main>
  );
}
