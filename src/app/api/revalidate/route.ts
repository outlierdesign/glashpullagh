import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Storyblok webhook handler for on-demand ISR revalidation.
 * Set up in Storyblok → Settings → Webhooks:
 *   URL: https://glashapullagh.ie/api/revalidate
 *   Events: story.published, story.unpublished, story.deleted
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Revalidate based on the story that changed
    const slug = body?.story?.full_slug || body?.full_slug || '';

    if (slug.startsWith('restoration-actions/')) {
      // Revalidate the specific subpage
      const actionSlug = slug.replace('restoration-actions/', '');
      revalidatePath(`/${actionSlug}`);
    }

    // Always revalidate home (it aggregates content)
    revalidatePath('/');

    return NextResponse.json({ revalidated: true, slug });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: 'Invalid request' }, { status: 400 });
  }
}
