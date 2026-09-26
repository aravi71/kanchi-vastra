import Image from 'next/image';
import Link from 'next/link';
import { editorialPhoto } from '@/config/media';
import { AddToCartButton } from '@/features/cart/components/AddToCartButton';
import { bridal } from '@/features/home/content';
import { Wave } from '@/features/home/components/Wave';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/catalog';

/** Dark crimson interlude: one bridal portrait beside a row of bridal silks. */
export function BridalCollection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="relative">
      <Wave className="text-crimson-900" />
      <div className="bg-crimson-900 py-16 text-ivory-50 md:py-24">
        <div className="container-editorial grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,9fr)] lg:items-center">
          <Link
            href={bridal.cta.href}
            className="group relative block aspect-[4/5] overflow-hidden"
          >
            <Image
              src={editorialPhoto(bridal.photo)}
              alt="Bride in a red and gold wedding saree"
              fill
              sizes="(max-width: 1024px) 100vw, 36vw"
              className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
            <span className="eyebrow absolute bottom-5 left-5 flex items-center gap-3 text-ivory-50">
              <span className="h-px w-8 bg-marigold-400" /> {bridal.cta.label}
            </span>
          </Link>

          <div className="min-w-0">
            <p className="eyebrow text-marigold-300">{bridal.eyebrow}</p>
            <h2 className="display-xl mt-3 font-light text-ivory-50">{bridal.title}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory-100/70">{bridal.body}</p>

            <ul className="no-scrollbar mt-10 flex snap-x gap-4 overflow-x-auto pb-2">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex w-52 shrink-0 snap-start flex-col bg-ivory-50 p-2.5 text-ink-900"
                >
                  <Link href={`/product/${product.slug}`} className="block">
                    <span className="relative block aspect-[3/4] overflow-hidden bg-ivory-200">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="208px"
                        className="object-cover"
                      />
                    </span>
                    <span className="mt-3 block font-display text-[1.0625rem] leading-snug">
                      {product.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-400">{product.fabric}</span>
                    <span className="tnum mt-1.5 block text-sm">{formatPrice(product.price)}</span>
                  </Link>
                  <AddToCartButton
                    product={product}
                    className="eyebrow-sm mt-3 h-9 bg-marigold-400 text-crimson-900 transition-colors hover:bg-marigold-300"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Wave flip className="text-crimson-900" />
    </section>
  );
}
