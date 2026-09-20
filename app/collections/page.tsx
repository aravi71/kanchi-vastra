import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { collections } from '@/data/collections';
import { getProducts } from '@/lib/catalogue';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'Kanchipuram silks, bridal weaves, festive sarees and everyday elegance — the Kanchi Vastra collections.',
  alternates: { canonical: '/collections' },
};

export default async function CollectionsPage() {
  const products = await getProducts();
  return (
    <>
      <PageHeader
        eyebrow="Browse"
        title="Collections"
        description="Four ways to wear silk, plus whatever has most recently come off the loom."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Collections' }]}
        divider
      />

      <div className="container-editorial pb-24 md:pb-32">
        <ul className="space-y-4 md:space-y-6">
          {collections.map((collection, i) => {
            const count = products.filter((p) => p.collections.includes(collection.slug)).length;
            const flip = i % 2 === 1;
            return (
              <Reveal as="li" key={collection.slug} delay={i * 60} y={26}>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="group grid overflow-hidden bg-wine-950 md:grid-cols-2"
                >
                  <div
                    className={`relative aspect-[4/3] md:aspect-[5/4] ${flip ? 'md:order-2' : ''}`}
                  >
                    <Image
                      src={collection.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />
                  </div>

                  <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                    <p className="eyebrow-sm text-gold-400/85">{collection.tagline}</p>
                    <h2 className="display-lg mt-4 font-light text-ivory-50">{collection.title}</h2>
                    <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ivory-200/70">
                      {collection.description}
                    </p>
                    <span className="eyebrow-sm mt-8 inline-flex items-center gap-2 text-ivory-100">
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
              </Reveal>
            );
          })}
        </ul>
      </div>
    </>
  );
}
