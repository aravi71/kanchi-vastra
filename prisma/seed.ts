/**
 * Seeds PostgreSQL from the existing catalogue.
 *
 * Source of truth for the seed is the live Sanity data when it is reachable,
 * falling back to data/products.ts. That way the database starts out matching
 * whatever the shop is actually serving today, including any price or stock
 * edits made in the Studio since the demo data was written.
 *
 * Idempotent: every write is an upsert keyed on slug/sku, so running it twice
 * changes nothing. Safe to re-run after a schema change.
 *
 *   npx prisma db seed
 */

import 'dotenv/config';
import { PrismaClient, ProductStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { createClient } from '@sanity/client';
import { products as localProducts } from '../data/products';
import { collections as localCollections } from '../data/collections';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL! }),
});

interface SeedProduct {
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  category: string;
  collections: string[];
  color: string;
  colorHex: string;
  colorFamily: string;
  fabric: string;
  description: string;
  story: string;
  specs: Record<string, string>;
  images: { url: string; alt: string }[];
  featured: boolean;
  newArrival: boolean;
}

/** Prefer the live CMS so the database matches what customers see today. */
async function loadProducts(): Promise<{ source: string; items: SeedProduct[] }> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

  if (projectId) {
    try {
      const sanity = createClient({
        projectId,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
        apiVersion: '2024-10-01',
        useCdn: false,
      });
      const docs = await sanity.fetch<Record<string, unknown>[]>(
        `*[_type == "product" && defined(slug.current)] | order(coalesce(order, 9999) asc) {
           "slug": slug.current, name, price, compareAtPrice, sku, stock, category,
           "collections": coalesce(collections, []), color, colorHex, colorFamily,
           fabric, description, "story": coalesce(story, ""), specs, featured, newArrival,
           "images": images[]{ "url": asset->url, "alt": coalesce(alt, "") }
         }`,
      );
      if (docs.length > 0) {
        return {
          source: `Sanity (${docs.length} sarees)`,
          items: docs as unknown as SeedProduct[],
        };
      }
    } catch {
      /* fall through to the local catalogue */
    }
  }

  return {
    source: `data/products.ts (${localProducts.length} sarees)`,
    items: localProducts.map((p) => ({
      slug: p.slug,
      name: p.name,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      sku: p.sku,
      stock: p.stock,
      category: p.category,
      collections: p.collections,
      color: p.color,
      colorHex: p.colorHex,
      colorFamily: p.colorFamily,
      fabric: p.fabric,
      description: p.description,
      story: p.story,
      specs: p.specs as unknown as Record<string, string>,
      images: p.images.map((url, i) => ({
        url,
        alt: i === 0 ? p.name : `${p.name} — detail ${i}`,
      })),
      featured: Boolean(p.featured),
      newArrival: Boolean(p.newArrival),
    })),
  };
}

async function main() {
  console.log('\n  Seeding PostgreSQL\n');

  /* --- categories ------------------------------------------------------ */
  // "new-arrivals" is a merchandising flag on the product, not a category.
  const realCategories = localCollections.filter((c) => c.slug !== 'new-arrivals');

  for (const [i, c] of realCategories.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.title, description: c.description, sortOrder: i },
      create: {
        slug: c.slug,
        name: c.title,
        description: c.description,
        imageUrl: c.image,
        sortOrder: i,
        isActive: true,
        metaTitle: `${c.title} | Kanchi Vastra`,
        metaDescription: c.description,
      },
    });
  }
  console.log(`  categories: ${realCategories.length}`);

  /* --- products -------------------------------------------------------- */
  const { source, items } = await loadProducts();
  console.log(`  source:     ${source}\n`);

  for (const [i, p] of items.entries()) {
    const category = await prisma.category.findUnique({ where: { slug: p.category } });

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        sku: p.sku,
        status: ProductStatus.ACTIVE,
        categoryId: category?.id ?? null,
        isFeatured: p.featured,
        isNewArrival: p.newArrival,
        sortOrder: i,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.story,
        shortDescription: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        sku: p.sku,
        status: ProductStatus.ACTIVE,
        categoryId: category?.id ?? null,
        isFeatured: p.featured,
        isNewArrival: p.newArrival,
        sortOrder: i,
        specs: p.specs ?? {},
        colorName: p.color,
        colorHex: p.colorHex,
        colorFamily: p.colorFamily,
        fabric: p.fabric,
        metaTitle: `${p.name} | Kanchi Vastra`,
        metaDescription: p.description,
      },
    });

    // Images: replace wholesale so a re-run reflects the current photo set.
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: (p.images ?? []).map((img, n) => ({
        productId: product.id,
        url: img.url,
        alt: img.alt || p.name,
        provider: img.url.includes('sanity') ? 'sanity' : 'local',
        sortOrder: n,
      })),
    });

    // Every product gets one default variant, so the cart and order tables
    // always point at a variant and never need a "product without variant"
    // special case. Real variants can be added in the admin later.
    const variant = await prisma.productVariant.upsert({
      where: { sku: `${p.sku}-DEFAULT` },
      update: { name: 'Default', price: null, isActive: true },
      create: {
        productId: product.id,
        name: 'Default',
        sku: `${p.sku}-DEFAULT`,
        isActive: true,
        sortOrder: 0,
      },
    });

    await prisma.inventory.upsert({
      where: { variantId: variant.id },
      update: { quantity: p.stock },
      create: { variantId: variant.id, quantity: p.stock, reserved: 0 },
    });

    process.stdout.write(`  ${String(i + 1).padStart(2)}. ${p.name}\n`);
  }

  /* --- shop settings --------------------------------------------------- */
  await prisma.setting.upsert({
    where: { key: 'shipping' },
    update: {},
    create: {
      key: 'shipping',
      value: { freeAbove: 15000, flatRate: 250, estimate: '5 – 7 business days' },
    },
  });

  const counts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    images: await prisma.productImage.count(),
    variants: await prisma.productVariant.count(),
    inStock: await prisma.inventory.count({ where: { quantity: { gt: 0 } } }),
  };
  console.log(`\n  done:`, counts, '\n');
}

main()
  .catch((e) => {
    console.error('\n  Seed failed:', e instanceof Error ? e.message : e, '\n');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
