import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { collections, getCollection } from '@/content/collections';
import { getProductsInCollection } from '@/features/catalog/server/catalogue';
import { ShopBrowser } from '@/features/catalog/components/ShopBrowser';
import { GridSkeleton } from '@/features/catalog/components/GridSkeleton';
import { Reveal } from '@/components/ui/Reveal';
import { SectionDivider } from '@/components/motifs/Motifs';

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: 'Collection not found' };

  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: `${collection.title} | Kanchi Vastra`,
      description: collection.description,
      images: [{ url: collection.image, alt: collection.title }],
    },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const items = await getProductsInCollection(collection.slug);

  return (
    <>
      {/* --- collection banner ----------------------------------------- */}
      {/* pt clears the fixed header (84px) plus its announcement rail (40px). */}
      <section className="relative isolate flex min-h-[52svh] items-end overflow-hidden bg-wine-950 pt-36 md:min-h-[60svh] md:pt-44">
        <Image
          src={collection.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-wine-950 via-wine-950/60 to-wine-950/25"
          aria-hidden="true"
        />

        <div className="container-editorial pb-14 md:pb-20">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-ivory-200/60">
              <li>
                <Link href="/" className="link-underline hover:text-ivory-100">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/collections" className="link-underline hover:text-ivory-100">
                  Collections
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ivory-100/85">
                {collection.title}
              </li>
            </ol>
          </nav>

          <Reveal>
            <p className="eyebrow text-gold-400/90">{collection.tagline}</p>
            <h1 className="display-xl mt-5 max-w-2xl font-light text-balance text-ivory-50">
              {collection.title}
            </h1>
            <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-ivory-200/80">
              {collection.description}
            </p>
            <SectionDivider className="mt-9 max-w-sm" />
          </Reveal>
        </div>
      </section>

      <div className="pt-10 md:pt-14">
        <Suspense fallback={<GridSkeleton count={6} />}>
          <ShopBrowser
            source={items}
            lockedNote={`Showing the ${collection.title} collection. Filters below apply within it.`}
          />
        </Suspense>
      </div>
    </>
  );
}
