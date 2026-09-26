import Link from 'next/link';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import type { Product } from '@/types/catalog';

/** A titled, horizontally scrolling row of product cards with snap points. */
export function ProductRail({
  eyebrow,
  title,
  href,
  hrefLabel,
  products,
  tone = 'light',
}: {
  eyebrow: string;
  title: string;
  href: string;
  hrefLabel: string;
  products: Product[];
  tone?: 'light' | 'sand';
}) {
  if (products.length === 0) return null;

  return (
    <section className={tone === 'sand' ? 'bg-ivory-100 py-20' : 'bg-ivory-50 py-20'}>
      <div className="container-editorial">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-ink-400">{eyebrow}</p>
            <h2 className="display-lg mt-2 font-light text-ink-900">{title}</h2>
          </div>
          <Link href={href} className="eyebrow link-underline pb-1 text-ink-700">
            {hrefLabel}
          </Link>
        </div>
      </div>

      <ul className="no-scrollbar container-editorial mt-10 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto pb-2 md:scroll-px-10 xl:scroll-px-16">
        {products.map((product, i) => (
          <li
            key={product.id}
            className="w-[68vw] shrink-0 snap-start sm:w-[40vw] md:w-[28vw] lg:w-[19vw]"
          >
            <ProductCard product={product} priority={i < 2} sizes="(max-width: 640px) 68vw, 20vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
