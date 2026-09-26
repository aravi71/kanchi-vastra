import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { AddToCartButton } from '@/features/cart/components/AddToCartButton';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types/catalog';

/** Two compact rows — thumbnail, name, price, a round marigold "add". */
export function TrendLists({ lists }: { lists: { title: string; products: Product[] }[] }) {
  const visible = lists.filter((l) => l.products.length > 0);
  if (visible.length === 0) return null;

  return (
    <section className="bg-ivory-50 py-20">
      <div className="container-editorial space-y-14">
        {visible.map((list) => (
          <div key={list.title}>
            <h2 className="flex items-center gap-4 font-display text-3xl font-light text-ink-900">
              <span className="h-8 w-px bg-crimson-600" aria-hidden="true" />
              {list.title}
            </h2>
            <ul className="no-scrollbar mt-7 flex snap-x gap-5 overflow-x-auto pb-2">
              {list.products.map((product) => (
                <li
                  key={product.id}
                  className="flex w-[19rem] shrink-0 snap-start items-center gap-4 border border-ivory-300 bg-white p-3"
                >
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative block aspect-[3/4] w-24 shrink-0 overflow-hidden bg-ivory-200"
                  >
                    <Image
                      src={product.images[0]}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${product.slug}`}
                      className="line-clamp-2 font-display text-lg leading-snug hover:text-crimson-600"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 truncate text-xs text-ink-400">
                      {product.color} · {product.fabric}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="tnum text-sm">{formatPrice(product.price)}</span>
                      <AddToCartButton
                        product={product}
                        className="grid size-9 place-items-center rounded-full bg-marigold-400 text-crimson-900 transition-colors hover:bg-marigold-300"
                      >
                        <Plus className="size-4" strokeWidth={1.8} />
                      </AddToCartButton>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
