import Image from 'next/image';
import Link from 'next/link';
import { editorialPhoto } from '@/config/media';
import { collections } from '@/content/collections';
import { trends } from '@/features/home/content';
import type { Product } from '@/types/catalog';

/**
 * "LATEST TRENDS" — the loudest type on the page beside a tilted photograph,
 * with a short story and the collection index on the right.
 */
export function LatestTrends({ products }: { products: Product[] }) {
  const range = collections.map((c) => ({
    ...c,
    count:
      c.slug === 'new-arrivals'
        ? products.filter((p) => p.newArrival).length
        : products.filter((p) => p.collections.includes(c.slug)).length,
  }));

  return (
    <section className="overflow-hidden bg-[#eef1f6] py-20 md:py-28">
      <div className="container-editorial grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)]">
        <div>
          <h2 className="display-condensed text-[clamp(4rem,11vw,9rem)] text-ink-900">
            {trends.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <Link
            href={trends.cta.href}
            className="eyebrow mt-8 inline-flex h-11 items-center rounded-full bg-crimson-700 px-7 text-ivory-50 transition-colors hover:bg-crimson-600"
          >
            {trends.cta.label}
          </Link>
          <h3 className="mt-12 font-display text-2xl text-ink-900">{trends.storyTitle}</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-500">{trends.storyBody}</p>
        </div>

        <div className="[perspective:1400px]">
          <div className="relative aspect-[4/5] [transform:rotateY(-14deg)_rotateZ(-2deg)] shadow-[0_40px_80px_-40px_rgba(28,26,23,0.6)] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] hover:[transform:rotateY(0deg)_rotateZ(0deg)]">
            <Image
              src={editorialPhoto(trends.photo)}
              alt="Woman in a yellow and red saree with the pallu spread"
              fill
              sizes="(max-width: 1024px) 90vw, 32vw"
              className="object-cover"
            />
          </div>
        </div>

        <nav aria-label={trends.rangeTitle}>
          <p className="script-accent text-4xl text-ink-700">{trends.rangeTitle}</p>
          <ul className="mt-6 divide-y divide-ink-900/10 border-y border-ink-900/10">
            {range.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/collections/${c.slug}`}
                  className="group flex items-baseline justify-between py-3.5 text-sm text-ink-700 hover:text-crimson-600"
                >
                  <span className="transition-transform group-hover:translate-x-1">{c.title}</span>
                  <span className="tnum text-xs text-ink-400">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
