import 'server-only';
import { AwsClient } from 'aws4fetch';
import sharp, { type Metadata } from 'sharp';
import { serverEnv } from '@/config/env.server';

/* ===========================================================================
   Photo storage (Garage, S3-compatible) — uploads and deletions.
   Reached only inside the private Docker network (S3_ENDPOINT=http://garage:3900).
   =========================================================================== */

export const RENDITION_WIDTHS = [640, 1080, 1600, 2400] as const;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ACCEPTED = new Set(['jpeg', 'png', 'webp']);

let client: AwsClient | undefined;
function s3(): AwsClient {
  if (!client) {
    const cfg = serverEnv('storage');
    client = new AwsClient({
      accessKeyId: cfg.S3_ACCESS_KEY_ID,
      secretAccessKey: cfg.S3_SECRET_ACCESS_KEY,
      service: 's3',
      region: cfg.S3_REGION,
    });
  }
  return client;
}

function objectUrl(key: string): string {
  const cfg = serverEnv('storage');
  return `${cfg.S3_ENDPOINT.replace(/\/+$/, '')}/${cfg.S3_BUCKET}/${key}`;
}

async function put(key: string, body: Buffer, contentType: string): Promise<void> {
  const res = await s3().fetch(objectUrl(key), {
    method: 'PUT',
    body: new Uint8Array(body),
    headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=604800' },
  });
  if (!res.ok) throw new Error(`Storage upload failed (${res.status}) for ${key}`);
}

async function remove(key: string): Promise<void> {
  const res = await s3().fetch(objectUrl(key), { method: 'DELETE' });
  if (!res.ok && res.status !== 404)
    throw new Error(`Storage delete failed (${res.status}) for ${key}`);
}

export class UploadRejected extends Error {}

export interface StoredPhoto {
  url: string;
  width: number;
  height: number;
}

/**
 * Validates an uploaded photo by decoding it (the file name and the browser's
 * claimed type are never trusted), turns it upright, strips all metadata —
 * phone photos carry GPS location — and stores a JPEG original plus WebP
 * renditions: <stem>.jpg, <stem>-640.webp … <stem>-2400.webp.
 */
export async function storePhoto(stem: string, file: File): Promise<StoredPhoto> {
  if (file.size === 0) throw new UploadRejected('The file is empty.');
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadRejected('Photos must be under 10 MB.');

  const input = Buffer.from(await file.arrayBuffer());
  let meta: Metadata;
  try {
    meta = await sharp(input, { limitInputPixels: 50_000_000 }).metadata();
  } catch {
    throw new UploadRejected('That file is not a photo we can read. Use JPG, PNG or WebP.');
  }
  if (!meta.format || !ACCEPTED.has(meta.format)) {
    throw new UploadRejected(
      'Use a JPG, PNG or WebP photo (iPhone: Settings → Camera → Most Compatible).',
    );
  }

  const base = sharp(input, { limitInputPixels: 50_000_000 }).rotate();
  const original = await base
    .clone()
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });

  await put(`${stem}.jpg`, original.data, 'image/jpeg');
  for (const width of RENDITION_WIDTHS) {
    const webp = await base
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer();
    await put(`${stem}-${width}.webp`, webp, 'image/webp');
  }

  return {
    url: `${serverEnv('storage').MEDIA_PUBLIC_BASE_URL.replace(/\/+$/, '')}/${stem}.jpg`,
    width: original.info.width,
    height: original.info.height,
  };
}

/** Deletes a stored photo and its renditions, given its public URL. */
export async function deletePhoto(url: string): Promise<void> {
  const base = serverEnv('storage').MEDIA_PUBLIC_BASE_URL.replace(/\/+$/, '') + '/';
  if (!url.startsWith(base) || !url.endsWith('.jpg')) return; // not ours (e.g. bundled art)
  const stem = url.slice(base.length, -'.jpg'.length);
  await Promise.all([
    remove(`${stem}.jpg`),
    ...RENDITION_WIDTHS.map((w) => remove(`${stem}-${w}.webp`)),
  ]);
}
