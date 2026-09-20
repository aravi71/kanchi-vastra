import { priceBands } from '@/data/collections';
import { searchProducts } from '@/lib/search';
import type { CategoryId, ColorFamily, Fabric, Product } from '@/lib/types';

export type SortId = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'name';

export const sortOptions: { id: SortId; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'New Arrivals' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'name', label: 'Alphabetical' },
];

export interface FilterState {
  q: string;
  categories: CategoryId[];
  colors: ColorFamily[];
  fabrics: Fabric[];
  bands: string[];
  sort: SortId;
  inStockOnly: boolean;
}

export const emptyFilters: FilterState = {
  q: '',
  categories: [],
  colors: [],
  fabrics: [],
  bands: [],
  sort: 'featured',
  inStockOnly: false,
};

/** Parse filter state out of URL search params so every view is shareable. */
export function parseFilters(params: URLSearchParams): FilterState {
  const list = (key: string) =>
    (params.get(key) ?? '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

  const sort = params.get('sort') as SortId | null;

  return {
    q: params.get('q') ?? '',
    categories: list('category') as CategoryId[],
    colors: list('color') as ColorFamily[],
    fabrics: list('fabric') as Fabric[],
    bands: list('price'),
    sort: sortOptions.some((s) => s.id === sort) ? (sort as SortId) : 'featured',
    inStockOnly: params.get('stock') === 'in',
  };
}

/** Serialise filter state back to a query string, omitting defaults. */
export function serialiseFilters(state: FilterState): string {
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  if (state.categories.length) params.set('category', state.categories.join(','));
  if (state.colors.length) params.set('color', state.colors.join(','));
  if (state.fabrics.length) params.set('fabric', state.fabrics.join(','));
  if (state.bands.length) params.set('price', state.bands.join(','));
  if (state.sort !== 'featured') params.set('sort', state.sort);
  if (state.inStockOnly) params.set('stock', 'in');
  return params.toString();
}

export function countActiveFilters(state: FilterState): number {
  return (
    state.categories.length +
    state.colors.length +
    state.fabrics.length +
    state.bands.length +
    (state.inStockOnly ? 1 : 0)
  );
}

/**
 * Apply every facet, then sort.
 *
 * Facets are AND-ed across groups and OR-ed within a group, which is the
 * behaviour shoppers expect: "red OR blue" AND "under ₹10,000".
 */
export function applyFilters(source: Product[], state: FilterState): Product[] {
  // A text query narrows the pool first, and its relevance order is preserved
  // when the shopper has not chosen an explicit sort.
  let result = source;

  if (state.q.trim().length >= 2) {
    const matches = searchProducts(state.q, source.length);
    const ids = new Set(matches.map((p) => p.id));
    const rank = new Map(matches.map((p, i) => [p.id, i]));
    result = source.filter((p) => ids.has(p.id));
    if (state.sort === 'featured') {
      result = [...result].sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0));
    }
  }

  if (state.categories.length) {
    result = result.filter((p) => state.categories.includes(p.category));
  }
  if (state.colors.length) {
    result = result.filter((p) => state.colors.includes(p.colorFamily));
  }
  if (state.fabrics.length) {
    result = result.filter((p) => state.fabrics.includes(p.fabric));
  }
  if (state.bands.length) {
    const active = priceBands.filter((b) => state.bands.includes(b.id));
    result = result.filter((p) => active.some((b) => p.price >= b.min && p.price <= b.max));
  }
  if (state.inStockOnly) {
    result = result.filter((p) => p.stock > 0);
  }

  return sortProducts(result, state.sort, state.q.trim().length >= 2);
}

function sortProducts(list: Product[], sort: SortId, searchRanked: boolean): Product[] {
  const out = [...list];
  switch (sort) {
    case 'price-asc':
      return out.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return out.sort((a, b) => b.price - a.price);
    case 'name':
      return out.sort((a, b) => a.name.localeCompare(b.name));
    case 'newest':
      return out.sort((a, b) => Number(Boolean(b.newArrival)) - Number(Boolean(a.newArrival)));
    case 'featured':
    default:
      // Preserve search relevance when there is a query; otherwise lead with
      // featured pieces and push sold-out items to the end.
      if (searchRanked) return out;
      return out.sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          Number(b.stock > 0) - Number(a.stock > 0),
      );
  }
}
