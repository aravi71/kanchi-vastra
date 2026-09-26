'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { QuickView } from '@/features/catalog/components/QuickView';
import { FilterPanel } from '@/features/catalog/components/FilterPanel';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { categories, colorFamilies, fabrics, priceBands } from '@/content/collections';
import {
  applyFilters,
  countActiveFilters,
  parseFilters,
  serialiseFilters,
  sortOptions,
  type FilterState,
} from '@/features/catalog/filters';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/catalog';

/**
 * The catalogue browser.
 *
 * Filter state lives in the URL rather than in component state, so a filtered
 * view can be shared, bookmarked and reached with the back button.
 */
export function ShopBrowser({
  source,
  /** Facets fixed by the surrounding page (a collection page, for instance). */
  lockedNote,
}: {
  source: Product[];
  lockedNote?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const state = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const update = useCallback(
    (next: Partial<FilterState>) => {
      const merged = { ...state, ...next };
      const qs = serialiseFilters(merged);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [state, pathname, router],
  );

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const results = useMemo(() => applyFilters(source, state), [source, state]);
  const activeCount = countActiveFilters(state);

  /**
   * Facet counts are computed against the pool with that facet's own group
   * removed, which is what stops every other option showing "0" the moment
   * one box is ticked.
   */
  const counts = useMemo(() => {
    const tally = <T extends string>(
      values: readonly T[],
      group: keyof FilterState,
      match: (p: Product, v: T) => boolean,
    ) => {
      const pool = applyFilters(source, { ...state, [group]: [] } as FilterState);
      return Object.fromEntries(
        values.map((v) => [v, pool.filter((p) => match(p, v)).length]),
      ) as Record<string, number>;
    };

    return {
      category: tally(
        categories.map((c) => c.id),
        'categories',
        (p, v) => p.category === v,
      ),
      color: tally(
        colorFamilies.map((c) => c.id),
        'colors',
        (p, v) => p.colorFamily === v,
      ),
      fabric: tally(fabrics, 'fabrics', (p, v) => p.fabric === v),
      band: tally(
        priceBands.map((b) => b.id),
        'bands',
        (p, v) => {
          const band = priceBands.find((b) => b.id === v);
          return band ? p.price >= band.min && p.price <= band.max : false;
        },
      ),
    };
  }, [source, state]);

  // Lock scroll while the mobile filter sheet is open.
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheetOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [sheetOpen]);

  return (
    <div className="container-editorial pb-24 md:pb-32">
      {/* --- toolbar ---------------------------------------------------- */}
      <div className="sticky top-[68px] z-30 -mx-5 flex items-center justify-between gap-4 border-y border-ivory-300 bg-ivory-100/95 px-5 py-3 backdrop-blur-md md:top-[84px] md:-mx-10 md:px-10 xl:-mx-16 xl:px-16">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="eyebrow-sm inline-flex items-center gap-2 lg:hidden"
            aria-expanded={sheetOpen}
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.3} />
            Filter
            {activeCount > 0 && (
              <span className="tnum grid size-[18px] place-items-center rounded-full bg-wine-700 text-[9px] text-ivory-50">
                {activeCount}
              </span>
            )}
          </button>
          <p className="eyebrow-sm whitespace-nowrap text-ink-400" role="status" aria-live="polite">
            {results.length} {results.length === 1 ? 'saree' : 'sarees'}
          </p>
        </div>

        <label className="flex items-center gap-2.5">
          <span className="eyebrow-sm hidden text-ink-400 sm:inline">Sort</span>
          <select
            value={state.sort}
            onChange={(e) => update({ sort: e.target.value as FilterState['sort'] })}
            aria-label="Sort products"
            className="eyebrow-sm cursor-pointer border-0 bg-transparent py-1 pr-6 text-ink-900 focus:outline-none focus-visible:outline-2"
          >
            {sortOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {lockedNote && <p className="mt-6 text-sm text-ink-500">{lockedNote}</p>}

      <div className="mt-10 gap-12 lg:grid lg:grid-cols-[15rem_1fr] xl:gap-16">
        {/* --- sidebar (desktop) --- */}
        <aside className="hidden lg:block">
          <div className="sticky top-[10.5rem]">
            <FilterPanel state={state} onChange={update} onReset={reset} counts={counts} />
          </div>
        </aside>

        {/* --- grid --- */}
        <div>
          {results.length === 0 ? (
            <EmptyResults query={state.q} onReset={reset} hasFilters={activeCount > 0} />
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-5 md:gap-y-14 lg:grid-cols-3">
              {results.map((product, i) => (
                <li key={product.id}>
                  <Reveal delay={Math.min(i, 8) * 55} y={20}>
                    <ProductCard
                      product={product}
                      priority={i < 3}
                      onQuickView={setQuickView}
                      sizes="(max-width: 768px) 46vw, (max-width: 1024px) 30vw, 24vw"
                    />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* --- mobile filter sheet --------------------------------------- */}
      <div
        className={cn(
          'fixed inset-0 z-[75] lg:hidden',
          sheetOpen ? 'visible' : 'invisible delay-500',
        )}
        aria-hidden={!sheetOpen}
      >
        <button
          type="button"
          aria-label="Close filters"
          tabIndex={sheetOpen ? 0 : -1}
          onClick={() => setSheetOpen(false)}
          className={cn(
            'absolute inset-0 h-full w-full cursor-default bg-wine-950/45 backdrop-blur-[2px] transition-opacity duration-500',
            sheetOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter sarees"
          className={cn(
            'absolute inset-x-0 bottom-0 flex max-h-[86svh] flex-col bg-ivory-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            sheetOpen ? 'translate-y-0' : 'translate-y-full',
          )}
        >
          <div className="flex items-center justify-between border-b border-ivory-300 px-5 py-4">
            <h2 className="eyebrow">Filter</h2>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="-mr-2 p-2"
              aria-label="Close filters"
            >
              <X className="size-5" strokeWidth={1.3} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-7">
            <FilterPanel state={state} onChange={update} onReset={reset} counts={counts} />
          </div>

          <div className="border-t border-ivory-300 p-5">
            <Button className="w-full" size="lg" onClick={() => setSheetOpen(false)}>
              Show {results.length} {results.length === 1 ? 'saree' : 'sarees'}
            </Button>
          </div>
        </div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}

function EmptyResults({
  query,
  onReset,
  hasFilters,
}: {
  query: string;
  onReset: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="border border-dashed border-ivory-400 px-8 py-20 text-center">
      <h2 className="display-sm font-light">
        {query ? `No sarees match “${query}”` : 'No sarees match these filters'}
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
        The collection is small and deliberately so. Try widening the price range or removing a
        colour to see more.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        {hasFilters && (
          <Button variant="secondary" onClick={onReset}>
            Clear Filters
          </Button>
        )}
        <ButtonLink href="/shop" variant="ghost">
          <span className="link-underline">View all sarees</span>
        </ButtonLink>
      </div>
    </div>
  );
}
