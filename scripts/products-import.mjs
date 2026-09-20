/**
 * products-import.mjs — content/products.csv  ->  data/products.ts
 *
 * Validates the spreadsheet, checks that the photographs exist, and only then
 * rewrites the catalogue. If anything is wrong it prints the spreadsheet row
 * number and changes nothing, so a bad edit can never half-apply.
 *
 * Usage:  npm run products:import
 *         npm run products:import -- --allow-missing-photos
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromCsv } from './lib/csv.mjs';
import {
  CATEGORIES, COLOR_FAMILIES, COLLECTION_SLUGS, FABRICS,
  readBool, readHex, readInt, readList, readMoney,
} from './lib/schema.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSV = join(ROOT, 'content', 'products.csv');
const TS = join(ROOT, 'data', 'products.ts');
const allowMissingPhotos = process.argv.includes('--allow-missing-photos');

if (!existsSync(CSV)) {
  console.error(`\n  content/products.csv not found.`);
  console.error(`  Create it first with:  npm run products:export\n`);
  process.exit(1);
}

/* Read the extension the site is configured for, so photo checks look for
   the right files without the user having to tell us twice. */
const currentTs = readFileSync(TS, 'utf8');
const extMatch = currentTs.match(/const IMAGE_EXT = '([a-z0-9]+)'/i);
const IMAGE_EXT = extMatch ? extMatch[1] : 'svg';

const { records } = fromCsv(readFileSync(CSV, 'utf8'));

const errors = [];
const warnings = [];
const seenSlugs = new Map();
const seenSkus = new Map();
const products = [];

const fail = (row, msg) => errors.push(`  Row ${row}: ${msg}`);
const warn = (row, msg) => warnings.push(`  Row ${row}: ${msg}`);

records.forEach((r) => {
  const row = r.__row;
  const label = r.name || r.slug || '(unnamed)';

  /* --- slug: the web address, and the link to the photo files ---------- */
  const slug = (r.slug || '').trim();
  if (!slug) {
    fail(row, `"${label}" has no slug. The slug is the web address and the photo filename.`);
  } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    fail(row, `slug "${slug}" is not valid. Use lowercase letters, numbers and hyphens only — no spaces, capitals or punctuation.`);
  } else if (seenSlugs.has(slug)) {
    fail(row, `slug "${slug}" is already used on row ${seenSlugs.get(slug)}. Every saree needs its own.`);
  } else {
    seenSlugs.set(slug, row);
  }

  if (!r.name) fail(row, `slug "${slug}" has no name.`);

  /* --- money and stock -------------------------------------------------- */
  const price = readMoney(r.price);
  if (price === null) fail(row, `"${label}" has no price.`);
  else if (Number.isNaN(price)) fail(row, `"${label}" has price "${r.price}", which is not a number. Write it as a plain number like 18500.`);
  else if (price <= 0) fail(row, `"${label}" has a price of ${price}.`);

  const compareAt = readMoney(r.compare_at_price);
  if (Number.isNaN(compareAt)) {
    fail(row, `"${label}" has compare_at_price "${r.compare_at_price}", which is not a number. Leave it blank if there is no "was" price.`);
  } else if (compareAt !== null && price && compareAt <= price) {
    warn(row, `"${label}" has a compare_at_price (${compareAt}) that is not higher than the price (${price}). A struck-through price that is lower looks like a mistake — leave it blank instead.`);
  }

  const stock = readInt(r.stock);
  if (stock === null) fail(row, `"${label}" has no stock figure. Use 0 if it is sold out.`);
  else if (Number.isNaN(stock)) fail(row, `"${label}" has stock "${r.stock}", which is not a whole number.`);

  if (!r.sku) fail(row, `"${label}" has no SKU.`);
  else if (seenSkus.has(r.sku)) fail(row, `SKU "${r.sku}" is already used on row ${seenSkus.get(r.sku)}.`);
  else seenSkus.set(r.sku, row);

  /* --- controlled vocabularies ------------------------------------------ */
  if (!CATEGORIES.includes(r.category)) {
    fail(row, `"${label}" has category "${r.category}". Must be one of: ${CATEGORIES.join(', ')}.`);
  }
  if (!COLOR_FAMILIES.includes(r.color_family)) {
    fail(row, `"${label}" has color_family "${r.color_family}". Must be one of: ${COLOR_FAMILIES.join(', ')}.`);
  }
  if (!FABRICS.includes(r.fabric)) {
    fail(row, `"${label}" has fabric "${r.fabric}". Must be exactly one of: ${FABRICS.join(' / ')}.`);
  }

  const hex = readHex(r.color_hex);
  if (hex === null) fail(row, `"${label}" has no color_hex (the colour dot). Example: #9B1B30`);
  else if (Number.isNaN(hex)) fail(row, `"${label}" has color_hex "${r.color_hex}", which is not a 6-digit colour code. Example: #9B1B30`);

  const collections = readList(r.collections);
  const badCollections = collections.filter((c) => !COLLECTION_SLUGS.includes(c));
  if (badCollections.length) {
    fail(row, `"${label}" is in unknown collection(s): ${badCollections.join(', ')}. Valid: ${COLLECTION_SLUGS.join(', ')}.`);
  }

  if (!r.description) warn(row, `"${label}" has no description — cards will look bare.`);

  /* --- photographs ------------------------------------------------------ */
  const images = [1, 2, 3, 4].map((n) => `/images/products/${slug}-${n}.${IMAGE_EXT}`);
  if (slug) {
    const missing = images.filter((p) => !existsSync(join(ROOT, 'public', p)));
    if (missing.length === 4) {
      const msg = `"${label}" has no photos. Expected ${slug}-1.${IMAGE_EXT} … -4.${IMAGE_EXT} in public/images/products/`;
      if (allowMissingPhotos) warn(row, msg);
      else fail(row, msg);
    } else if (missing.length > 0) {
      warn(row, `"${label}" is missing ${missing.length} of 4 photos: ${missing.map((m) => m.split('/').pop()).join(', ')}`);
    }
  }

  products.push({
    id: `sks-${String(products.length + 1).padStart(3, '0')}`,
    slug, name: r.name, price, compareAtPrice: compareAt,
    category: r.category, collections,
    color: r.color, colorFamily: r.color_family, colorHex: hex,
    fabric: r.fabric, description: r.description, story: r.story,
    specs: {
      length: r.length, width: r.width, blouse: r.blouse, zari: r.zari,
      weight: r.weight, weave: r.weave, care: r.care,
    },
    sku: r.sku, stock,
    featured: readBool(r.featured), newArrival: readBool(r.new_arrival),
  });
});

if (records.length === 0) {
  errors.push('  The spreadsheet has no rows.');
}

/* --- report and stop on any error -------------------------------------- */
if (warnings.length) {
  console.log(`\n  ${warnings.length} warning(s) — not blocking, but worth a look:\n`);
  warnings.forEach((w) => console.log(w));
}

if (errors.length) {
  console.error(`\n  ${errors.length} problem(s) found. Nothing was changed.\n`);
  errors.forEach((e) => console.error(e));
  console.error(`\n  Fix these in content/products.csv and run the command again.`);
  if (errors.some((e) => e.includes('has no photos'))) {
    console.error(`  To import anyway while you are still shooting photos:`);
    console.error(`      npm run products:import -- --allow-missing-photos`);
  }
  console.error('');
  process.exit(1);
}

/* --- write the catalogue ------------------------------------------------ */
const s = (v) => JSON.stringify(v ?? '');

const body = products.map((p) => {
  const lines = [
    '  {',
    `    id: ${s(p.id)},`,
    `    slug: ${s(p.slug)},`,
    `    name: ${s(p.name)},`,
    `    price: ${p.price},`,
  ];
  if (p.compareAtPrice != null) lines.push(`    compareAtPrice: ${p.compareAtPrice},`);
  lines.push(
    `    category: ${s(p.category)},`,
    `    collections: [${p.collections.map(s).join(', ')}],`,
    `    color: ${s(p.color)},`,
    `    colorFamily: ${s(p.colorFamily)},`,
    `    colorHex: ${s(p.colorHex)},`,
    `    fabric: ${s(p.fabric)},`,
    `    description: ${s(p.description)},`,
    `    story: ${s(p.story)},`,
    '    specs: {',
    `      length: ${s(p.specs.length)},`,
    `      width: ${s(p.specs.width)},`,
    `      blouse: ${s(p.specs.blouse)},`,
    `      zari: ${s(p.specs.zari)},`,
    `      weight: ${s(p.specs.weight)},`,
    `      weave: ${s(p.specs.weave)},`,
    `      care: ${s(p.specs.care)},`,
    '    },',
    `    sku: ${s(p.sku)},`,
    `    stock: ${p.stock},`,
    `    images: img(${s(p.slug)}),`,
  );
  if (p.featured) lines.push('    featured: true,');
  if (p.newArrival) lines.push('    newArrival: true,');
  lines.push('  },');
  return lines.join('\n');
}).join('\n');

// Keep everything above `export const products` (the header comment, the
// IMAGE_EXT constant and the img() helper) and everything from the derived
// lookups onward, replacing only the array itself.
const head = currentTs.slice(0, currentTs.indexOf('export const products'));
const tailIndex = currentTs.indexOf('/* --- Derived lookups');
const tail = tailIndex === -1 ? '' : currentTs.slice(tailIndex);

const next = `${head}export const products: Product[] = [\n${body}\n];\n\n${tail}`;

// Keep one step of undo, in case an import was not what was intended.
copyFileSync(TS, TS + '.bak');
writeFileSync(TS, next, 'utf8');

const soldOut = products.filter((p) => p.stock === 0).length;
const value = products.reduce((n, p) => n + p.price * p.stock, 0);

console.log(`\n  Imported ${products.length} sarees.\n`);
console.log(`    featured on homepage : ${products.filter((p) => p.featured).length}`);
console.log(`    marked new arrival   : ${products.filter((p) => p.newArrival).length}`);
console.log(`    sold out (stock 0)   : ${soldOut}`);
console.log(`    stock value          : ₹${value.toLocaleString('en-IN')}`);
console.log(`\n  Previous catalogue saved as data/products.ts.bak`);
console.log(`\n  Now check it looks right:\n      npm run dev\n`);
