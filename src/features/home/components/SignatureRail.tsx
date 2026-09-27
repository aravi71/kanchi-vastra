import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/catalog';

/**
 * Numbered signature pieces: 01, 02… each a tall photograph with the name,
 * a short line and "Shop now". Swipes sideways on a phone.
 */
export function SignatureRail({ products }: { products: Product[] }) {
  return (
    <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
      {products.slice(0, 4).map((p, i) => (
        <li key={p.id} className="w-[80%] shrink-0 snap-center sm:w-[45%] lg:w-auto">
          <Link
            href={`/product/${p.slug}`}
            className="group frame-brass relative isolate flex aspect-[3/4.4] flex-col justify-between overflow-hidden p-6"
          >
            <Image
              src={p.images[0]}
              alt={p.name}
              fill
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 24vw"
              className="-z-20 object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-950/80 via-transparent to-forest-950/85" />
            <div>
              <p className="tnum flex items-center gap-3 text-xs tracking-[0.2em] text-brass-300">
                {String(i + 1).padStart(2, '0')}
                <i className="h-px w-8 bg-brass-400/70" />
              </p>
              <h3 className="mt-3 max-w-[12rem] font-[family-name:var(--font-display)] text-[1.55rem] leading-[1.15] text-cream-50">
                {p.name}
              </h3>
              <p className="italic-accent mt-2 max-w-[11rem] text-lg leading-snug text-cream-200">
                {p.color} · {p.fabric}
              </p>
            </div>
            <div className="flex items-end justify-between gap-3">
              <span className="tnum text-sm text-cream-100">{formatPrice(p.price)}</span>
              <span className="inline-flex items-center gap-2 text-[0.6875rem] font-medium tracking-[0.24em] text-brass-300 uppercase">
                Shop now
                <ArrowRight
                  className="size-3.5 transition-transform duration-500 group-hover:translate-x-1"
                  strokeWidth={1.4}
                />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
