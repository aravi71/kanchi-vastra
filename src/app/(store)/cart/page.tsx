import type { Metadata } from 'next';
import { CartView } from '@/features/cart/components/CartView';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata: Metadata = {
  title: 'Shopping Bag',
  description: 'Review the sarees in your Kanchi Vastra shopping bag.',
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        title="Shopping Bag"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Shopping Bag' }]}
      />
      <CartView />
    </>
  );
}
