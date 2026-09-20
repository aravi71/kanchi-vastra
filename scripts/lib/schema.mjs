/**
 * The shape of content/products.csv, shared by the export and import scripts.
 *
 * Column order here is the order the columns appear in the spreadsheet, so the
 * things you change most often (price, stock) sit near the front.
 */

export const COLUMNS = [
  'slug',
  'name',
  'price',
  'stock',
  'sku',
  'compare_at_price',
  'category',
  'collections',
  'color',
  'color_family',
  'color_hex',
  'fabric',
  'description',
  'story',
  'length',
  'width',
  'blouse',
  'zari',
  'weight',
  'weave',
  'care',
  'featured',
  'new_arrival',
];

export const CATEGORIES = ['kanchipuram', 'bridal', 'festive', 'everyday'];

export const COLOR_FAMILIES = [
  'red', 'maroon', 'gold', 'green', 'blue', 'purple', 'pink', 'saffron', 'neutral',
];

export const FABRICS = [
  'Pure Mulberry Silk', 'Korvai Silk', 'Tissue Silk', 'Silk Cotton', 'Organza Silk',
];

export const COLLECTION_SLUGS = [
  'kanchipuram', 'bridal', 'festive', 'everyday', 'new-arrivals',
];

/* --- forgiving readers -------------------------------------------------
   Spreadsheets mangle things. Someone will type "Rs 18,500" into the price
   column, or Excel will helpfully strip the # from a colour. Rather than
   fail, normalise the common cases and only complain about genuine problems.
   ---------------------------------------------------------------------- */

/** "₹18,500" / "18500.00" / " 18500 " -> 18500 */
export function readMoney(raw) {
  const cleaned = String(raw ?? '').replace(/[₹,\s]/g, '').replace(/\.00$/, '');
  if (cleaned === '') return null;
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return NaN;
  return Math.round(Number(cleaned));
}

/** "4" / " 4 " -> 4 */
export function readInt(raw) {
  const cleaned = String(raw ?? '').replace(/[,\s]/g, '');
  if (cleaned === '') return null;
  if (!/^\d+$/.test(cleaned)) return NaN;
  return Number(cleaned);
}

/** yes / y / true / 1 / TRUE -> true. Blank -> false. */
export function readBool(raw) {
  const v = String(raw ?? '').trim().toLowerCase();
  return v === 'yes' || v === 'y' || v === 'true' || v === '1';
}

export function writeBool(value) {
  return value ? 'yes' : 'no';
}

/** "9B1B30" -> "#9B1B30"; validates the result. */
export function readHex(raw) {
  let v = String(raw ?? '').trim();
  if (v === '') return null;
  if (!v.startsWith('#')) v = '#' + v;
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v.toUpperCase() : NaN;
}

/** "bridal, kanchipuram" -> ['bridal','kanchipuram'] */
export function readList(raw) {
  return String(raw ?? '')
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
