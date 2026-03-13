import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Glashapullagh — Peatland Restoration, West Limerick',
  description: 'A working peatland restoration landscape in West Limerick. Explore the science, craft, and long-term stewardship of bogland recovery at Glashapullagh.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Proza+Libre:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
