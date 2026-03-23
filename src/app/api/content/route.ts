import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { readContent, updateSection, isValidSectionKey } from '@/lib/content-store';

export async function GET() {
  const content = readContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Reject non-JSON content types
  const ct = request.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { section, data } = body as Record<string, unknown>;

  if (typeof section !== 'string') {
    return NextResponse.json({ error: 'Section must be a string' }, { status: 400 });
  }

  if (!isValidSectionKey(section)) {
    return NextResponse.json(
      { error: `Invalid section key. Allowed: hero, about, restoration, media, blog, contact, footer, nav, interactive-site, partners, timeline` },
      { status: 400 },
    );
  }

  if (data === undefined || data === null) {
    return NextResponse.json({ error: 'Data is required' }, { status: 400 });
  }

  try {
    const updated = updateSection(section, data);
    return NextResponse.json({ success: true, content: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update content';
    const status = message.includes('exceeds maximum') ? 413 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
