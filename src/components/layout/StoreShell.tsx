import type { ReactNode } from 'react';
import { getProducts } from '@/features/catalog/server/catalogue';
import { CatalogueProvider } from '@/features/catalog/catalogue-context';
import { CartProvider } from '@/features/cart/cart-store';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { WishlistProvider } from '@/features/wishlist/wishlist-store';
import { UiProvider } from '@/components/layout/ui-state';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { SearchOverlay } from '@/components/layout/SearchOverlay';

/**
 * The storefront frame: header, footer, overlays, and the client-side state
 * they share (cart, wishlist, catalogue for search).
 *
 * Used by the (store) route group's layout and by the root not-found page, so
 * a mistyped URL still gets the shop's navigation. The admin at /studio sits
 * outside the group and never renders it.
 */
export async function StoreShell({ children }: { children: ReactNode }) {
  // Fetched once per render and handed to client components through context,
  // so the cart, wishlist and search can look products up in the browser
  // without ever talking to the CMS themselves.
  const products = await getProducts();

  return (
    <CatalogueProvider products={products}>
      <UiProvider>
        <WishlistProvider>
          <CartProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-wine-800 focus:px-5 focus:py-3 focus:text-ivory-50 focus:eyebrow"
            >
              Skip to content
            </a>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <SearchOverlay />
            <CartDrawer />
            <MobileNav />
          </CartProvider>
        </WishlistProvider>
      </UiProvider>
    </CatalogueProvider>
  );
}
