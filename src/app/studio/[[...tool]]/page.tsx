/**
 * The admin, mounted at /studio.
 *
 * Deployed with the site, so there is one URL and one login. Sanity handles
 * authentication itself — only people you invite to the project can get in,
 * and there is no password for this site to store.
 */

import { NextStudio } from 'next-sanity/studio';
import type { Metadata, Viewport } from 'next';
import { metadata as studioMetadata, viewport as studioViewport } from 'next-sanity/studio';
import config from '@/lib/cms/sanity/config';
import { sanityEnabled } from '@/lib/cms/sanity/env';
import { StudioNotConfigured } from '@/features/studio/components/StudioNotConfigured';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  ...studioMetadata,
  // Keep the admin out of Google.
  robots: { index: false, follow: false },
};

// next-sanity types viewportFit as a plain string; Next wants the literal union.
export const viewport: Viewport = studioViewport as Viewport;

export default function StudioPage() {
  // Before the CMS is connected, show setup instructions rather than a
  // Sanity error screen that would mean nothing to the shop owner.
  if (!sanityEnabled) return <StudioNotConfigured />;
  return <NextStudio config={config} />;
}
