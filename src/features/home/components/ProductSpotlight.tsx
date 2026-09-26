'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { AddToCartButton } from '@/features/cart/components/AddToCartButton';
import { spotlight } from '@/features/home/content';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types/catalog';

/**
 * One saree, large: the photo fills the left, a "change look" strip of its
 * other photos sits beside it, and the details and a curved crimson
 * add-to-cart sit on the right. Ratings are deliberately absent until real
 * reviews exist.
 */
export function ProductSpotlight({ product }: { product: Product }) {
  const [shown, setShown] = useState(0);
  const looks = product.images;

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="container-editorial grid items-center gap-10 lg:grid-cols-[auto_minmax(0,6fr)_minmax(0,5fr)]">
        {/* change look */}
        {looks.length > 1 && (
          <div className="order-2 flex gap-3 lg:order-none lg:flex-col">
            <p className="script-accent -rotate-6 text-3xl text-ink-700 max-lg:hidden">
              {spotlight.changeLook}
            </p>
            {looks.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setShown(i)}
                aria-label={`Show look ${i + 1}`}
                aria-pressed={shown === i}
                className={cn(
                  'relative aspect-[3/4] w-16 overflow-hidden border-2 transition-colors md:w-20',
                  shown === i ? 'border-crimson-600' : 'border-transparent hover:border-ivory-400',
                )}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        <Link
          href={`/product/${product.slug}`}
          className="relative block aspect-[4/5] overflow-hidden bg-ivory-100"
        >
          {looks.map((src, i) => (
            <Image
              key={src + i}
              src={src}
              alt={i === 0 ? product.name : ''}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className={cn(
                'object-cover transition-opacity duration-700',
                shown === i ? 'opacity-100' : 'opacity-0',
              )}
            />
          ))}
          <span className="script-accent absolute bottom-5 left-5 -rotate-3 text-4xl drop-shadow">
            {spotlight.label}
          </span>
        </Link>

        <div>
          <p className="eyebrow text-ink-400">{product.fabric}</p>
          <h2 className="display-lg mt-3 font-light tracking-wide text-ink-900 uppercase">
            {product.name}
          </h2>
          <p className="tnum mt-4 flex items-baseline gap-3 text-xl">
            {formatPrice(product.price)}
            {product.compareAtPrice && (
              <span className="text-sm text-ink-300 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-500">
            {product.description}
          </p>

          <dl className="mt-7 grid max-w-md grid-cols-2 gap-4 border-y border-ivory-300 py-5 text-xs">
            <div>
              <dt className="eyebrow-sm text-ink-400">Colour</dt>
              <dd className="mt-1.5 flex items-center gap-2 text-ink-800">
                <span
                  className="size-4 rounded-full border border-ink-900/10"
                  style={{ backgroundColor: product.colorHex }}
                />
                {product.color}
              </dd>
            </div>
            <div>
              <dt className="eyebrow-sm text-ink-400">Length</dt>
              <dd className="mt-1.5 text-ink-800">{product.specs.length}</dd>
            </div>
            <div>
              <dt className="eyebrow-sm text-ink-400">Zari</dt>
              <dd className="mt-1.5 text-ink-800">{product.specs.zari}</dd>
            </div>
            <div>
              <dt className="eyebrow-sm text-ink-400">Blouse</dt>
              <dd className="mt-1.5 text-ink-800">{product.specs.blouse}</dd>
            </div>
          </dl>

          <div className="mt-8 flex items-center gap-5">
            <AddToCartButton
              product={product}
              className="eyebrow group inline-flex h-14 -rotate-3 items-center gap-3 rounded-full bg-crimson-700 pr-2 pl-8 text-ivory-50 shadow-[0_18px_40px_-18px_rgba(111,14,38,0.8)] transition-[transform,background-color] duration-500 hover:rotate-0 hover:bg-crimson-600"
            >
              Add to cart
              <span className="grid size-10 place-items-center rounded-full bg-ivory-50 text-crimson-700">
                <ShoppingBag className="size-4" strokeWidth={1.6} />
              </span>
            </AddToCartButton>
            <Link href={`/product/${product.slug}`} className="eyebrow link-underline text-ink-700">
              Full details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
