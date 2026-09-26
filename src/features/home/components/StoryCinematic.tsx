import Image from 'next/image';
import Link from 'next/link';
import { editorialPhoto } from '@/config/media';
import { story } from '@/features/home/content';
import type { Product } from '@/types/catalog';

/**
 * "First Light" — a cinematic full-bleed photograph with a strip of the
 * sarees it features along the bottom right.
 */
export function StoryCinematic({ products }: { products: Product[] }) {
  return (
    <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-ink-900 text-ivory-50">
      <Image
        src={editorialPhoto(story.photo)}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-ink-900/20" />

      <div className="container-editorial grid w-full gap-10 pb-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end">
        <div>
          <p className="eyebrow text-marigold-300">{story.eyebrow}</p>
          <h2 className="display-hero mt-4 font-light text-ivory-50">
            {story.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory-100/75">{story.body}</p>
          <Link
            href={story.cta.href}
            className="eyebrow mt-8 inline-flex h-11 items-center rounded-full border border-ivory-50/40 px-6 transition-colors hover:bg-ivory-50 hover:text-ink-900"
          >
            {story.cta.label}
          </Link>
        </div>

        {products.length > 0 && (
          <ul className="no-scrollbar flex gap-3 overflow-x-auto lg:justify-end">
            {products.map((product) => (
              <li key={product.id} className="w-32 shrink-0 md:w-36">
                <Link href={`/product/${product.slug}`} className="group block">
                  <span className="relative block aspect-[3/4] overflow-hidden border border-ivory-50/20">
                    <Image
                      src={product.images[0]}
                      alt=""
                      fill
                      sizes="144px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </span>
                  <span className="mt-2 block truncate text-xs text-ivory-100/80">
                    {product.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
