import type { ImageLoaderProps } from 'next/image';
import { publicEnv } from '@/config/env.public';

/**
 * next/image loader: every photo is pre-sized where it is stored,
 * never by this app. That keeps image CPU off the web server, lets browsers
 * fetch straight from storage/CDN, and avoids the app fetching its own
 * public URL from inside Docker (which Next 16 rightly refuses for private
 * addresses).
 *
 * - Our storage (editorial/<name>.jpg, products/<slug>-<n>.jpg): pre-rendered WebP
 *   renditions <name>-<width>.webp; see scripts/media-demo-photos.sh.
 * - Files in /public (logo, SVG artwork): served as they are.
 */
const EDITORIAL_WIDTHS = [640, 1080, 1600, 2400] as const;
/** Storage folders whose .jpg photos have WebP renditions alongside. */
const RENDITION_FOLDERS = ['editorial', 'products'] as const;

export default function imageLoader({ src, width }: ImageLoaderProps): string {
  const media = publicEnv.mediaBaseUrl;
  if (
    media &&
    RENDITION_FOLDERS.some((f) => src.startsWith(`${media}/${f}/`)) &&
    src.endsWith('.jpg')
  ) {
    const rendition = EDITORIAL_WIDTHS.find((w) => w >= width) ?? EDITORIAL_WIDTHS.at(-1);
    return `${src.slice(0, -'.jpg'.length)}-${rendition}.webp`;
  }

  return `${src}${src.includes('?') ? '&' : '?'}w=${width}`;
}
