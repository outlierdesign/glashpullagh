import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const CONTENT_PATH = path.join(process.cwd(), 'src', 'data', 'content.json');

export function readContent(): Record<string, any> {
  if (!existsSync(CONTENT_PATH)) {
    return {};
  }
  const raw = readFileSync(CONTENT_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function writeContent(data: Record<string, any>): void {
  writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function updateSection(sectionKey: string, sectionData: any): Record<string, any> {
  const content = readContent();
  content[sectionKey] = sectionData;
  writeContent(content);
  return content;
}
