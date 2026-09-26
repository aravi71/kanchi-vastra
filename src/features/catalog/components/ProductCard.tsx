'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Maximize2 } from 'lucide-react';
import { useWishlist } from '@/features/wishlist/wishlist-store';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types/catalog';

export function ProductCard({
  product,
  priority = false,
  onQuickView,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
}: {
  product: Product;
  priority?: boolean;
  onQuickView?: (product: Product) => void;
  sizes?: string;
}) {
  const { has, toggle, hydrated } = useWishlist();
  const wished = hydrated && has(product.id);
  const soldOut = product.stock === 0;

  return (
    <article className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-ivory-200">
        <Link href={`/product/${product.slug}`} className="block h-full w-full" tabIndex={-1} aria-hidden="true">
          {/* Primary image */}
          <Image
            src={product.images[0]}
            alt=""
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] group-hover:opacity-0"
          />
          {/* Second image revealed on hover — a detail shot of the same cloth */}
          <Image
            src={product.images[1] ?? product.images[0]}
            alt=""
            fill
            sizes={sizes}
            loading="lazy"
            className="object-cover opacity-0 transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] group-hover:opacity-100"
          />
        </Link>

        {/* --- badges --- */}
        <div className="pointer-events-none absolute left-0 top-0 flex flex-col items-start gap-px">
          {soldOut && (
            <span className="eyebrow-sm bg-ink-900/85 px-3 py-1.5 text-ivory-50">Sold out</span>
          )}
          {!soldOut && product.newArrival && (
            <span className="eyebrow-sm bg-ivory-50/90 px-3 py-1.5 text-ink-900">New</span>
          )}
          {!soldOut && product.stock <= 2 && (
            <span className="eyebrow-sm bg-wine-800/90 px-3 py-1.5 text-ivory-50">
              {product.stock} left
            </span>
          )}
        </div>

        {/* --- wishlist --- */}
        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-pressed={wished}
          aria-label={
            wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
          className={cn(
            // z-10 lifts this above the title link's full-card ::after overlay,
            // which would otherwise swallow the click.
            'absolute right-2.5 top-2.5 z-10 grid size-9 place-items-center bg-ivory-50/85 backdrop-blur-sm transition-all duration-500',
            'opacity-0 focus-visible:opacity-100 group-hover:opacity-100 md:opacity-0',
            'max-md:opacity-100',
            wished && 'opacity-100',
          )}
        >
          <Heart
            className={cn('size-4 transition-colors', wished ? 'fill-wine-700 text-wine-700' : 'text-ink-700')}
            strokeWidth={1.4}
          />
        </button>

        {/* --- quick view (pointer devices only; touch users tap through) --- */}
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="eyebrow-sm absolute inset-x-0 bottom-0 z-10 hidden translate-y-full items-center justify-center gap-2 bg-ivory-50/95 py-3.5 text-ink-900 backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 md:flex"
          >
            <Maximize2 className="size-3.5" strokeWidth={1.4} />
            Quick View
          </button>
        )}
      </div>

      {/* --- meta --- */}
      <div className="pt-4">
        <h3 className="font-[family-name:var(--font-display)] text-[1.0625rem] font-normal leading-snug">
          {/* The whole card is reachable through this one link. */}
          <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-ink-400">
          {product.color} · {product.fabric}
        </p>
        <p className="mt-2 flex items-baseline gap-2.5 text-sm tnum">
          <span className={cn(soldOut && 'text-ink-400')}>{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-300 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
