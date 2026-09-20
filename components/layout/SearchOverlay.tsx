'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useUi } from '@/lib/store/ui';
import { searchCollections, searchProducts, suggestedSearches } from '@/lib/search';
import { useCatalogue } from '@/lib/store/catalogue';
import { readStorage, writeStorage, formatPrice } from '@/lib/utils';
import { Overlay } from '@/components/ui/Overlay';

const RECENT_KEY = 'sks.recent-searches.v1';
const MAX_RECENT = 5;

export function SearchOverlay() {
  const { isOpen, close } = useUi();
  const router = useRouter();
  const open = isOpen('search');
  const { products } = useCatalogue();

  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);

  // Recent searches live in localStorage, which is unavailable during server
  // rendering — see the fuller note in lib/store/cart.tsx.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see note above
    setRecent(readStorage<string[]>(RECENT_KEY, []));
  }, []);

  // Clear the field each time the overlay opens so it never reopens stale.
  // Adjusted during render rather than in an effect — React's documented way
  // to reset state when a value changes, and it avoids a wasted second pass.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery('');
  }

  const results = useMemo(() => searchProducts(products, query, 6), [products, query]);
  const collectionHits = useMemo(() => searchCollections(query), [query]);
  const hasQuery = query.trim().length >= 2;

  function commit(term: string) {
    const value = term.trim();
    if (!value) return;
    const next = [value, ...recent.filter((r) => r !== value)].slice(0, MAX_RECENT);
    setRecent(next);
    writeStorage(RECENT_KEY, next);
    close();
    router.push(`/shop?q=${encodeURIComponent(value)}`);
  }

  return (
    <Overlay open={open} onClose={close} side="top" label="Search" panelClassName="max-h-[85svh]">
      <div className="container-editorial">
        {/* --- input --------------------------------------------------- */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            commit(query);
          }}
          className="flex items-center gap-4 border-b border-ivory-300 py-6"
          role="search"
        >
          <Search className="size-5 shrink-0 text-ink-400" strokeWidth={1.3} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sarees, colours, collections"
            aria-label="Search sarees, colours and collections"
            // Suppress Chrome's own search-clear glyph; it sits right next to
            // our close button and the two Xs read as a mistake.
            className="w-full bg-transparent font-[family-name:var(--font-display)] text-2xl font-light text-ink-900 placeholder:text-ink-300 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none md:text-3xl"
          />
          <button
            type="button"
            onClick={close}
            className="-mr-2 shrink-0 p-2 text-ink-500 transition-opacity hover:opacity-60"
            aria-label="Close search"
          >
            <X className="size-5" strokeWidth={1.3} />
          </button>
        </form>

        {/* --- body ---------------------------------------------------- */}
        <div className="overflow-y-auto pb-10 pt-7">
          {!hasQuery ? (
            <div className="grid gap-10 md:grid-cols-2">
              {recent.length > 0 && (
                <TermList
                  title="Recent"
                  terms={recent}
                  onPick={commit}
                  onClear={() => {
                    setRecent([]);
                    writeStorage(RECENT_KEY, []);
                  }}
                />
              )}
              <TermList title="Suggested" terms={suggestedSearches} onPick={commit} />
            </div>
          ) : results.length === 0 && collectionHits.length === 0 ? (
            <div className="py-10">
              <p className="display-sm font-light">No sarees match “{query.trim()}”</p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
                Try a colour, a weave, or a collection name — “ruby”, “korvai”, “bridal”.
              </p>
              <div className="mt-6">
                <TermList title="Try" terms={suggestedSearches} onPick={commit} />
              </div>
            </div>
          ) : (
            <>
              {collectionHits.length > 0 && (
                <div className="mb-8">
                  <h3 className="eyebrow-sm text-ink-400">Collections</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {collectionHits.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/collections/${c.slug}`}
                          onClick={close}
                          className="eyebrow-sm inline-block border border-ivory-400 px-4 py-2.5 transition-colors hover:border-ink-900"
                        >
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <h3 className="eyebrow-sm text-ink-400">
                {results.length} {results.length === 1 ? 'saree' : 'sarees'}
              </h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link href={`/product/${product.slug}`} onClick={close} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-ivory-200">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 45vw, 16vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        />
                      </div>
                      <p className="mt-3 font-[family-name:var(--font-display)] text-[0.9375rem] leading-snug">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs tnum text-ink-500">{formatPrice(product.price)}</p>
                    </Link>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => commit(query)}
                className="eyebrow-sm link-underline mt-8 inline-block text-wine-700"
              >
                View all results for “{query.trim()}”
              </button>
            </>
          )}
        </div>
      </div>
    </Overlay>
  );
}

function TermList({
  title,
  terms,
  onPick,
  onClear,
}: {
  title: string;
  terms: string[];
  onPick: (term: string) => void;
  onClear?: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="eyebrow-sm text-ink-400">{title}</h3>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-ink-400 underline-offset-4 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {terms.map((term) => (
          <li key={term}>
            <button
              type="button"
              onClick={() => onPick(term)}
              className="eyebrow-sm border border-ivory-400 px-4 py-2.5 transition-colors hover:border-ink-900"
            >
              {term}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
