import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your Kanchi Vastra order.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        title="Checkout"
        description="Enter your delivery details. Payments are not yet enabled — nothing will be charged."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Shopping Bag', href: '/cart' },
          { label: 'Checkout' },
        ]}
      />
      <CheckoutForm />
    </>
  );
}
