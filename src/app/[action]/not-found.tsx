import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', background: '#050604', color: '#E8E0D0', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' as const }}>
      <div>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '2rem', marginBottom: '1rem' }}>
          Page not found
        </h1>
        <Link href='/' style={{ color: '#C4903D', textDecoration: 'none' }}>
          Back to Glashapullagh
        </Link>
      </div>
    </main>
  );
}
