'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Heart, Share2, Truck } from 'lucide-react';
import { useCart } from '@/lib/store/cart';
import { useWishlist } from '@/lib/store/wishlist';
import { useUi } from '@/lib/store/ui';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/cart/CartDrawer';
import { shipping } from '@/data/site';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

export function BuyBox({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const { has, toggle, hydrated } = useWishlist();
  const { open } = useUi();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const soldOut = product.stock === 0;
  const wished = hydrated && has(product.id);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function handleAdd(thenCheckout = false) {
    add(product, quantity);
    if (thenCheckout) {
      router.push('/checkout');
      return;
    }
    setAdded(true);
    open('cart');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2600);
  }

  /**
   * Native share where the browser supports it, clipboard as the fallback.
   * Both paths report what actually happened rather than claiming success.
   */
  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.description, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMsg('Link copied');
    } catch {
      setShareMsg('Could not share — copy the address bar instead');
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShareMsg(''), 3000);
  }

  return (
    <div>
      <p className="eyebrow-sm text-ink-400">{product.fabric}</p>
      <h1 className="display-lg mt-3 font-light text-balance">{product.name}</h1>

      <div className="mt-5 flex items-baseline gap-3">
        <p className="font-[family-name:var(--font-display)] text-[1.75rem] tnum">
          {formatPrice(product.price)}
        </p>
        {product.compareAtPrice && (
          <p className="text-sm tnum text-ink-300 line-through">
            {formatPrice(product.compareAtPrice)}
          </p>
        )}
      </div>
      <p className="mt-1.5 text-xs text-ink-400">
        Inclusive of all taxes · Demonstration price
      </p>

      <p className="mt-7 text-[0.9375rem] leading-[1.85] text-ink-600">{product.description}</p>

      {/* --- colour + availability --- */}
      <dl className="mt-8 space-y-3 border-t border-ivory-300 pt-7 text-sm">
        <div className="flex gap-4">
          <dt className="w-28 shrink-0 text-ink-400">Colour</dt>
          <dd className="flex items-center gap-2.5">
            <span
              className="size-4 rounded-full ring-1 ring-inset ring-ink-900/15"
              style={{ backgroundColor: product.colorHex }}
              aria-hidden="true"
            />
            {product.color}
          </dd>
        </div>
        <div className="flex gap-4">
          <dt className="w-28 shrink-0 text-ink-400">SKU</dt>
          <dd className="tnum text-ink-600">{product.sku}</dd>
        </div>
        <div className="flex gap-4">
          <dt className="w-28 shrink-0 text-ink-400">Availability</dt>
          <dd className={cn(soldOut ? 'text-ink-400' : 'text-ink-800')}>
            {soldOut ? (
              'Sold out'
            ) : product.stock <= 3 ? (
              <span className="text-wine-700">Only {product.stock} remaining</span>
            ) : (
              'In stock'
            )}
          </dd>
        </div>
      </dl>

      {/* --- purchase --- */}
      {soldOut ? (
        <div className="mt-8 border border-ivory-400 bg-ivory-200/50 px-5 py-6">
          <p className="eyebrow-sm">Currently sold out</p>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-500">
            This weave is not available at the moment. Add it to your wishlist and we will show
            it here again when it returns.
          </p>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => toggle(product.id)}
            aria-pressed={wished}
          >
            <Heart className={cn('size-4', wished && 'fill-wine-700 text-wine-700')} strokeWidth={1.4} />
            {wished ? 'Saved to Wishlist' : 'Save to Wishlist'}
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-4">
            <span className="eyebrow-sm text-ink-400">Quantity</span>
            <QuantityStepper
              value={quantity}
              max={product.stock}
              onChange={(q) => setQuantity(Math.max(1, q))}
              label={product.name}
            />
          </div>

          <div className="flex gap-2.5">
            <Button size="lg" className="flex-1" onClick={() => handleAdd(false)}>
              {added ? (
                <>
                  <Check className="size-4" strokeWidth={1.8} /> Added to Bag
                </>
              ) : (
                'Add to Cart'
              )}
            </Button>
            <button
              type="button"
              onClick={() => toggle(product.id)}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              className="grid size-14 shrink-0 place-items-center border border-ink-900/25 transition-colors duration-500 hover:border-ink-900"
            >
              <Heart
                className={cn('size-5', wished && 'fill-wine-700 text-wine-700')}
                strokeWidth={1.4}
              />
            </button>
          </div>

          <Button variant="secondary" size="lg" className="w-full" onClick={() => handleAdd(true)}>
            Buy Now
          </Button>
        </div>
      )}

      {/* --- share --- */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleShare}
          className="eyebrow-sm inline-flex items-center gap-2 text-ink-500 transition-colors hover:text-ink-900"
        >
          <Share2 className="size-4" strokeWidth={1.3} />
          Share
        </button>
        <span role="status" aria-live="polite" className="text-xs text-ink-400">
          {shareMsg}
        </span>
      </div>

      {/* --- delivery --- */}
      <div className="mt-7 flex gap-3.5 border-t border-ivory-300 pt-7">
        <Truck className="mt-0.5 size-4.5 shrink-0 text-gold-600" strokeWidth={1.3} />
        <div className="text-sm">
          <p className="text-ink-700">
            Estimated delivery {shipping.estimate}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-400">
            Complimentary shipping on orders above {formatPrice(shipping.freeAbove)}. Delivery
            windows are indicative and will be confirmed once dispatch is live.
          </p>
        </div>
      </div>
    </div>
  );
}
