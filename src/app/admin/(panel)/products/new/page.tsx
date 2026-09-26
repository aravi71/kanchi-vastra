import type { Metadata } from 'next';
import { requireAdmin } from '@/features/admin/server/guard';
import Link from 'next/link';
import { saveProduct } from '@/features/admin/actions/products';
import { ProductForm } from '@/features/admin/components/ProductForm';
import { PageTitle } from '@/features/admin/components/ui';
import { productFormValues } from '@/features/admin/server/product-values';

export const metadata: Metadata = { title: 'Add a saree' };

export default async function NewProductPage() {
  await requireAdmin();
  const data = await productFormValues();
  return (
    <>
      <Link href="/admin/products" className="text-sm text-ink-500 hover:text-ink-900">
        ← All sarees
      </Link>
      <PageTitle
        title="Add a saree"
        description="Fill in the details and create it as a Draft. Add photos on the next screen, then set it On sale."
      />
      <ProductForm action={saveProduct.bind(null, null)} values={data!.values} isNew />
    </>
  );
}
