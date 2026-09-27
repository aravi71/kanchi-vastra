import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { editorialPhoto } from '@/config/media';
import { Reveal } from '@/components/ui/Reveal';
import { bridal } from '@/features/home/content';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/catalog';

/**
 * A tall bridal photograph with an italic line over it, beside three bridal
 * sarees in narrow arch frames.
 */
export function BridalFeature({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[5fr_7fr] lg:gap-8">
      <Reveal className="frame-brass relative isolate flex min-h-[30rem] items-end overflow-hidden p-7 md:p-10">
        <Image
          src={editorialPhoto(bridal.photo)}
          alt="Bride in red silk with gold jewellery"
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="-z-20 object-cover object-top"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950/95 via-forest-950/30 to-transparent" />
        <div>
          <p className="italic-accent text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.1] text-cream-50">
            {bridal.photoLine.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </p>
          <Link href={bridal.cta.href} className="btn-line mt-8">
            {bridal.cta.label}
            <ArrowRight className="size-4" strokeWidth={1.4} />
          </Link>
        </div>
      </Reveal>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
        {products.slice(0, 3).map((p, i) => (
          <Reveal as="li" key={p.id} delay={i * 90} className={i === 2 ? 'max-sm:hidden' : ''}>
            <Link href={`/product/${p.slug}`} className="group block h-full">
              <div className="arch-sm frame-brass relative aspect-[3/5] overflow-hidden p-1.5">
                <div className="arch-sm relative h-full overflow-hidden bg-forest-800">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  />
                </div>
              </div>
              <h3 className="title-caps mt-4 text-[0.95rem] leading-snug text-cream-50">
                {p.name}
              </h3>
              <p className="italic-accent mt-1 text-base text-cream-200/80">{p.color}</p>
              <p className="tnum mt-2 text-sm text-brass-300">{formatPrice(p.price)}</p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
