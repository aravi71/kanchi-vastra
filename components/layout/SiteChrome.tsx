'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileNav } from '@/components/layout/MobileNav';

/**
 * Wraps the storefront in its header, footer and overlays.
 *
 * The admin at /studio is a full-screen application with its own navigation
 * and its own visual language; dropping the shop's header on top of it would
 * be both ugly and confusing. It renders bare instead.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/studio')) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <SearchOverlay />
      <CartDrawer />
      <MobileNav />
    </>
  );
}
