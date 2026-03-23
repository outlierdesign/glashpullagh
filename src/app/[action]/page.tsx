import { notFound } from 'next/navigation';
import localActions from '@/data/restoration-actions.json';
import { VideoPlayer } from '@/components/blocks/video-player';
import Image from 'next/image';
import Link from 'next/link';
import { fetchStory, fetchStories, transformRestorationAction } from '@/lib/storyblok';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function generateStaticParams() {
  // Try Storyblok first for the list of slugs
  const stories = await fetchStories('restoration-actions/');
  if (stories.length > 0) {
    return stories.map((s: any) => ({ action: s.slug }));
  }
  // Fallback to local JSON
  return localActions.map((a: any) => ({ action: a.slug }));
}

export async function generateMetadata({ params }: { params: { action: string } }) {
  // Try Storyblok
  const story = await fetchStory(`restoration-actions/${params.action}`);
  if (story?.content) {
    const action = transformRestorationAction(story);
    if (action) {
      return {
        title: action.title + ' — Peatland Restoration',
        description: action.description.slice(0, 160),
        openGraph: {
          title: action.title + ' — Glashapullagh Peatland Restoration',
          description: action.description.slice(0, 160),
        },
        alternates: { canonical: `https://glashapullagh.ie/${params.action}/` },
      };
    }
  }
  // Fallback to local JSON
  const action = localActions.find((a: any) => a.slug === params.action);
  if (!action) return {};
  return {
    title: action.title + ' — Peatland Restoration',
    description: action.description.slice(0, 160),
    openGraph: {
      title: action.title + ' — Glashapullagh Peatland Restoration',
      description: action.description.slice(0, 160),
    },
    alternates: { canonical: `https://glashapullagh.ie/${params.action}/` },
  };
}

export default async function RestorationActionPage({ params }: { params: { action: string } }) {
  let action: any = null;

  // Try Storyblok first
  const story = await fetchStory(`restoration-actions/${params.action}`);
  if (story?.content) {
    action = transformRestorationAction(story);
  }

  // Fallback to local JSON
  if (!action) {
    action = localActions.find((a: any) => a.slug === params.action);
  }

  if (!action) notFound();

  return (
    <main style={{ minHeight: '100vh', background: '#0E0B09', color: '#E4DDD2', fontFamily: 'Proza Libre, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <Link href='/' style={{ color: '#B8864A', textDecoration: 'none', fontSize: '0.875rem', letterSpacing: '0.05em', display: 'inline-block', marginBottom: '2rem' }}>
          Back to Glashapullagh
        </Link>

        <p style={{ color: '#B8864A', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '0.75rem' }}>
          {action.subtitle}
        </p>

        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '2rem', color: '#F5F0E8' }}>
          {action.title}
        </h1>

        <div style={{ marginBottom: '2.5rem' }}>
          <VideoPlayer vimeoUrl={action.vimeoUrl} title={action.title} />
        </div>

        <div style={{ fontSize: '1.0625rem', lineHeight: 1.75, color: 'rgba(232,224,208,0.85)', marginBottom: '3rem' }}>
          <p>{action.description}</p>
        </div>

        <div style={{ borderTop: '1px solid rgba(184,134,74,0.2)', paddingTop: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' as const, justifyContent: 'center', opacity: 0.7 }}>
          <Image src='/images/partners/eu-life.png' alt='EU LIFE' width={65} height={47} />
          <Image src='/images/partners/natura-2000.png' alt='Natura 2000' width={55} height={37} />
          <Image src='/images/partners/npws.png' alt='NPWS' width={30} height={47} />
          <Image src='/images/partners/wild-atlantic-nature.png' alt='Wild Atlantic Nature LIFE' width={153} height={43} />
        </div>
      </div>
    </main>
  );
}
