import { createClient, type SanityClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { Image as SanityImage } from 'sanity';
import { apiVersion, dataset, projectId, sanityEnabled } from './env';

/**
 * Read-only client used by the site. Returns null when the CMS has not been
 * connected yet, so callers fall back to the local catalogue.
 */
export const client: SanityClient | null = sanityEnabled
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // CDN-cached responses; revalidation is handled by Next's cache tags
      // plus the webhook in app/api/revalidate.
      useCdn: true,
      perspective: 'published',
    })
  : null;

const builder = sanityEnabled ? createImageUrlBuilder({ projectId, dataset }) : null;

/**
 * Turn a Sanity image reference into a URL at the size we actually need.
 *
 * Sanity crops on its own CDN, so asking for 800x1067 means an 800px file is
 * delivered rather than the 4MB original the shop owner uploaded from their
 * phone. `fit: 'crop'` honours the hotspot they set in the admin, so the
 * border of a saree does not get cropped out.
 */
export function urlForImage(
  source: SanityImage,
  width = 1000,
  height?: number,
): string {
  if (!builder || !source) return '';
  let img = builder.image(source).width(width).auto('format').quality(82);
  if (height) img = img.height(height).fit('crop');
  return img.url();
}
