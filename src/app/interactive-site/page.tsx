import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Site — Glashapullagh',
  description: 'Explore the Glashapullagh peatland restoration site interactively. Navigate the 3D landscape, discover restoration techniques, and experience the bog up close.',
};

export default function InteractiveSitePage() {
  return (
    <main className="interactive-site-fullpage">
      <div className="interactive-site-fullpage-header">
        <a href="/" className="interactive-site-back">← Back to Site</a>
        <h1>Interactive Site</h1>
        <p>Explore the Glashapullagh restoration landscape</p>
      </div>
      <div className="interactive-site-fullpage-embed">
        <iframe
          src="/viewer/"
          title="Interactive Glashapullagh Site"
          allow="accelerometer; gyroscope; xr-spatial-tracking; autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    </main>
  );
}
