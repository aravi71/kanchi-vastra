import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

/**
 * Sanity calls this when something is published, so the site updates within
 * seconds instead of waiting for a scheduled rebuild.
 *
 * The request is verified with SANITY_REVALIDATE_SECRET — without that check
 * anyone who found this URL could force the cache to clear repeatedly. If the
 * secret is not set the endpoint refuses to do anything, rather than running
 * unauthenticated.
 *
 * Set the same secret in the Sanity webhook settings. See CMS-SETUP.md.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { revalidated: false, message: 'SANITY_REVALIDATE_SECRET is not configured.' },
      { status: 501 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);

    if (!isValidSignature) {
      return NextResponse.json(
        { revalidated: false, message: 'Invalid signature.' },
        { status: 401 },
      );
    }

    const type = body?._type;
    if (!type) {
      return NextResponse.json(
        { revalidated: false, message: 'No document type in payload.' },
        { status: 400 },
      );
    }

    // The catalogue query is tagged 'product'; settings are tagged separately.
    // Next 16 requires a cacheLife profile; `expire: 0` drops the cached copy
    // straight away, which is the point of a publish webhook.
    revalidateTag(type, { expire: 0 });

    return NextResponse.json({ revalidated: true, type, now: Date.now() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ revalidated: false, message }, { status: 500 });
  }
}
