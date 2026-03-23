import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Storyblok webhook handler for on-demand ISR revalidation.
 * Set up in Storyblok → Settings → Webhooks:
 *   URL: https://glashapullagh.ie/api/revalidate
 *   Events: story.published, story.unpublished, story.deleted
 *   Secret: set STORYBLOK_WEBHOOK_SECRET in env vars
 */

/** Allowed slug prefix patterns for revalidation. */
const SLUG_RE = /^[a-z0-9][a-z0-9\-\/]*$/;
const MAX_SLUG_LENGTH = 200;

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret if configured
    const webhookSecret = process.env.STORYBLOK_WEBHOOK_SECRET;
    if (webhookSecret) {
      const providedSecret =
        request.headers.get('webhook-secret') ||
        request.nextUrl.searchParams.get('secret');
      if (providedSecret !== webhookSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Reject non-JSON
    const ct = request.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 });
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    const { story, full_slug: directSlug } = body as Record<string, any>;
    const slug: string = story?.full_slug || directSlug || '';

    // Validate slug format to prevent path traversal
    if (slug && (!SLUG_RE.test(slug) || slug.length > MAX_SLUG_LENGTH)) {
      return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
    }

    if (slug.startsWith('restoration-actions/')) {
      const actionSlug = slug.replace('restoration-actions/', '');
      if (actionSlug && SLUG_RE.test(actionSlug)) {
        revalidatePath(`/${actionSlug}`);
      }
    }

    // Always revalidate home (it aggregates content)
    revalidatePath('/');

    return NextResponse.json({ revalidated: true, slug });
  } catch {
    return NextResponse.json({ revalidated: false, error: 'Invalid request' }, { status: 400 });
  }
}
