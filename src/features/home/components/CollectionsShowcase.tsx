import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { collections } from '@/content/collections';
import type { Product } from '@/types/catalog';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

/**
 * Editorial collection layout rather than a uniform card grid: the first
 * collection takes a tall hero position and the rest step down beside it, so
 * the eye is given a route through the section.
 */
export function CollectionsShowcase({ products }: { products: Product[] }) {
  const [lead, ...rest] = collections;

  return (
    <section className="bg-ivory-200/70 py-24 md:py-32">
      <div className="container-editorial">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="eyebrow text-wine-700">The Collections</p>
            <h2 className="display-xl mt-5 max-w-xl font-light text-balance">
              Four ways to wear silk
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <Link
              href="/collections"
              className="eyebrow-sm link-underline inline-flex items-center gap-2 pb-2"
            >
              All Collections
              <ArrowUpRight className="size-4" strokeWidth={1.3} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <Reveal className="md:row-span-2" y={26}>
            <CollectionTile collection={lead} products={products} tall />
          </Reveal>
          {rest.map((collection, i) => (
            <Reveal key={collection.slug} delay={80 + i * 70} y={26}>
              <CollectionTile collection={collection} products={products} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionTile({
  collection,
  products,
  tall = false,
}: {
  collection: (typeof collections)[number];
  products: Product[];
  tall?: boolean;
}) {
  const count = products.filter((p) => p.collections.includes(collection.slug)).length;

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={cn(
        'group relative block h-full w-full overflow-hidden bg-wine-950',
        tall
          ? 'aspect-[3/4] md:aspect-auto md:h-full md:min-h-[34rem]'
          : 'aspect-[4/3] lg:aspect-[5/4]',
      )}
    >
      <Image
        src={collection.image}
        alt=""
        fill
        sizes={tall ? '(max-width: 768px) 100vw, 33vw' : '(max-width: 768px) 100vw, 33vw'}
        className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
      />
      <div
        // Pale artwork (the sandalwood and ivory colourways) needs a heavier
        // wash than the dark ones to keep the ivory type legible.
        className="absolute inset-0 bg-gradient-to-t from-wine-950/90 via-wine-950/40 to-wine-950/5 transition-opacity duration-700 group-hover:from-wine-950/95"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <p className="eyebrow-sm text-gold-400/90">{collection.tagline}</p>
        <h3 className={cn('mt-2.5 font-light text-ivory-50', tall ? 'display-lg' : 'display-sm')}>
          {collection.title}
        </h3>
        <p
          className={cn(
            'mt-3 max-w-sm text-sm leading-relaxed text-ivory-200/75',
            tall ? 'block' : 'hidden lg:block',
          )}
        >
          {collection.description}
        </p>
        <span className="eyebrow-sm mt-5 inline-flex items-center gap-2 text-ivory-100">
          <span className="relative">
            View {count} {count === 1 ? 'saree' : 'sarees'}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold-400 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
          </span>
          <ArrowUpRight
            className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.4}
          />
        </span>
      </div>
    </Link>
  );
}
