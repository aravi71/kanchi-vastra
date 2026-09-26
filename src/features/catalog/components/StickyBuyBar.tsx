'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCart } from '@/features/cart/cart-store';
import { useUi } from '@/components/layout/ui-state';
import { Button } from '@/components/ui/Button';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types/catalog';

/**
 * Sticky purchase bar for small screens.
 *
 * Appears only once the primary Add to Cart button has scrolled out of view,
 * so it never competes with the real one.
 */
export function StickyBuyBar({ product }: { product: Product }) {
  const [visible, setVisible] = useState(false);
  const { add } = useCart();
  const { open, overlay } = useUi();

  useEffect(() => {
    // The buy box sits within the first screenful; reveal the bar past it.
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 1.1);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (product.stock === 0) return null;

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-ivory-300 bg-ivory-100/97 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden',
        visible && !overlay ? 'translate-y-0' : 'translate-y-full',
      )}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3 px-5 py-3">
        <div className="relative size-12 shrink-0 overflow-hidden bg-ivory-200">
          <Image src={product.images[0]} alt="" fill sizes="48px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-[family-name:var(--font-display)] text-sm leading-tight">
            {product.name}
          </p>
          <p className="tnum text-xs text-ink-500">{formatPrice(product.price)}</p>
        </div>
        <Button
          tabIndex={visible ? 0 : -1}
          onClick={() => {
            add(product);
            open('cart');
          }}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
