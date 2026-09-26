'use client';

import type { ReactNode } from 'react';
import { useCart } from '@/features/cart/cart-store';
import { useUi } from '@/components/layout/ui-state';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/catalog';

/**
 * Adds one saree to the cart and opens the cart drawer. Disabled when sold
 * out. Styling is the caller's; this owns only the behaviour.
 */
export function AddToCartButton({
  product,
  className,
  children = 'Add to cart',
  'aria-label': ariaLabel,
}: {
  product: Product;
  className?: string;
  children?: ReactNode;
  'aria-label'?: string;
}) {
  const { add } = useCart();
  const { open } = useUi();
  const soldOut = product.stock === 0;

  return (
    <button
      type="button"
      disabled={soldOut}
      aria-label={
        ariaLabel ?? (soldOut ? `${product.name} is sold out` : `Add ${product.name} to cart`)
      }
      onClick={() => {
        add(product, 1);
        open('cart');
      }}
      className={cn('disabled:cursor-not-allowed disabled:opacity-40', className)}
    >
      {soldOut ? 'Sold out' : children}
    </button>
  );
}
