import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

export const metadata = {
  title: 'Sanity Studio',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const dynamic = 'force-static';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
