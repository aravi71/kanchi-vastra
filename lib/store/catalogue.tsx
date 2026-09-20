'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Product } from '@/lib/types';

/**
 * The catalogue, made available to client components.
 *
 * Cart, wishlist and search all need to look a saree up by id in the browser.
 * Before the CMS existed they imported `data/products.ts` directly, which only
 * worked because the catalogue was a static file. Now that it may come from
 * Sanity, the server fetches it once in the root layout and hands it down
 * through this context — so there is exactly one fetch per page, and the
 * client never talks to the CMS.
 */

interface CatalogueContextValue {
  products: Product[];
  byId: (id: string) => Product | undefined;
  bySlug: (slug: string) => Product | undefined;
}

const CatalogueContext = createContext<CatalogueContextValue | null>(null);

export function CatalogueProvider({
  products,
  children,
}: {
  products: Product[];
  children: ReactNode;
}) {
  const value = useMemo<CatalogueContextValue>(() => {
    // Maps rather than repeated .find() — the cart looks products up on every
    // render, and the wishlist on every toggle.
    const idMap = new Map(products.map((p) => [p.id, p]));
    const slugMap = new Map(products.map((p) => [p.slug, p]));
    return {
      products,
      byId: (id) => idMap.get(id),
      bySlug: (slug) => slugMap.get(slug),
    };
  }, [products]);

  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>;
}

export function useCatalogue(): CatalogueContextValue {
  const ctx = useContext(CatalogueContext);
  if (!ctx) throw new Error('useCatalogue must be used inside <CatalogueProvider>');
  return ctx;
}
