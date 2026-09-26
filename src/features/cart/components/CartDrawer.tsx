'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/features/cart/cart-store';
import { useUi } from '@/components/layout/ui-state';
import { shipping } from '@/config/site';
import { Overlay } from '@/components/ui/Overlay';
import { ButtonLink } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { isOpen, close } = useUi();
  const { items, subtotal, shippingCost, total, setQuantity, remove, count } = useCart();
  const open = isOpen('cart');

  const remaining = shipping.freeAbove - subtotal;

  return (
    <Overlay open={open} onClose={close} side="right" labelledBy="cart-drawer-title">
      <header className="flex items-center justify-between border-b border-ivory-300 px-6 py-5">
        <h2 id="cart-drawer-title" className="eyebrow">
          Shopping Bag {count > 0 && <span className="text-ink-400">({count})</span>}
        </h2>
        <button
          type="button"
          onClick={close}
          className="-mr-2 p-2 transition-opacity hover:opacity-60"
          aria-label="Close shopping bag"
        >
          <X className="size-5" strokeWidth={1.3} />
        </button>
      </header>

      {items.length === 0 ? (
        <EmptyBag onClose={close} />
      ) : (
        <>
          {/* free-shipping progress — a genuine threshold, not a fake urgency timer */}
          {remaining > 0 && (
            <div className="border-b border-ivory-300 bg-ivory-200/60 px-6 py-4">
              <p className="text-xs text-ink-600">
                {formatPrice(remaining)} away from complimentary shipping
              </p>
              <div
                className="mt-2.5 h-px w-full bg-ivory-400"
                role="progressbar"
                aria-valuenow={Math.min(subtotal, shipping.freeAbove)}
                aria-valuemin={0}
                aria-valuemax={shipping.freeAbove}
                aria-label="Progress toward complimentary shipping"
              >
                <div
                  className="h-px bg-gold-600 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ width: `${Math.min(100, (subtotal / shipping.freeAbove) * 100)}%` }}
                />
              </div>
            </div>
          )}

          <ul className="flex-1 divide-y divide-ivory-300 overflow-y-auto px-6">
            {items.map(({ product, quantity, lineTotal }) => (
              <li key={product.id} className="flex gap-4 py-5">
                <Link
                  href={`/product/${product.slug}`}
                  onClick={close}
                  className="relative aspect-[3/4] w-[74px] shrink-0 overflow-hidden bg-ivory-200"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="74px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={close}
                      className="font-[family-name:var(--font-display)] text-[1.0625rem] leading-snug text-ink-900 hover:text-wine-700"
                    >
                      {product.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      className="-mr-1 -mt-1 shrink-0 p-1 text-ink-400 transition-colors hover:text-wine-700"
                      aria-label={`Remove ${product.name} from bag`}
                    >
                      <X className="size-4" strokeWidth={1.4} />
                    </button>
                  </div>

                  <p className="mt-1 text-xs text-ink-400">{product.color} · {product.fabric}</p>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <QuantityStepper
                      value={quantity}
                      max={product.stock}
                      onChange={(q) => setQuantity(product.id, q)}
                      label={product.name}
                    />
                    <span className="text-sm tnum text-ink-900">{formatPrice(lineTotal)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <footer className="border-t border-ivory-300 px-6 py-5">
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-600">Subtotal</dt>
                <dd className="tnum">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600">Estimated shipping</dt>
                <dd className="tnum">
                  {shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-ivory-300 pt-3">
                <dt className="eyebrow pt-0.5">Total</dt>
                <dd className="font-[family-name:var(--font-display)] text-xl tnum">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            <p className="mt-3 text-[11px] leading-relaxed text-ink-400">
              Taxes calculated at checkout. Prices shown are demonstration values.
            </p>

            <div className="mt-5 space-y-2.5">
              <ButtonLink href="/checkout" onClick={close} className="w-full" size="lg">
                Proceed to Checkout
              </ButtonLink>
              <ButtonLink href="/cart" onClick={close} variant="secondary" className="w-full">
                View Bag
              </ButtonLink>
            </div>
          </footer>
        </>
      )}
    </Overlay>
  );
}

function EmptyBag({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
      <ShoppingBag className="size-9 text-ivory-400" strokeWidth={0.9} />
      <div>
        <h3 className="display-sm font-light">Your bag is empty</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Every saree in the collection is woven in limited numbers. Begin with the pieces we
          are showing this season.
        </p>
      </div>
      <ButtonLink href="/shop" onClick={onClose} variant="secondary">
        Explore the Collection
      </ButtonLink>
    </div>
  );
}

export function QuantityStepper({
  value,
  max,
  onChange,
  label,
}: {
  value: number;
  max: number;
  onChange: (q: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center border border-ivory-400">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className="grid size-8 place-items-center text-ink-600 transition-colors hover:bg-ivory-200 disabled:opacity-30"
        aria-label={`Decrease quantity of ${label}`}
      >
        <Minus className="size-3.5" strokeWidth={1.5} />
      </button>
      <span className="w-8 text-center text-sm tnum" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="grid size-8 place-items-center text-ink-600 transition-colors hover:bg-ivory-200 disabled:opacity-30"
        aria-label={`Increase quantity of ${label}`}
      >
        <Plus className="size-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
