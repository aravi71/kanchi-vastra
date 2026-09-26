import type { Metadata } from 'next';
import { requireAdmin } from '@/features/admin/server/guard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { saveProduct, uploadPhotos } from '@/features/admin/actions/products';
import { PhotoManager } from '@/features/admin/components/PhotoManager';
import { ProductForm } from '@/features/admin/components/ProductForm';
import { Badge, PageTitle, statusLabel } from '@/features/admin/components/ui';
import { productFormValues } from '@/features/admin/server/product-values';

export const metadata: Metadata = { title: 'Edit saree' };

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { created } = await searchParams;
  const data = await productFormValues(id);
  if (!data) notFound();

  return (
    <>
      <Link href="/admin/products" className="text-sm text-ink-500 hover:text-ink-900">
        ← All sarees
      </Link>
      <PageTitle
        title={data.name}
        description={
          created
            ? 'Created as a draft. Add photos, then set Status to “On sale” and save.'
            : undefined
        }
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={data.values.status}>{statusLabel[data.values.status]}</Badge>
            {data.values.status === 'ACTIVE' && (
              <Link
                href={`/product/${data.values.slug}`}
                target="_blank"
                className="flex items-center gap-1.5 text-sm text-wine-800 hover:underline"
              >
                View in shop <ExternalLink className="size-3.5" />
              </Link>
            )}
          </div>
        }
      />
      <div className="space-y-6">
        <PhotoManager photos={data.photos} upload={uploadPhotos.bind(null, id)} />
        <ProductForm action={saveProduct.bind(null, id)} values={data.values} isNew={false} />
      </div>
    </>
  );
}
