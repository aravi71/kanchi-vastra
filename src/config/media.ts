import { publicEnv } from '@/config/env.public';

/**
 * URLs for photos kept in the photo storage (Garage), served at /media.
 *
 * Editorial photos (homepage sections) live under editorial/<name>.jpg; see
 * src/content/demo-photos.json for what each name currently shows. When no
 * storage address is configured (e.g. in CI), a local placeholder is used so
 * the site still builds and renders.
 */
export function editorialPhoto(name: string): string {
  return publicEnv.mediaBaseUrl
    ? `${publicEnv.mediaBaseUrl}/editorial/${name}.jpg`
    : '/images/placeholder.svg';
}
