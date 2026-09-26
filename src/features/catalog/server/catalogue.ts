import 'server-only';
import { unstable_cache } from 'next/cache';
import { connection } from 'next/server';
import { db } from '@/lib/db/prisma';
import type { CategoryId, ColorFamily, Fabric, Product, ProductSpecs } from '@/types/catalog';

/* ===========================================================================
   THE CATALOGUE — the one place the site reads sarees from.
   ---------------------------------------------------------------------------
   Source of truth: PostgreSQL (Prisma). Only ACTIVE products are shown.

   Results are cached under the 'products' tag for up to five minutes; the
   admin panel invalidates the tag on every save, so a price change shows
   immediately. `connection()` keeps these pages out of the build: the Docker
   build has no database, and product pages render on request instead.
   =========================================================================== */

export const PRODUCTS_TAG = 'products';

const EMPTY_SPECS: ProductSpecs = {
  length: '',
  width: '',
  blouse: '',
  zari: '',
  weight: '',
  weave: '',
  care: '',
};

const loadActiveProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const rows = await db().product.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        category: { select: { slug: true } },
        collections: { select: { slug: true } },
        images: { orderBy: { sortOrder: 'asc' }, select: { url: true } },
        variants: {
          where: { isActive: true },
          select: { inventory: { select: { quantity: true, reserved: true } } },
        },
      },
    });

    return rows.map((row) => {
      const stock = row.variants.reduce(
        (sum, v) => sum + Math.max(0, (v.inventory?.quantity ?? 0) - (v.inventory?.reserved ?? 0)),
        0,
      );
      const collections = row.collections.map((c) => c.slug);
      if (row.isNewArrival) collections.push('new-arrivals');

      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        price: Number(row.price),
        compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : undefined,
        category: (row.category?.slug ?? 'everyday') as CategoryId,
        collections,
        color: row.colorName ?? '',
        colorFamily: (row.colorFamily ?? 'neutral') as ColorFamily,
        colorHex: row.colorHex ?? '#d9c6a5',
        fabric: (row.fabric ?? 'Pure Mulberry Silk') as Fabric,
        description: row.shortDescription ?? '',
        story: row.description ?? '',
        specs: { ...EMPTY_SPECS, ...((row.specs as Partial<ProductSpecs> | null) ?? {}) },
        sku: row.sku,
        stock,
        images: row.images.length > 0 ? row.images.map((i) => i.url) : ['/images/placeholder.svg'],
        featured: row.isFeatured,
        newArrival: row.isNewArrival,
      } satisfies Product;
    });
  },
  ['catalogue:active-products'],
  { tags: [PRODUCTS_TAG], revalidate: 300 },
);

/** Every saree on sale, in the order the shop arranged them. */
export async function getProducts(): Promise<Product[]> {
  await connection();
  return loadActiveProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.featured);
}

export async function getNewArrivals(): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.newArrival);
}

export async function getProductsInCollection(slug: string): Promise<Product[]> {
  const all = await getProducts();
  return slug === 'all' ? all : all.filter((p) => p.collections.includes(slug));
}

/** Same category first, topped up with featured pieces so the rail is never empty. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const sameCategory = all.filter((p) => p.id !== product.id && p.category === product.category);
  const fill = all.filter(
    (p) => p.id !== product.id && p.category !== product.category && p.featured,
  );
  return [...sameCategory, ...fill].slice(0, limit);
}
