import type { Metadata } from 'next';
import './globals.css';
import StoryblokBridgeProvider from '@/components/storyblok/StoryblokProvider';
import { initStoryblok } from '@/lib/storyblok';
import { SiteNav } from '@/components/blocks/site-nav';

// Initialise Storyblok SDK (server-side, runs once)
initStoryblok();

export const metadata: Metadata = {
  metadataBase: new URL('https://glashapullagh.ie'),
  title: {
    default: 'Glashapullagh — Peatland Restoration, West Limerick',
    template: '%s | Glashapullagh',
  },
  description: 'A working peatland restoration landscape in West Limerick. Explore the science, craft, and long-term stewardship of bogland recovery at Glashapullagh.',
  keywords: ['peatland restoration', 'bog recovery', 'West Limerick', 'Glashapullagh', 'ACRES', 'peat dams', 'coir logs', 'geotextiles', 'Ireland', 'biodiversity'],
  authors: [{ name: 'Glashapullagh Restoration Project' }],
  creator: 'Outlier Design',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://glashapullagh.ie',
    siteName: 'Glashapullagh',
    title: 'Glashapullagh — Peatland Restoration, West Limerick',
    description: 'A working peatland restoration landscape in West Limerick. Explore the science, craft, and long-term stewardship of bogland recovery at Glashapullagh.',
    images: [{
      url: '/images/site/Glashapullagh Restoration West Limerick1.jpg',
      width: 1200,
      height: 630,
      alt: 'Glashapullagh peatland restoration landscape in West Limerick',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glashapullagh — Peatland Restoration, West Limerick',
    description: 'A working peatland restoration landscape in West Limerick. Explore bogland recovery at Glashapullagh.',
    images: ['/images/site/Glashapullagh Restoration West Limerick1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://glashapullagh.ie',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Glashapullagh',
              url: 'https://glashapullagh.ie',
              description: 'A working peatland restoration landscape in West Limerick.',
              publisher: {
                '@type': 'Organization',
                name: 'Glashapullagh Restoration Project',
                url: 'https://glashapullagh.ie',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://glashapullagh.ie/blog/',
                'query-input': undefined,
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Place',
              name: 'Glashapullagh',
              description: 'A peatland restoration site in West Limerick, Ireland, restoring degraded bogland through sustainable techniques.',
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 52.43,
                longitude: -9.28,
              },
              address: {
                '@type': 'PostalAddress',
                addressRegion: 'West Limerick',
                addressCountry: 'IE',
              },
            }),
          }}
        />
        <SiteNav />
        <StoryblokBridgeProvider>
          {children}
        </StoryblokBridgeProvider>
      </body>
    </html>
  );
}
