import 'server-only';
import { groq } from 'next-sanity';
import { client, urlForImage } from '@/lib/cms/sanity/client';
import { sanityEnabled } from '@/lib/cms/sanity/env';
import { products as localProducts } from '@/content/products';
import type { Product } from '@/types/catalog';

/* ===========================================================================
   THE CATALOGUE — one place the whole site asks for sarees.
   ---------------------------------------------------------------------------
   Two sources, one shape:
     - Sanity CMS, once NEXT_PUBLIC_SANITY_PROJECT_ID is set
     - data/products.ts otherwise

   Every page calls these functions and neither knows nor cares which is in
   use. That is what lets the shop be handed over to a CMS without touching a
   single component.
   =========================================================================== */

const PRODUCT_FIELDS = groq`
  "id": _id,
  "slug": slug.current,
  name,
  price,
  compareAtPrice,
  category,
  "collections": coalesce(collections, []),
  color,
  colorFamily,
  colorHex,
  fabric,
  description,
  "story": coalesce(story, ""),
  specs,
  sku,
  stock,
  "imageRefs": images[]{ ..., "alt": alt },
  featured,
  newArrival,
  order
`;

interface SanityProduct extends Omit<Product, 'images'> {
  imageRefs?: { alt?: string }[];
  order?: number;
}

/** Sanity documents -> the Product shape the UI expects. */
function normalise(docs: SanityProduct[]): Product[] {
  return docs.map((doc) => {
    const refs = doc.imageRefs ?? [];
    // As many photos as the owner uploaded (at least one placeholder), never
    // padded with repeats — the gallery and "change look" strip adapt.
    const urls = refs.map((ref) => urlForImage(ref as never, 1000, 1333)).filter(Boolean);
    const images = urls.length > 0 ? urls : ['/images/placeholder.svg'];

    return {
      id: doc.id,
      slug: doc.slug,
      name: doc.name,
      price: doc.price,
      compareAtPrice: doc.compareAtPrice,
      category: doc.category,
      collections: doc.collections ?? [],
      color: doc.color,
      colorFamily: doc.colorFamily,
      colorHex: doc.colorHex,
      fabric: doc.fabric,
      description: doc.description,
      story: doc.story,
      specs: doc.specs,
      sku: doc.sku,
      stock: doc.stock ?? 0,
      images: images.slice(0, 8),
      featured: Boolean(doc.featured),
      newArrival: Boolean(doc.newArrival),
    };
  });
}

/**
 * Every saree, ordered the way the shop owner arranged them.
 *
 * Tagged for on-demand revalidation: publishing in the admin fires a webhook
 * that invalidates this tag, so the site updates within seconds instead of
 * waiting for a timed rebuild.
 */
export async function getProducts(): Promise<Product[]> {
  if (!sanityEnabled || !client) return localProducts;

  try {
    const docs = await client.fetch<SanityProduct[]>(
      groq`*[_type == "product" && defined(slug.current)]
             | order(coalesce(order, 9999) asc, name asc) { ${PRODUCT_FIELDS} }`,
      {},
      { next: { tags: ['product'], revalidate: 60 } },
    );
    // An empty CMS should not produce an empty shop while it is being filled.
    return docs.length > 0 ? normalise(docs) : localProducts;
  } catch (error) {
    // A CMS outage must never take the storefront down.
    console.error('[catalogue] Sanity fetch failed, serving local catalogue:', error);
    return localProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
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
