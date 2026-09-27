import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { getProducts } from '@/features/catalog/server/catalogue';
import { ArchCarousel } from '@/features/home/components/ArchCarousel';
import { BridalFeature } from '@/features/home/components/BridalFeature';
import { HeroEmerald } from '@/features/home/components/HeroEmerald';
import { OccasionFrames } from '@/features/home/components/OccasionFrames';
import { OurStory } from '@/features/home/components/OurStory';
import { PromiseRow } from '@/features/home/components/PromiseRow';
import { SignatureRail } from '@/features/home/components/SignatureRail';
import { bridal, newArrivals, occasions, signatures } from '@/features/home/content';
import type { Product } from '@/types/catalog';

/** Products passing the test, featured first, capped. */
function pick(all: Product[], test: (p: Product) => boolean, limit: number) {
  return all
    .filter(test)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);
}

/** Fill up to `limit` from `rest` when a section has too few of its own. */
function atLeast(list: Product[], rest: Product[], limit: number) {
  const seen = new Set(list.map((p) => p.id));
  return [...list, ...rest.filter((p) => !seen.has(p.id))].slice(0, limit);
}

function MoreLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-12 flex justify-center">
      <Link href={href} className="btn-line">
        {label}
        <ArrowRight className="size-4" strokeWidth={1.4} />
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const all = await getProducts();
  const inStock = all.filter((p) => p.stock > 0);

  const arrivals = atLeast(
    pick(all, (p) => Boolean(p.newArrival), 8),
    inStock,
    6,
  );
  const bridalPieces = atLeast(
    pick(inStock, (p) => p.category === 'bridal', 3),
    inStock,
    3,
  );
  const signaturePieces = atLeast(
    pick(inStock, (p) => Boolean(p.featured), 4),
    inStock,
    4,
  );

  return (
    <>
      <HeroEmerald />

      <section className="forest-glow py-20 md:py-28">
        <div className="container-editorial">
          <SectionTitle
            eyebrow={newArrivals.eyebrow}
            title={newArrivals.title}
            kicker={newArrivals.kicker}
          />
          <div className="mt-14">
            <ArchCarousel products={arrivals} />
          </div>
          <MoreLink href={newArrivals.cta.href} label={newArrivals.cta.label} />
        </div>
      </section>

      <section className="bg-forest-950 py-20 md:py-28">
        <div className="container-editorial">
          <SectionTitle
            eyebrow={occasions.eyebrow}
            title={occasions.title}
            kicker={occasions.kicker}
          />
          <div className="mt-14">
            <OccasionFrames />
          </div>
          <MoreLink href={occasions.cta.href} label={occasions.cta.label} />
        </div>
      </section>

      {bridalPieces.length > 0 && (
        <section className="forest-glow py-20 md:py-28">
          <div className="container-editorial">
            <SectionTitle eyebrow={bridal.eyebrow} title={bridal.title} kicker={bridal.kicker} />
            <div className="mt-14">
              <BridalFeature products={bridalPieces} />
            </div>
          </div>
        </section>
      )}

      {signaturePieces.length > 0 && (
        <section className="bg-forest-950 pt-20 md:pt-28">
          <div className="container-editorial">
            <SectionTitle
              eyebrow={signatures.eyebrow}
              title={signatures.title}
              kicker={signatures.kicker}
            />
            <div className="mt-14">
              <SignatureRail products={signaturePieces} />
            </div>
            <MoreLink href={signatures.cta.href} label={signatures.cta.label} />
          </div>
          <PromiseRow />
        </section>
      )}

      <div className="forest-glow">
        <OurStory />
      </div>
    </>
  );
}
