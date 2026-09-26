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
import { useCatalogue } from '@/features/catalog/catalogue-context';
import { shipping } from '@/config/site';
import { readStorage, writeStorage } from '@/lib/utils';
import type { CartLine, Product } from '@/types/catalog';

const STORAGE_KEY = 'sks.cart.v1';

export interface CartItem extends CartLine {
  product: Product;
  lineTotal: number;
}

interface CartContextValue {
  lines: CartLine[];
  items: CartItem[];
  /** Total unit count, used for the header badge. */
  count: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  /** True until localStorage has been read, so SSR and first paint agree. */
  hydrated: boolean;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { byId } = useCatalogue();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read the persisted cart after mount so the server and client markup match.
  //
  // This is the one legitimate use of setState-in-effect: localStorage does
  // not exist during server rendering, so the bag CANNOT be read until the
  // component has mounted. Reading it during render would either crash on the
  // server or produce markup that disagrees with the client and fails
  // hydration. `hydrated` lets the UI show a neutral state until then.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see note above
    setLines(readStorage<CartLine[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage(STORAGE_KEY, lines);
  }, [lines, hydrated]);

  const add = useCallback((product: Product, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id);
      // Never let the cart exceed what is actually in stock.
      const cap = Math.max(product.stock, 0);
      if (existing) {
        return prev.map((l) =>
          l.productId === product.id ? { ...l, quantity: Math.min(l.quantity + quantity, cap) } : l,
        );
      }
      if (cap === 0) return prev;
      return [
        ...prev,
        { productId: product.id, quantity: Math.min(quantity, cap), priceAtAdd: product.price },
      ];
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      setLines((prev) => {
        if (quantity <= 0) return prev.filter((l) => l.productId !== productId);
        const product = byId(productId);
        const cap = product ? Math.max(product.stock, 0) : quantity;
        return prev.map((l) =>
          l.productId === productId ? { ...l, quantity: Math.min(quantity, cap) } : l,
        );
      });
    },
    [byId],
  );

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    // Lines whose product has since been removed from the catalogue are dropped.
    const items: CartItem[] = lines.flatMap((line) => {
      const product = byId(line.productId);
      if (!product) return [];
      return [{ ...line, product, lineTotal: product.price * line.quantity }];
    });

    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
    const shippingCost = subtotal === 0 || subtotal >= shipping.freeAbove ? 0 : shipping.flatRate;

    return {
      lines,
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
      hydrated,
      add,
      remove,
      setQuantity,
      clear,
    };
  }, [lines, hydrated, byId, add, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
