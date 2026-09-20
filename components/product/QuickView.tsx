'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Check, Heart, X } from 'lucide-react';
import { useCart } from '@/lib/store/cart';
import { useWishlist } from '@/lib/store/wishlist';
import { Button, ButtonLink } from '@/components/ui/Button';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

/**
 * A compact look at a saree without leaving the grid. Deliberately partial —
 * it shows enough to decide, then sends the visitor to the full page for
 * specifications.
 */
export function QuickView({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [added, setAdded] = useState(false);
  const open = product !== null;

  useEffect(() => {
    if (!open) return;
    setAdded(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!product) return null;

  const soldOut = product.stock === 0;
  const wished = has(product.id);

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4 md:p-8">
      <button
        type="button"
        aria-label="Close quick view"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-wine-950/50 backdrop-blur-[2px] animate-fade"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quickview-title"
        className="relative grid w-full max-w-4xl overflow-hidden bg-ivory-100 shadow-[0_24px_80px_rgba(43,10,20,0.28)] animate-fade-up md:grid-cols-2"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center bg-ivory-50/85 backdrop-blur-sm transition-opacity hover:opacity-70"
          aria-label="Close quick view"
        >
          <X className="size-4.5" strokeWidth={1.4} />
        </button>

        <div className="relative aspect-[4/5] bg-ivory-200 md:aspect-auto md:min-h-[30rem]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col p-7 md:p-9">
          <p className="eyebrow-sm text-ink-400">{product.fabric}</p>
          <h2 id="quickview-title" className="display-md mt-3 font-light">
            {product.name}
          </h2>

          <p className="mt-4 flex items-baseline gap-3 text-lg tnum">
            {formatPrice(product.price)}
            {product.compareAtPrice && (
              <span className="text-sm text-ink-300 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-ink-600">{product.description}</p>

          <dl className="mt-6 space-y-2 border-t border-ivory-300 pt-5 text-sm">
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-ink-400">Colour</dt>
              <dd className="flex items-center gap-2">
                <span
                  className="size-3.5 rounded-full ring-1 ring-inset ring-ink-900/15"
                  style={{ backgroundColor: product.colorHex }}
                  aria-hidden="true"
                />
                {product.color}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-ink-400">Zari</dt>
              <dd>{product.specs.zari}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-ink-400">Availability</dt>
              <dd className={cn(soldOut && 'text-ink-400')}>
                {soldOut ? 'Sold out' : `${product.stock} in stock`}
              </dd>
            </div>
          </dl>

          <div className="mt-auto flex gap-2.5 pt-7">
            <Button
              className="flex-1"
              disabled={soldOut}
              onClick={() => {
                add(product);
                setAdded(true);
              }}
            >
              {added ? (
                <>
                  <Check className="size-4" strokeWidth={1.6} /> Added
                </>
              ) : soldOut ? (
                'Sold Out'
              ) : (
                'Add to Bag'
              )}
            </Button>
            <button
              type="button"
              onClick={() => toggle(product.id)}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              className="grid size-12 shrink-0 place-items-center border border-ink-900/25 transition-colors hover:border-ink-900"
            >
              <Heart
                className={cn('size-4.5', wished && 'fill-wine-700 text-wine-700')}
                strokeWidth={1.4}
              />
            </button>
          </div>

          <ButtonLink
            href={`/product/${product.slug}`}
            variant="ghost"
            size="sm"
            className="mt-3 self-start px-0"
            onClick={onClose}
          >
            <span className="link-underline">View full details</span>
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
