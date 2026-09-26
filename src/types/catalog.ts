/**
 * Domain types for the storefront.
 *
 * The UI only ever talks to these shapes — never to a data source directly.
 * That indirection is what lets `data/products.ts` be swapped for Supabase,
 * Shopify, Medusa or a bespoke API without touching a single component.
 */

export type CategoryId = 'kanchipuram' | 'bridal' | 'festive' | 'everyday';

export type ColorFamily =
  'red' | 'maroon' | 'gold' | 'green' | 'blue' | 'purple' | 'pink' | 'saffron' | 'neutral';

export type Fabric =
  'Pure Mulberry Silk' | 'Korvai Silk' | 'Tissue Silk' | 'Silk Cotton' | 'Organza Silk';

export interface ProductSpecs {
  /** Total saree length including the blouse piece, e.g. "6.3 metres". */
  length: string;
  /** Usable width of the drape. */
  width: string;
  /** Blouse piece description. */
  blouse: string;
  /** Zari type — the metallic thread used in the border and pallu. */
  zari: string;
  /** Approximate weight, which buyers of heavy silk genuinely care about. */
  weight: string;
  /** Weave technique. */
  weave: string;
  /** Care instructions. */
  care: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Price in whole Indian rupees. DEMO VALUE — see README. */
  price: number;
  /** Optional strike-through reference price, also demo-only. */
  compareAtPrice?: number;
  category: CategoryId;
  /** Collection slugs this product belongs to (a product may sit in several). */
  collections: string[];
  /** Human-readable colour name shown on the product page. */
  color: string;
  /** Normalised bucket used by the shop filters. */
  colorFamily: ColorFamily;
  /** Hex swatch shown in the colour filter and on the product page. */
  colorHex: string;
  fabric: Fabric;
  /** Short editorial description. */
  description: string;
  /** Longer form copy for the product page. */
  story: string;
  specs: ProductSpecs;
  sku: string;
  /** Units on hand. 0 renders as "Sold out" and disables purchase. */
  stock: number;
  /** Image paths relative to /public. First image is the primary. */
  images: string[];
  featured?: boolean;
  newArrival?: boolean;
}

export interface Collection {
  slug: string;
  title: string;
  /** One-line positioning shown beneath the title. */
  tagline: string;
  description: string;
  image: string;
  /** Filter applied when the collection page loads. */
  category?: CategoryId;
}

export interface CartLine {
  productId: string;
  quantity: number;
  /** Captured at add-to-cart time so a later price change can be detected. */
  priceAtAdd: number;
}
