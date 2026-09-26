'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { QuickView } from '@/features/catalog/components/QuickView';
import { Reveal } from '@/components/ui/Reveal';
import type { Product } from '@/types/catalog';

/**
 * Horizontal rail on small screens, four-up grid from large. The rail keeps
 * the section from becoming an endless scroll on a phone while still letting
 * the images stay large enough to read.
 */
export function FeaturedRail({
  eyebrow,
  title,
  description,
  href,
  hrefLabel,
  products,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href: string;
  hrefLabel: string;
  products: Product[];
}) {
  const [quickView, setQuickView] = useState<Product | null>(null);

  return (
    <section className="bg-ivory-100 py-24 md:py-32">
      <div className="container-editorial">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal className="max-w-xl">
            <p className="eyebrow text-wine-700">{eyebrow}</p>
            <h2 className="display-xl mt-5 font-light text-balance">{title}</h2>
            {description && (
              <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ink-600">
                {description}
              </p>
            )}
          </Reveal>
          <Reveal delay={100}>
            <Link
              href={href}
              className="eyebrow-sm link-underline inline-flex items-center gap-2 pb-2"
            >
              {hrefLabel}
              <ArrowUpRight className="size-4" strokeWidth={1.3} />
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Rail: full-bleed on mobile so cards can run to the screen edge. */}
      <div className="mt-12 md:mt-16">
        <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:grid md:grid-cols-2 md:gap-x-5 md:gap-y-12 md:overflow-visible md:px-10 lg:grid-cols-4 xl:px-16">
          {products.map((product, i) => (
            <li key={product.id} className="w-[68vw] shrink-0 snap-start sm:w-[44vw] md:w-auto">
              <Reveal delay={i * 70} y={24}>
                <ProductCard
                  product={product}
                  onQuickView={setQuickView}
                  sizes="(max-width: 640px) 68vw, (max-width: 1024px) 44vw, 23vw"
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
