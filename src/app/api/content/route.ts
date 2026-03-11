import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { readContent, updateSection } from '@/lib/content-store';

export async function GET() {
  const content = readContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { section, data } = await request.json();
    if (!section || !data) {
      return NextResponse.json({ error: 'Section and data required' }, { status: 400 });
    }

    const updated = updateSection(section, data);
    return NextResponse.json({ success: true, content: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
