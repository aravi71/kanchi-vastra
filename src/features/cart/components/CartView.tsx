'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/features/cart/cart-store';
import { useWishlist } from '@/features/wishlist/wishlist-store';
import { shipping } from '@/config/site';
import { ButtonLink } from '@/components/ui/Button';
import { QuantityStepper } from '@/features/cart/components/CartDrawer';
import { OrderSummary } from '@/features/cart/components/OrderSummary';
import { formatPrice } from '@/lib/utils';

export function CartView() {
  const { items, setQuantity, remove, hydrated } = useCart();
  const { has, toggle } = useWishlist();

  // Before hydration the persisted bag is unknown; show a neutral placeholder
  // rather than flashing "empty" at someone who has items.
  if (!hydrated) {
    return (
      <div className="container-editorial pb-24 md:pb-32">
        <div className="h-64 animate-pulse bg-ivory-200/60" />
        <span className="sr-only" role="status">
          Loading your bag
        </span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-editorial pb-24 md:pb-32">
        <div className="border border-dashed border-ivory-400 px-8 py-24 text-center">
          <ShoppingBag className="mx-auto size-10 text-ivory-400" strokeWidth={0.8} />
          <h2 className="display-md mt-6 font-light">Your bag is empty</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
            Nothing here yet. The collection is small and changes as new weaves come off the loom —
            start with the pieces we are showing this season.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/shop">Explore the Collection</ButtonLink>
            <ButtonLink href="/wishlist" variant="secondary">
              View Wishlist
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-editorial pb-24 md:pb-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
        {/* --- lines --- */}
        <div>
          <ul className="divide-y divide-ivory-300 border-y border-ivory-300">
            {items.map(({ product, quantity, lineTotal }) => {
              const wished = has(product.id);
              return (
                <li key={product.id} className="flex gap-5 py-7">
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden bg-ivory-200 sm:w-32"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="font-[family-name:var(--font-display)] text-lg leading-snug">
                          <Link href={`/product/${product.slug}`} className="hover:text-wine-700">
                            {product.name}
                          </Link>
                        </h2>
                        <p className="mt-1.5 text-xs text-ink-400">
                          {product.color} · {product.fabric}
                        </p>
                        <p className="tnum mt-0.5 text-xs text-ink-400">{product.sku}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        className="-mr-1 shrink-0 p-1.5 text-ink-400 transition-colors hover:text-wine-700"
                        aria-label={`Remove ${product.name} from bag`}
                      >
                        <X className="size-4" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
                      <div className="flex items-center gap-5">
                        <QuantityStepper
                          value={quantity}
                          max={product.stock}
                          onChange={(q) => setQuantity(product.id, q)}
                          label={product.name}
                        />
                        <button
                          type="button"
                          onClick={() => toggle(product.id)}
                          className="eyebrow-sm inline-flex items-center gap-1.5 text-ink-500 transition-colors hover:text-wine-700"
                          aria-pressed={wished}
                        >
                          <Heart
                            className={`size-3.5 ${wished ? 'fill-wine-700 text-wine-700' : ''}`}
                            strokeWidth={1.5}
                          />
                          {wished ? 'Saved' : 'Save'}
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="tnum">{formatPrice(lineTotal)}</p>
                        {quantity > 1 && (
                          <p className="tnum mt-0.5 text-xs text-ink-400">
                            {formatPrice(product.price)} each
                          </p>
                        )}
                      </div>
                    </div>

                    {quantity >= product.stock && (
                      <p className="mt-3 text-xs text-terracotta-600">
                        Only {product.stock} of this weave available.
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <ButtonLink href="/shop" variant="ghost" size="sm" className="mt-7 px-0">
            <span className="link-underline">Continue shopping</span>
          </ButtonLink>
        </div>

        {/* --- summary --- */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <OrderSummary
            footer={
              <>
                <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
                  Proceed to Checkout
                </ButtonLink>
                <p className="mt-4 text-[11px] leading-relaxed text-ink-400">
                  Complimentary shipping on orders above {formatPrice(shipping.freeAbove)}. All
                  prices shown are demonstration values and taxes are indicative only.
                </p>
              </>
            }
          />
        </aside>
      </div>
    </div>
  );
}
