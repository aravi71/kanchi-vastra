/**
 * cms-demo-photos.mjs — put demo photography on the sarees in Sanity.
 *
 * Reads src/content/demo-photos.json, downloads each photo from Unsplash
 * (Unsplash License), uploads it to Sanity once, and sets each saree's photos
 * to the ones listed for it. The photo description ends in "(demo photo)" so
 * placeholders are easy to spot in the Studio.
 *
 *   node scripts/cms-demo-photos.mjs --dry-run   # show what would change
 *   node scripts/cms-demo-photos.mjs             # do it
 *
 * Idempotent: an uploaded photo is found again by its Unsplash id, so running
 * twice uploads nothing new. The previous content is in the backup taken
 * before the redesign (sanity-production-dataset.tar.gz).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, die, sanityAdminClient } from './lib/sanity-admin.mjs';

const dryRun = process.argv.includes('--dry-run');
const manifest = JSON.parse(readFileSync(join(ROOT, 'src', 'content', 'demo-photos.json'), 'utf8'));
const client = sanityAdminClient();

const unsplashUrl = (id, width) =>
  `https://images.unsplash.com/${id}?w=${width}&q=82&fm=jpg&fit=max`;

/** Upload (or find) one photo; returns the Sanity asset id. */
const assetCache = new Map();
async function assetFor(key) {
  if (assetCache.has(key)) return assetCache.get(key);
  const photo = manifest.photos[key];
  if (!photo) die(`  Photo "${key}" is not defined in demo-photos.json.`);

  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && source.name == "unsplash" && source.id == $id][0]._id`,
    { id: photo.id },
  );
  if (existing) {
    assetCache.set(key, existing);
    return existing;
  }
  if (dryRun) {
    assetCache.set(key, `(new upload of ${key})`);
    return assetCache.get(key);
  }

  const res = await fetch(unsplashUrl(photo.id, 1400));
  if (!res.ok) die(`  Download failed for ${key} (${photo.id}): HTTP ${res.status}`);
  const asset = await client.assets.upload('image', Buffer.from(await res.arrayBuffer()), {
    filename: `demo-${key}.jpg`,
    title: photo.alt,
    description: 'Demo photo — Unsplash License. Replace with real product photography.',
    source: { name: 'unsplash', id: photo.id, url: unsplashUrl(photo.id, 2400) },
  });
  process.stdout.write(`  uploaded ${key}\n`);
  assetCache.set(key, asset._id);
  return asset._id;
}

console.log(`\n  Demo photos -> Sanity${dryRun ? ' (dry run)' : ''}\n`);

let changed = 0;
for (const [slug, keys] of Object.entries(manifest.products)) {
  const ids = await client.fetch(`*[_type == "product" && slug.current == $slug]._id`, { slug });
  if (ids.length === 0) {
    console.log(`  skip  ${slug} (not in the CMS)`);
    continue;
  }

  const images = [];
  for (const [i, key] of keys.entries()) {
    images.push({
      _type: 'image',
      _key: `demo-${i}-${key}`,
      asset: { _type: 'reference', _ref: await assetFor(key) },
      alt: `${manifest.photos[key].alt} (demo photo)`,
    });
  }

  // Published document and any unpublished draft, so a pending draft cannot
  // bring the old artwork back when someone publishes it.
  for (const id of ids) {
    if (!dryRun) await client.patch(id).set({ images }).commit();
    changed += 1;
  }
  console.log(
    `  ${dryRun ? 'would set' : 'set'}  ${slug}: ${keys.join(', ')}${ids.length > 1 ? ' (+draft)' : ''}`,
  );
}

console.log(`\n  ${dryRun ? 'Would update' : 'Updated'} ${changed} document(s).\n`);
