'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma, ProductStatus } from '@prisma/client';
import { z } from 'zod';
import { categories, colorFamilies, fabrics } from '@/content/collections';
import { db } from '@/lib/db/prisma';
import { randomToken } from '@/lib/security/crypto';
import {
  deletePhoto as deleteStoredPhoto,
  storePhoto,
  UploadRejected,
} from '@/lib/storage/objects';
import { slugify } from '@/lib/utils';
import type { FormState } from '@/components/ui/ActionForm';
import { fieldErrors } from '@/features/auth/validation';
import { PRODUCTS_TAG } from '@/features/catalog/server/catalogue';
import { audit, diff } from '@/features/admin/server/audit';
import { requireAdmin } from '@/features/admin/server/guard';

/* ===========================================================================
   Saree editing. Every action re-checks the admin session, validates every
   field on the server, records the change in the activity log and refreshes
   the shop immediately (updateTag).
   =========================================================================== */

const text = (max: number) => z.string().trim().max(max);
const money = z.coerce.number().min(0, 'Must be 0 or more.').max(10_000_000).multipleOf(0.01);

const productSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter the saree name.').max(120),
    slug: text(80)
      .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers and dashes only.')
      .optional(),
    sku: z
      .string()
      .trim()
      .min(2, 'Enter a stock code.')
      .max(40)
      .regex(/^[A-Za-z0-9-_]+$/, 'Letters, numbers, - and _ only.'),
    price: money.refine((n) => n > 0, 'Enter the price.'),
    compareAtPrice: z.union([z.literal(''), money]).optional(),
    stock: z.coerce.number().int('Whole number.').min(0).max(99_999),
    status: z.enum(ProductStatus),
    category: z.enum(categories.map((c) => c.id) as [string, ...string[]]),
    colorName: text(40),
    colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Pick a colour.'),
    colorFamily: z.enum(colorFamilies.map((c) => c.id) as [string, ...string[]]),
    fabric: z.enum(fabrics as [string, ...string[]]),
    shortDescription: text(300),
    description: text(5000),
    specLength: text(120),
    specWidth: text(120),
    specBlouse: text(120),
    specZari: text(120),
    specWeight: text(120),
    specWeave: text(160),
    specCare: text(400),
    sortOrder: z.coerce.number().int().min(0).max(9999),
  })
  .refine((d) => !d.compareAtPrice || d.compareAtPrice > d.price, {
    path: ['compareAtPrice'],
    message: 'The "was" price must be higher than the price, or empty.',
  });

const COLLECTION_SLUGS = new Set(['kanchipuram', 'bridal', 'festive', 'everyday']);

export async function saveProduct(
  productId: string | null,
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const session = await requireAdmin();
  const parsed = productSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return {
      error: 'Please correct the highlighted fields.',
      fieldErrors: fieldErrors(parsed.error),
    };
  const d = parsed.data;

  const slug = d.slug || slugify(d.name);
  const collections = form
    .getAll('collections')
    .map(String)
    .filter((s) => COLLECTION_SLUGS.has(s));
  const categoryRows = await db().category.findMany({ select: { id: true, slug: true } });
  const catId = new Map(categoryRows.map((c) => [c.slug, c.id]));

  const fields = {
    name: d.name,
    slug,
    sku: d.sku.toUpperCase(),
    price: d.price,
    compareAtPrice: d.compareAtPrice ? d.compareAtPrice : null,
    status: d.status,
    categoryId: catId.get(d.category) ?? null,
    colorName: d.colorName,
    colorHex: d.colorHex.toLowerCase(),
    colorFamily: d.colorFamily,
    fabric: d.fabric,
    shortDescription: d.shortDescription,
    description: d.description,
    specs: {
      length: d.specLength,
      width: d.specWidth,
      blouse: d.specBlouse,
      zari: d.specZari,
      weight: d.specWeight,
      weave: d.specWeave,
      care: d.specCare,
    },
    isFeatured: form.get('isFeatured') === 'on',
    isNewArrival: form.get('isNewArrival') === 'on',
    sortOrder: d.sortOrder,
    metaTitle: `${d.name} | Kanchi Vastra`,
    metaDescription: d.shortDescription.slice(0, 160),
  };
  const collectionIds = collections
    .map((s) => catId.get(s))
    .filter(Boolean)
    .map((id) => ({ id: id! }));

  const before = productId
    ? await db().product.findUnique({
        where: { id: productId },
        include: { variants: { include: { inventory: true } } },
      })
    : null;
  if (productId && !before) return { error: 'This saree no longer exists.' };

  let savedId: string;
  try {
    savedId = await db().$transaction(async (tx) => {
      const product = productId
        ? await tx.product.update({
            where: { id: productId },
            data: { ...fields, collections: { set: collectionIds } },
          })
        : await tx.product.create({ data: { ...fields, collections: { connect: collectionIds } } });

      const variant = await tx.productVariant.upsert({
        where: { sku: `${fields.sku}-DEFAULT` },
        update: { productId: product.id, isActive: true },
        create: {
          productId: product.id,
          name: 'Default',
          sku: `${fields.sku}-DEFAULT`,
          isActive: true,
        },
      });
      // A SKU change leaves the old default variant behind: retire it.
      await tx.productVariant.updateMany({
        where: { productId: product.id, NOT: { id: variant.id } },
        data: { isActive: false },
      });
      await tx.inventory.upsert({
        where: { variantId: variant.id },
        update: { quantity: d.stock },
        create: { variantId: variant.id, quantity: d.stock },
      });
      return product.id;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = String(error.meta?.target ?? '');
      return {
        error: 'That value is already used by another saree.',
        fieldErrors: target.includes('sku')
          ? { sku: 'Another saree already has this stock code.' }
          : { slug: 'Another saree already uses this web address.' },
      };
    }
    throw error;
  }

  const oldStock = before?.variants.find((v) => v.isActive)?.inventory?.quantity ?? null;
  await audit(session, productId ? 'product.update' : 'product.create', 'Product', savedId, {
    name: fields.name,
    changes: before
      ? diff(
          {
            name: before.name,
            price: Number(before.price),
            compareAtPrice: before.compareAtPrice ? Number(before.compareAtPrice) : null,
            stock: oldStock,
            status: before.status,
            slug: before.slug,
            sku: before.sku,
            isFeatured: before.isFeatured,
            isNewArrival: before.isNewArrival,
          },
          {
            name: fields.name,
            price: fields.price,
            compareAtPrice: fields.compareAtPrice,
            stock: d.stock,
            status: fields.status,
            slug: fields.slug,
            sku: fields.sku,
            isFeatured: fields.isFeatured,
            isNewArrival: fields.isNewArrival,
          },
        )
      : { price: fields.price, stock: d.stock, status: fields.status },
  });
  updateTag(PRODUCTS_TAG);

  if (!productId) redirect(`/admin/products/${savedId}?created=1`);
  return { ok: 'Saved. The shop already shows the change.' };
}

/* --- photos ---------------------------------------------------------------- */

export async function uploadPhotos(
  productId: string,
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const session = await requireAdmin();
  const product = await db().product.findUnique({
    where: { id: productId },
    select: { slug: true, name: true, _count: { select: { images: true } } },
  });
  if (!product) return { error: 'This saree no longer exists.' };

  const files = form.getAll('photos').filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { error: 'Choose one or more photos first.' };
  if (files.length > 8) return { error: 'Upload at most 8 photos at a time.' };
  if (product._count.images + files.length > 12)
    return { error: 'A saree can have at most 12 photos.' };

  const last = await db().productImage.aggregate({
    where: { productId },
    _max: { sortOrder: true },
  });
  let order = (last._max.sortOrder ?? -1) + 1;
  const stored: string[] = [];
  try {
    for (const file of files) {
      const photo = await storePhoto(
        `products/${product.slug}-${randomToken(6).toLowerCase()}`,
        file,
      );
      await db().productImage.create({
        data: {
          productId,
          url: photo.url,
          provider: 'storage',
          alt: product.name,
          width: photo.width,
          height: photo.height,
          sortOrder: order++,
        },
      });
      stored.push(photo.url);
    }
  } catch (error) {
    if (error instanceof UploadRejected) {
      return {
        error: `${error.message}${stored.length ? ` (${stored.length} photo(s) before it were saved.)` : ''}`,
      };
    }
    throw error;
  } finally {
    if (stored.length) {
      await audit(session, 'photo.upload', 'Product', productId, {
        name: product.name,
        count: stored.length,
      });
      updateTag(PRODUCTS_TAG);
    }
  }
  return { ok: `${stored.length} photo${stored.length === 1 ? '' : 's'} added.` };
}

const imageId = z.string().min(10).max(40);

export async function removePhoto(form: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = imageId.parse(form.get('imageId'));
  const image = await db().productImage.findUnique({
    where: { id },
    include: { product: { select: { name: true } } },
  });
  if (!image) return;

  await db().productImage.delete({ where: { id } });
  await deleteStoredPhoto(image.url).catch((e) =>
    console.error('[admin] photo delete:', (e as Error).message),
  );
  await audit(session, 'photo.delete', 'Product', image.productId, { name: image.product.name });
  updateTag(PRODUCTS_TAG);
}

export async function movePhoto(form: FormData): Promise<void> {
  await requireAdmin();
  const id = imageId.parse(form.get('imageId'));
  const direction = form.get('direction') === 'up' ? -1 : 1;
  const image = await db().productImage.findUnique({ where: { id } });
  if (!image) return;

  const siblings = await db().productImage.findMany({
    where: { productId: image.productId },
    orderBy: { sortOrder: 'asc' },
  });
  const index = siblings.findIndex((s) => s.id === id);
  const target = siblings[index + direction];
  if (!target) return;

  // Rewrite the whole order so gaps and duplicates never accumulate.
  const reordered = [...siblings];
  [reordered[index], reordered[index + direction]] = [
    reordered[index + direction],
    reordered[index],
  ];
  await db().$transaction(
    reordered.map((s, i) =>
      db().productImage.update({ where: { id: s.id }, data: { sortOrder: i } }),
    ),
  );
  updateTag(PRODUCTS_TAG);
}
