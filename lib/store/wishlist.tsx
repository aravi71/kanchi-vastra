'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useCatalogue } from '@/lib/store/catalogue';
import { readStorage, writeStorage } from '@/lib/utils';
import type { Product } from '@/lib/types';

const STORAGE_KEY = 'sks.wishlist.v1';

interface WishlistContextValue {
  ids: string[];
  items: Product[];
  count: number;
  hydrated: boolean;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { byId } = useCatalogue();
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // localStorage does not exist during server rendering, so the wishlist can
  // only be read after mount — see the fuller note in cart.tsx.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see note above
    setIds(readStorage<string[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage(STORAGE_KEY, ids);
  }, [ids, hydrated]);

  const toggle = useCallback((productId: string) => {
    setIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev],
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<WishlistContextValue>(() => {
    const items = ids.flatMap((id) => {
      const product = byId(id);
      return product ? [product] : [];
    });
    return {
      ids,
      items,
      count: items.length,
      hydrated,
      has: (productId: string) => ids.includes(productId),
      toggle,
      remove,
      clear,
    };
  }, [ids, hydrated, byId, toggle, remove, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
