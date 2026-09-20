import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata: Metadata = {
  title: 'Shopping Bag',
  description: 'Review the sarees in your Sri Kanchi Silks shopping bag.',
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
