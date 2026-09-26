import { getProducts } from '@/features/catalog/server/catalogue';
import { AttentionStrips } from '@/features/home/components/AttentionStrips';
import { BridalCollection } from '@/features/home/components/BridalCollection';
import { HeroCinematic } from '@/features/home/components/HeroCinematic';
import { LatestTrends } from '@/features/home/components/LatestTrends';
import { MoodArches } from '@/features/home/components/MoodArches';
import { OccasionEdits } from '@/features/home/components/OccasionEdits';
import { ProductRail } from '@/features/home/components/ProductRail';
import { ProductSpotlight } from '@/features/home/components/ProductSpotlight';
import { SilkIntro } from '@/features/home/components/SilkIntro';
import { PromiseMarquee } from '@/features/home/components/PromiseMarquee';
import { RememberedCarousel } from '@/features/home/components/RememberedCarousel';
import { SeasonEdit } from '@/features/home/components/SeasonEdit';
import { StoryCinematic } from '@/features/home/components/StoryCinematic';
import { TrendLists } from '@/features/home/components/TrendLists';
import type { Product } from '@/types/catalog';

/** Products in the given category, featured first, capped. */
function pick(all: Product[], test: (p: Product) => boolean, limit: number) {
  return all
    .filter(test)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit);
}

export default async function HomePage() {
  const all = await getProducts();

  const inStock = all.filter((p) => p.stock > 0);
  const signatures = pick(all, (p) => Boolean(p.featured), 10);
  const carousel = signatures.length >= 5 ? signatures : all.slice(0, 10);
  const spotlight = inStock.find((p) => p.featured && p.images.length > 1) ?? inStock[0];

  return (
    <>
      <div className="intro-scope">
        <SilkIntro />
        <HeroCinematic />
      </div>
      <PromiseMarquee />
      <MoodArches />
      <RememberedCarousel products={carousel} />
      <ProductRail
        eyebrow="Fresh from the loom"
        title="New Arrivals"
        href="/collections/new-arrivals"
        hrefLabel="View all new arrivals"
        products={pick(all, (p) => Boolean(p.newArrival), 10)}
      />
      <ProductRail
        eyebrow="Heritage weaves"
        title="From the Kanchipuram Looms"
        href="/collections/kanchipuram"
        hrefLabel="View Kanchipuram silks"
        products={pick(all, (p) => p.category === 'kanchipuram', 10)}
        tone="sand"
      />
      <BridalCollection products={pick(all, (p) => p.category === 'bridal', 8)} />
      <TrendLists
        lists={[
          { title: 'Trend of the Day', products: pick(all, (p) => p.category === 'festive', 8) },
          { title: 'Seasonal Special', products: pick(all, (p) => p.category === 'everyday', 8) },
        ]}
      />
      <SeasonEdit />
      {spotlight && <ProductSpotlight product={spotlight} />}
      <OccasionEdits />
      <AttentionStrips />
      <StoryCinematic
        products={pick(all, (p) => p.category === 'bridal' || p.category === 'festive', 4)}
      />
      <LatestTrends products={all} />
    </>
  );
}
