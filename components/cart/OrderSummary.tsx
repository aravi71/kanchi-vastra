'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useCart } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';

/**
 * Shared totals panel used by the bag and the checkout. Single source of
 * arithmetic, so the two pages can never disagree about the total.
 */
export function OrderSummary({
  footer,
  showLines = false,
}: {
  footer?: ReactNode;
  showLines?: boolean;
}) {
  const { items, subtotal, shippingCost, total, count } = useCart();

  return (
    <div className="border border-ivory-300 bg-ivory-200/40 p-6 md:p-7">
      <h2 className="eyebrow">Order Summary</h2>

      {showLines && (
        <ul className="mt-6 space-y-4 border-b border-ivory-300 pb-6">
          {items.map(({ product, quantity, lineTotal }) => (
            <li key={product.id} className="flex gap-3.5">
              <div className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden bg-ivory-200">
                <Image
                  src={product.images[0]}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
                <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-wine-800 text-[10px] tnum text-ivory-50">
                  {quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-[family-name:var(--font-display)] text-sm leading-snug">
                  {product.name}
                </p>
                <p className="mt-0.5 text-xs text-ink-400">{product.color}</p>
              </div>
              <p className="shrink-0 text-sm tnum">{formatPrice(lineTotal)}</p>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-600">
            Subtotal <span className="text-ink-400">({count} {count === 1 ? 'item' : 'items'})</span>
          </dt>
          <dd className="tnum">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-600">Estimated shipping</dt>
          <dd className="tnum">
            {shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-ivory-300 pt-4">
          <dt className="eyebrow">Total</dt>
          <dd className="font-[family-name:var(--font-display)] text-2xl tnum">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      {footer}
    </div>
  );
}
