'use client';

import { useEffect, useState, ReactNode } from 'react';

interface StoryblokBridgeProviderProps {
  children: ReactNode;
}

/**
 * Client-side Storyblok Bridge provider.
 * Loads the Storyblok Bridge script and enables live editing in the Visual Editor.
 * In production (outside the editor), this is a transparent wrapper.
 */
export default function StoryblokBridgeProvider({ children }: StoryblokBridgeProviderProps) {
  const [bridgeLoaded, setBridgeLoaded] = useState(false);

  useEffect(() => {
    // Only load bridge if we're inside the Storyblok Visual Editor
    const isEditor =
      typeof window !== 'undefined' &&
      window.location.search.includes('_storyblok');

    if (!isEditor) return;

    // Load the Storyblok Bridge v2 script
    const script = document.createElement('script');
    script.src = 'https://app.storyblok.com/f/storyblok-v2-latest.js';
    script.async = true;
    script.onload = () => setBridgeLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <>{children}</>;
}
