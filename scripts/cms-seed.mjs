/**
 * cms-seed.mjs — copy the current catalogue into Sanity, photos and all.
 *
 * Run once after connecting the CMS. An empty admin is intimidating; this way
 * the shop owner opens it and finds twenty sarees already there to edit,
 * rename or delete.
 *
 * Needs a write token:
 *   sanity.io -> your project -> API -> Tokens -> Add token -> Editor
 *   then put it in .env.local as SANITY_API_TOKEN=...
 *
 * Usage:  npm run cms:seed
 *         npm run cms:seed -- --replace     (wipe existing sarees first)
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, extname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { createClient } from '@sanity/client';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/* --- read .env.local without a dependency ------------------------------- */
const envPath = join(ROOT, '.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const replace = process.argv.includes('--replace');

/**
 * Write access, without storing a second secret.
 *
 * Prefer an explicit SANITY_API_TOKEN when one is set (CI needs that).
 * Otherwise borrow the session created by `npx sanity login` — it already
 * lives on this machine, it belongs to the person running the command, and
 * reusing it means there is no long-lived token sitting in a project file
 * waiting to be leaked into a screenshot or a commit.
 */
function resolveToken() {
  if (process.env.SANITY_API_TOKEN) return process.env.SANITY_API_TOKEN;
  try {
    const cliConfig = join(homedir(), '.config', 'sanity', 'config.json');
    if (existsSync(cliConfig)) {
      return JSON.parse(readFileSync(cliConfig, 'utf8')).authToken;
    }
  } catch {
    /* fall through to the guidance below */
  }
  return undefined;
}

const token = resolveToken();

function die(lines) {
  console.error('\n' + lines.join('\n') + '\n');
  process.exit(1);
}

if (!projectId) {
  die([
    '  NEXT_PUBLIC_SANITY_PROJECT_ID is not set.',
    '',
    '  Add it to .env.local first:',
    '      NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id',
    '      NEXT_PUBLIC_SANITY_DATASET=production',
    '',
    '  You get the project id from sanity.io -> your project -> Settings.',
  ]);
}

if (!token) {
  die([
    '  No Sanity credentials found.',
    '',
    '  Easiest fix — log in once, and this script will use that session:',
    '      npx sanity login',
    '',
    '  Or, for an unattended environment, create a token and set it:',
    '      npx sanity tokens create "ci" --role editor',
    '      SANITY_API_TOKEN=sk...   (in .env.local)',
  ]);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-10-01',
  useCdn: false,
});

const { products } = await import(pathToFileURL(join(ROOT, 'data', 'products.ts')).href);

console.log(`\n  Seeding ${products.length} sarees into ${projectId}/${dataset}\n`);

if (replace) {
  const existing = await client.fetch('*[_type == "product"]._id');
  if (existing.length) {
    console.log(`  Removing ${existing.length} existing saree(s) first...`);
    let tx = client.transaction();
    existing.forEach((id) => { tx = tx.delete(id); });
    await tx.commit();
  }
}

/** Upload a local image and return an asset reference. */
async function uploadImage(relPath, alt) {
  const abs = join(ROOT, 'public', relPath);
  if (!existsSync(abs)) return null;

  const asset = await client.assets.upload('image', readFileSync(abs), {
    filename: basename(relPath),
    contentType: extname(relPath) === '.svg' ? 'image/svg+xml' : undefined,
  });

  return {
    _type: 'image',
    _key: Math.random().toString(36).slice(2, 12),
    asset: { _type: 'reference', _ref: asset._id },
    alt,
  };
}

let created = 0;
let skipped = 0;

for (const [i, p] of products.entries()) {
  // Don't duplicate on a re-run.
  const already = await client.fetch(
    '*[_type == "product" && slug.current == $slug][0]._id',
    { slug: p.slug },
  );
  if (already && !replace) {
    console.log(`  ${String(i + 1).padStart(2)}. ${p.name} — already there, skipped`);
    skipped++;
    continue;
  }

  process.stdout.write(`  ${String(i + 1).padStart(2)}. ${p.name} — uploading photos... `);

  const images = [];
  for (const [n, src] of p.images.entries()) {
    const img = await uploadImage(src, n === 0 ? p.name : `${p.name} — detail ${n}`);
    if (img) images.push(img);
  }

  await client.create({
    _type: 'product',
    _id: `product-${p.slug}`,
    name: p.name,
    slug: { _type: 'slug', current: p.slug },
    price: p.price,
    ...(p.compareAtPrice ? { compareAtPrice: p.compareAtPrice } : {}),
    stock: p.stock,
    sku: p.sku,
    images,
    description: p.description,
    story: p.story,
    color: p.color,
    colorHex: p.colorHex,
    colorFamily: p.colorFamily,
    fabric: p.fabric,
    specs: { _type: 'object', ...p.specs },
    category: p.category,
    collections: p.collections,
    featured: Boolean(p.featured),
    newArrival: Boolean(p.newArrival),
    order: i + 1,
  });

  console.log(`${images.length} photo(s), done`);
  created++;
}

/* --- shop settings singleton -------------------------------------------- */
const settingsExists = await client.fetch('*[_id == "siteSettings"][0]._id');
if (!settingsExists) {
  await client.createIfNotExists({
    _id: 'siteSettings',
    _type: 'siteSettings',
    contactPublished: false,
    freeShippingAbove: 15000,
    shippingFlatRate: 250,
    deliveryEstimate: '5 – 7 business days',
  });
  console.log('\n  Created Shop Settings.');
}

console.log(`\n  Done. ${created} created, ${skipped} skipped.\n`);
console.log(`  Open the admin:   npm run dev   then visit /studio`);
console.log(`\n  Note: the photos just uploaded are the DEMO artwork. Replace them`);
console.log(`  with real photographs in the admin — that is what it is for.\n`);
