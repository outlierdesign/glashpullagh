'use client';

interface VideoPlayerProps {
  vimeoUrl?: string;
  title?: string;
}

export function VideoPlayer({ vimeoUrl, title }: VideoPlayerProps) {
  if (!vimeoUrl) {
    return (
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          aspectRatio: '16/9',
          background: 'rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(184,134,74,0.2)',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Proza Libre, sans-serif', fontSize: '1rem' }}>
          Video coming soon
        </p>
      </div>
    );
  }

  // Extract video ID and optional privacy hash from Vimeo URL
  // Handles: vimeo.com/1234567890/abc123hash and vimeo.com/1234567890
  const match = vimeoUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)(?:\/([a-zA-Z0-9]+))?/);
  const vimeoId = match ? match[1] : vimeoUrl;
  const privacyHash = match ? match[2] : null;

  let embedSrc = `https://player.vimeo.com/video/${vimeoId}?controls=1&byline=0&portrait=0&title=0&transparent=0`;
  if (privacyHash) {
    embedSrc += `&h=${privacyHash}`;
  }

  return (
    <div
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        aspectRatio: '16/9',
        position: 'relative',
        background: '#000',
      }}
    >
      <iframe
        src={embedSrc}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title || 'Restoration video'}
        loading="lazy"
      />
    </div>
  );
}
