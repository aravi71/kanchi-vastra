/**
 * Seeds PostgreSQL with the catalogue.
 *
 *   npx prisma db seed                       create what is missing (safe to re-run)
 *   npx prisma db seed -- --overwrite        also overwrite existing sarees from the source
 *
 * Source: the demo catalogue in src/content/products.ts. (The live catalogue
 * was imported from the retired Sanity CMS on 2026-09-26.)
 *
 * Photos: when NEXT_PUBLIC_MEDIA_BASE_URL is set, each saree points at its
 * demo photos in the photo storage (products/<slug>-<n>.jpg, uploaded by
 * scripts/media-demo-photos.sh); otherwise at the SVG artwork in /public.
 *
 * Without --overwrite nothing that already exists is changed, so admin-panel
 * edits are never clobbered by a re-run.
 */

import 'dotenv/config';
import { PrismaClient, ProductStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { products as localProducts } from '../src/content/products';
import { collections as localCollections } from '../src/content/collections';
import demoPhotos from '../src/content/demo-photos.json';

const overwrite = process.argv.includes('--overwrite');
const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/+$/, '');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
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
  featured: boolean;
  newArrival: boolean;
  fallbackImages: string[];
}

/** The demo catalogue in src/content/products.ts. */
async function loadSource(): Promise<{ source: string; items: SeedProduct[] }> {
  return {
    source: `src/content/products.ts (${localProducts.length} sarees)`,
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
      featured: Boolean(p.featured),
      newArrival: Boolean(p.newArrival),
      fallbackImages: p.images,
    })),
  };
}

/** Storage photos for a saree, or its bundled artwork. */
function imagesFor(p: SeedProduct): { url: string; alt: string; provider: string }[] {
  const keys = (demoPhotos.products as Record<string, string[]>)[p.slug];
  const photos = demoPhotos.photos as Record<string, { alt: string }>;
  if (mediaBase && keys?.length) {
    return keys.map((key, i) => ({
      url: `${mediaBase}/products/${p.slug}-${i + 1}.jpg`,
      alt: `${photos[key]?.alt ?? p.name} (demo photo)`,
      provider: 'storage',
    }));
  }
  return p.fallbackImages.map((url, i) => ({
    url,
    alt: i === 0 ? p.name : `${p.name} — detail ${i}`,
    provider: 'local',
  }));
}

async function main() {
  console.log(`\n  Seeding PostgreSQL${overwrite ? ' (overwrite)' : ''}\n`);

  /* --- categories ------------------------------------------------------ */
  // "new-arrivals" is a merchandising flag on the product, not a category.
  const realCategories = localCollections.filter((c) => c.slug !== 'new-arrivals');
  for (const [i, c] of realCategories.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
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
  const categoryId = new Map(
    (await prisma.category.findMany({ select: { id: true, slug: true } })).map((c) => [
      c.slug,
      c.id,
    ]),
  );

  /* --- products -------------------------------------------------------- */
  const { source, items } = await loadSource();
  console.log(`  source: ${source}\n`);

  let created = 0;
  let updated = 0;
  for (const [i, p] of items.entries()) {
    const existing = await prisma.product.findUnique({
      where: { slug: p.slug },
      select: { id: true },
    });
    if (existing && !overwrite) continue;

    const fields = {
      name: p.name,
      description: p.story,
      shortDescription: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice ?? null,
      sku: p.sku,
      status: ProductStatus.ACTIVE,
      categoryId: categoryId.get(p.category) ?? null,
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
    };
    const collectionIds = p.collections
      .map((slug) => categoryId.get(slug))
      .filter((id): id is string => Boolean(id))
      .map((id) => ({ id }));

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...fields, collections: { set: collectionIds } },
      create: { slug: p.slug, ...fields, collections: { connect: collectionIds } },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: imagesFor(p).map((img, n) => ({ productId: product.id, ...img, sortOrder: n })),
    });

    // Every product has one default variant, so carts and orders always
    // point at a variant; stock lives on its inventory row.
    const variant = await prisma.productVariant.upsert({
      where: { sku: `${p.sku}-DEFAULT` },
      update: { isActive: true },
      create: { productId: product.id, name: 'Default', sku: `${p.sku}-DEFAULT`, isActive: true },
    });
    await prisma.inventory.upsert({
      where: { variantId: variant.id },
      update: { quantity: p.stock },
      create: { variantId: variant.id, quantity: p.stock, reserved: 0 },
    });

    if (existing) updated += 1;
    else created += 1;
    process.stdout.write(`  ${existing ? 'updated' : 'created'}  ${p.name}\n`);
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
    created,
    updated,
    products: await prisma.product.count(),
    images: await prisma.productImage.count(),
    storagePhotos: await prisma.productImage.count({ where: { provider: 'storage' } }),
    collectionLinks: (
      await prisma.product.findMany({ select: { _count: { select: { collections: true } } } })
    ).reduce((n, p) => n + p._count.collections, 0),
  };
  console.log('\n  done:', counts, '\n');
}

main()
  .catch((e) => {
    console.error('\n  Seed failed:', e instanceof Error ? e.message : e, '\n');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
