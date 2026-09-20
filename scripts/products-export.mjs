/**
 * products-export.mjs — catalogue  ->  content/products.csv
 *
 * Run this once to get a spreadsheet of everything currently on the site.
 * Edit that spreadsheet in Excel or Google Sheets, then run
 * `npm run products:import` to push your changes back.
 *
 * Safe to re-run: it will refuse to overwrite an existing CSV unless you
 * pass --force, so you cannot lose a spreadsheet you were halfway through.
 *
 * Usage:  npm run products:export
 *         npm run products:export -- --force
 */

import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { toCsv } from './lib/csv.mjs';
import { COLUMNS, writeBool } from './lib/schema.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'content', 'products.csv');
const force = process.argv.includes('--force');

if (existsSync(OUT) && !force) {
  console.error(`\n  content/products.csv already exists.\n`);
  console.error(`  Overwriting it would discard any edits you have not imported yet.`);
  console.error(`  If you are sure, run:  npm run products:export -- --force\n`);
  process.exit(1);
}

// pathToFileURL is required on Windows — a bare "C:\..." path is not a valid
// ESM specifier.
const { products } = await import(pathToFileURL(join(ROOT, 'data', 'products.ts')).href);

const rows = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  price: p.price,
  stock: p.stock,
  sku: p.sku,
  compare_at_price: p.compareAtPrice ?? '',
  category: p.category,
  collections: p.collections.join(', '),
  color: p.color,
  color_family: p.colorFamily,
  color_hex: p.colorHex,
  fabric: p.fabric,
  description: p.description,
  story: p.story,
  length: p.specs.length,
  width: p.specs.width,
  blouse: p.specs.blouse,
  zari: p.specs.zari,
  weight: p.specs.weight,
  weave: p.specs.weave,
  care: p.specs.care,
  featured: writeBool(p.featured),
  new_arrival: writeBool(p.newArrival),
}));

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, toCsv(rows, COLUMNS), 'utf8');

console.log(`\n  Wrote ${rows.length} sarees to content/products.csv\n`);
console.log(`  Next: open it in Excel or Google Sheets, make your changes,`);
console.log(`  save it as CSV in the same place, then run:\n`);
console.log(`      npm run products:import\n`);
