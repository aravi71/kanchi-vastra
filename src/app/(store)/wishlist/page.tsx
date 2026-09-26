import type { Metadata } from 'next';
import { WishlistView } from '@/features/wishlist/components/WishlistView';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Sarees you have saved from the Kanchi Vastra collection.',
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <>
      <PageHeader
        title="Wishlist"
        description="Saved to this device. Clearing your browser data will clear this list."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]}
      />
      <WishlistView />
    </>
  );
}
