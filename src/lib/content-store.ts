import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const CONTENT_PATH = path.join(process.cwd(), 'src', 'data', 'content.json');

/** Allowed section keys — only these can be read/written. */
const ALLOWED_SECTIONS = new Set([
  'hero',
  'about',
  'restoration',
  'media',
  'blog',
  'contact',
  'footer',
  'nav',
  'interactive-site',
  'partners',
  'timeline',
]);

/** Max size for a single section payload (500 KB). */
const MAX_SECTION_SIZE = 512_000;

export function isValidSectionKey(key: string): boolean {
  // Must be a simple alphanumeric/hyphen key in the allow-list
  return typeof key === 'string' && ALLOWED_SECTIONS.has(key);
}

export function readContent(): Record<string, unknown> {
  if (!existsSync(CONTENT_PATH)) {
    return {};
  }
  const raw = readFileSync(CONTENT_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function writeContent(data: Record<string, unknown>): void {
  writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function updateSection(
  sectionKey: string,
  sectionData: unknown,
): Record<string, unknown> {
  if (!isValidSectionKey(sectionKey)) {
    throw new Error(`Invalid section key: ${sectionKey}`);
  }

  // Reject oversized payloads
  const serialised = JSON.stringify(sectionData);
  if (serialised.length > MAX_SECTION_SIZE) {
    throw new Error('Section data exceeds maximum allowed size (500 KB)');
  }

  const content = readContent();
  content[sectionKey] = sectionData;
  writeContent(content);
  return content;
}
