'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, X } from 'lucide-react';
import { useCart } from '@/features/cart/cart-store';
import { useWishlist } from '@/features/wishlist/wishlist-store';
import { useUi } from '@/components/layout/ui-state';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { cn, formatPrice } from '@/lib/utils';

export function WishlistView() {
  const { items, remove, clear, hydrated } = useWishlist();
  const { add } = useCart();
  const { open } = useUi();

  if (!hydrated) {
    return (
      <div className="container-editorial pb-24 md:pb-32">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] animate-pulse bg-ivory-200" aria-hidden="true" />
          ))}
        </div>
        <span className="sr-only" role="status">
          Loading your wishlist
        </span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-editorial pb-24 md:pb-32">
        <div className="border border-dashed border-ivory-400 px-8 py-24 text-center">
          <Heart className="mx-auto size-10 text-ivory-400" strokeWidth={0.8} />
          <h2 className="display-md mt-6 font-light">Nothing saved yet</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
            Tap the heart on any saree to keep it here while you decide. Useful when a weave is down
            to its last few pieces.
          </p>
          <ButtonLink href="/shop" className="mt-8">
            Explore the Collection
          </ButtonLink>
        </div>
      </div>
    );
  }

  const inStock = items.filter((p) => p.stock > 0);

  return (
    <div className="container-editorial pb-24 md:pb-32">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ivory-300 pb-5">
        <p className="eyebrow-sm text-ink-400">
          {items.length} {items.length === 1 ? 'saree' : 'sarees'} saved
        </p>
        <div className="flex flex-wrap gap-3">
          {inStock.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                inStock.forEach((p) => add(p));
                open('cart');
              }}
            >
              Move all in-stock to bag
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={clear} className="px-0">
            <span className="link-underline">Clear wishlist</span>
          </Button>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-5 md:gap-y-14 lg:grid-cols-4">
        {items.map((product, i) => {
          const soldOut = product.stock === 0;
          return (
            <Reveal as="li" key={product.id} delay={Math.min(i, 8) * 55} y={20}>
              <article className="group relative flex h-full flex-col">
                <div className="relative aspect-[3/4] overflow-hidden bg-ivory-200">
                  <Link href={`/product/${product.slug}`} tabIndex={-1} aria-hidden="true">
                    <Image
                      src={product.images[0]}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 46vw, 24vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    className="absolute top-2.5 right-2.5 z-10 grid size-9 place-items-center bg-ivory-50/85 backdrop-blur-sm transition-opacity hover:opacity-70"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <X className="size-4" strokeWidth={1.5} />
                  </button>
                  {soldOut && (
                    <span className="eyebrow-sm absolute top-0 left-0 bg-ink-900/85 px-3 py-1.5 text-ivory-50">
                      Sold out
                    </span>
                  )}
                </div>

                <h2 className="mt-4 font-[family-name:var(--font-display)] text-[1.0625rem] leading-snug">
                  <Link href={`/product/${product.slug}`}>{product.name}</Link>
                </h2>
                <p className="mt-1 text-xs text-ink-400">
                  {product.color} · {product.fabric}
                </p>
                <p className={cn('tnum mt-2 text-sm', soldOut && 'text-ink-400')}>
                  {formatPrice(product.price)}
                </p>

                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full"
                  disabled={soldOut}
                  onClick={() => {
                    add(product);
                    open('cart');
                  }}
                >
                  {soldOut ? 'Sold Out' : 'Move to Bag'}
                </Button>
              </article>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
