import { collections } from '@/data/collections';
import type { Product } from '@/lib/types';

/**
 * Lightweight client-side search over the demo catalogue.
 *
 * Deliberately dependency-free: at twenty products a scored substring match
 * is faster and smaller than any index. If the catalogue grows past a few
 * hundred items, swap this module for a real index (Fuse.js, Typesense,
 * Algolia) — the call signature is the only thing the UI depends on.
 */

interface Scored {
  product: Product;
  score: number;
}

/** Fields are weighted so a name match always outranks a colour match. */
const FIELD_WEIGHTS: { get: (p: Product) => string; weight: number }[] = [
  { get: (p) => p.name, weight: 10 },
  { get: (p) => p.color, weight: 6 },
  { get: (p) => p.category, weight: 5 },
  { get: (p) => p.collections.join(' '), weight: 5 },
  { get: (p) => p.fabric, weight: 4 },
  { get: (p) => p.sku, weight: 4 },
  { get: (p) => p.description, weight: 2 },
];

/**
 * @param source  the live catalogue — passed in rather than imported, so search
 *                works identically whether products come from the CMS or the
 *                local data file.
 */
export function searchProducts(source: Product[], query: string, limit = 8): Product[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  const scored: Scored[] = source.flatMap((product) => {
    let score = 0;

    for (const term of terms) {
      let termScore = 0;
      for (const field of FIELD_WEIGHTS) {
        const value = field.get(product).toLowerCase();
        const at = value.indexOf(term);
        if (at === -1) continue;
        // Matches at a word boundary are worth more than matches mid-word.
        const boundary = at === 0 || /[\s-]/.test(value[at - 1]);
        termScore = Math.max(termScore, field.weight * (boundary ? 1.5 : 1));
      }
      // Every term must appear somewhere, otherwise the product is not a match.
      if (termScore === 0) return [];
      score += termScore;
    }

    // Gentle nudge so in-stock and featured pieces surface first on ties.
    if (product.stock > 0) score += 0.5;
    if (product.featured) score += 0.25;

    return [{ product, score }];
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.product);
}

/** Collection matches shown alongside product results in the search overlay. */
export function searchCollections(query: string) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return collections.filter(
    (c) => c.title.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q),
  );
}

/** Shown before the user types anything. Curated, not derived from behaviour. */
export const suggestedSearches = [
  'Kanchipuram',
  'Bridal',
  'Ruby',
  'Temple border',
  'Peacock',
  'Silk cotton',
];
