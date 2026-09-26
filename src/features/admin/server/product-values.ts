import 'server-only';
import type { ProductFormValues } from '@/features/admin/components/ProductForm';
import { db } from '@/lib/db/prisma';

/** Loads a saree in the shape the editor form needs, or blank values for a new one. */
export async function productFormValues(id?: string): Promise<{
  values: ProductFormValues;
  photos: { id: string; url: string }[];
  name: string;
} | null> {
  if (!id) {
    const next = (await db().product.aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? 0;
    return {
      name: 'New saree',
      photos: [],
      values: {
        name: '',
        slug: '',
        sku: '',
        price: '',
        compareAtPrice: '',
        stock: '1',
        status: 'DRAFT',
        category: 'kanchipuram',
        collections: [],
        colorName: '',
        colorHex: '#9b1b30',
        colorFamily: 'red',
        fabric: 'Pure Mulberry Silk',
        shortDescription: '',
        description: '',
        specs: {
          length: '6.3 metres including blouse piece',
          width: '47 inches',
          blouse: '0.8 metre blouse piece attached',
          zari: 'Half-fine gold zari',
          weight: 'Approx. 700 g',
          weave: 'Traditional Kanchipuram handloom technique',
          care: 'Dry clean only. Store folded in cotton muslin.',
        },
        isFeatured: false,
        isNewArrival: true,
        sortOrder: String(next + 1),
      },
    };
  }

  const p = await db().product.findUnique({
    where: { id },
    include: {
      category: { select: { slug: true } },
      collections: { select: { slug: true } },
      images: { orderBy: { sortOrder: 'asc' }, select: { id: true, url: true } },
      variants: { where: { isActive: true }, include: { inventory: true } },
    },
  });
  if (!p) return null;
  const specs = (p.specs ?? {}) as Partial<ProductFormValues['specs']>;

  return {
    name: p.name,
    photos: p.images,
    values: {
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: String(Number(p.price)),
      compareAtPrice: p.compareAtPrice ? String(Number(p.compareAtPrice)) : '',
      stock: String(p.variants.reduce((n, v) => n + (v.inventory?.quantity ?? 0), 0)),
      status: p.status,
      category: p.category?.slug ?? 'kanchipuram',
      collections: p.collections.map((c) => c.slug),
      colorName: p.colorName ?? '',
      colorHex: p.colorHex ?? '#9b1b30',
      colorFamily: p.colorFamily ?? 'red',
      fabric: p.fabric ?? 'Pure Mulberry Silk',
      shortDescription: p.shortDescription ?? '',
      description: p.description ?? '',
      specs: {
        length: specs.length ?? '',
        width: specs.width ?? '',
        blouse: specs.blouse ?? '',
        zari: specs.zari ?? '',
        weight: specs.weight ?? '',
        weave: specs.weave ?? '',
        care: specs.care ?? '',
      },
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival,
      sortOrder: String(p.sortOrder),
    },
  };
}
