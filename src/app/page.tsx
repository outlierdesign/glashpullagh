import { readFileSync } from 'fs';
import path from 'path';
import ClientSite from '@/components/ClientSite';

export default function HomePage() {
  const contentPath = path.join(process.cwd(), 'src', 'data', 'content.json');
  const content = JSON.parse(readFileSync(contentPath, 'utf-8'));

  return <ClientSite content={content} />;
}
