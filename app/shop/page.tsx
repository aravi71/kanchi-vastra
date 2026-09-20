import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/catalogue';
import { PageHeader } from '@/components/layout/PageHeader';
import { ShopBrowser } from '@/components/product/ShopBrowser';
import { GridSkeleton } from '@/components/product/GridSkeleton';

export const metadata: Metadata = {
  title: 'All Sarees',
  description:
    'Browse the full Kanchi Vastra collection of Kanchipuram-inspired silk sarees — filter by collection, colour, price and fabric.',
  alternates: { canonical: '/shop' },
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <PageHeader
        eyebrow="The Collection"
        title="All Sarees"
        description="Every weave we are currently showing, from bridal Kanjivarams to lighter silk-cottons made for ordinary days."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Sarees' }]}
      />
      {/* useSearchParams needs a Suspense boundary for static rendering. */}
      <Suspense fallback={<GridSkeleton />}>
        <ShopBrowser source={products} />
      </Suspense>
    </>
  );
}
