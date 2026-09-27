'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/catalog';

/**
 * Sarees in temple-arch frames, one after another. Swipe on a phone; arrows
 * and a 01 / 06 counter on every screen.
 */
export function ArchCarousel({ products }: { products: Product[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;
      const step = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0');
      setIndex(Math.min(products.length - 1, Math.round(el.scrollLeft / step)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [products.length]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: 'smooth' });
  };

  if (products.length === 0) return null;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div>
      <ul
        ref={track}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 md:-mx-10 md:px-10 xl:-mx-16 xl:px-16"
      >
        {products.map((p, i) => (
          <li
            key={p.id}
            className="w-[78%] shrink-0 snap-center sm:w-[46%] lg:w-[calc((100%-3rem)/3)]"
          >
            <Link href={`/product/${p.slug}`} className="group block">
              <div className="arch frame-brass relative aspect-[3/4.2] overflow-hidden p-2">
                <div className="arch relative h-full overflow-hidden bg-forest-800">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 30vw"
                    priority={i === 0}
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest-950/90 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-center">
                    <p className="label-brass">{p.newArrival ? 'New arrival' : p.fabric}</p>
                    <h3 className="title-caps mt-2 text-xl text-cream-50">{p.name}</h3>
                    <p className="tnum mt-1.5 text-sm text-cream-200">
                      {p.stock === 0 ? 'Sold out' : formatPrice(p.price)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-center gap-6 text-cream-200">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="grid size-11 place-items-center rounded-full border border-brass-500/50 text-brass-300 transition-colors hover:bg-brass-500 hover:text-forest-900"
        >
          <ArrowLeft className="size-4" strokeWidth={1.4} />
        </button>
        <p className="tnum w-24 text-center text-xs tracking-[0.3em]" aria-live="polite">
          <span className="text-brass-300">{pad(index + 1)}</span>
          <span className="mx-2 opacity-50">/</span>
          {pad(products.length)}
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="grid size-11 place-items-center rounded-full border border-brass-500/50 text-brass-300 transition-colors hover:bg-brass-500 hover:text-forest-900"
        >
          <ArrowRight className="size-4" strokeWidth={1.4} />
        </button>
      </div>
    </div>
  );
}
