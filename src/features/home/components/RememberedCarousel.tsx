'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { remembered } from '@/features/home/content';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types/catalog';

const AUTO_ADVANCE_MS = 5000;
const VISIBLE_EACH_SIDE = 3;

/**
 * "Woven to be Remembered" — product portraits arranged on a shallow arc,
 * like cards standing in a curved gallery. Pure CSS 3D transforms; the
 * active card sits at the front and the rest turn away from it.
 *
 * Buttons, arrow keys and swipe all move it; it advances on its own only
 * while nobody is interacting and the visitor has not asked for less motion.
 */
export function RememberedCarousel({ products }: { products: Product[] }) {
  const count = products.length;
  const [active, setActive] = useState(Math.floor(count / 2));
  const [paused, setPaused] = useState(false);
  const dragStart = useRef<number | null>(null);

  const go = useCallback((delta: number) => setActive((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => go(1), AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [paused, go, count]);

  if (count === 0) return null;

  /** Shortest signed distance around the ring, so the arc wraps smoothly. */
  const offsetOf = (i: number) => {
    let d = i - active;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    return d;
  };

  return (
    <section className="overflow-hidden bg-ivory-50 pt-6 pb-24 md:pb-32">
      <div className="container-editorial flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-ink-400">{remembered.eyebrow}</p>
          <h2 className="display-xl mt-3 font-light text-ink-900">
            {remembered.title}{' '}
            <span className="script-accent text-[1.25em]">{remembered.accent}</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous saree"
            className="grid size-12 place-items-center rounded-full border border-ink-900/20 transition-colors hover:bg-ink-900 hover:text-ivory-50"
          >
            <ArrowLeft className="size-4" strokeWidth={1.4} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next saree"
            className="grid size-12 place-items-center rounded-full border border-ink-900/20 transition-colors hover:bg-ink-900 hover:text-ivory-50"
          >
            <ArrowRight className="size-4" strokeWidth={1.4} />
          </button>
        </div>
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Signature sarees"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(-1);
          if (e.key === 'ArrowRight') go(1);
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onPointerDown={(e) => (dragStart.current = e.clientX)}
        onPointerUp={(e) => {
          if (dragStart.current === null) return;
          const dx = e.clientX - dragStart.current;
          dragStart.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
        className="relative mx-auto mt-14 h-[calc(clamp(210px,24vw,330px)*1.3333+0.5rem)] touch-pan-y [perspective:1800px] focus-visible:outline-offset-8"
      >
        {products.map((product, i) => {
          const offset = offsetOf(i);
          const distance = Math.abs(offset);
          const hidden = distance > VISIBLE_EACH_SIDE;
          const style: CSSProperties = {
            transform: `translateX(-50%) translateX(${offset * 78}%) translateZ(${-distance * 140}px) rotateY(${offset * -24}deg)`,
            zIndex: 50 - distance,
            opacity: hidden ? 0 : 1 - distance * 0.12,
          };

          return (
            <article
              key={product.id}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${product.name}`}
              aria-hidden={hidden || undefined}
              style={style}
              className={cn(
                'absolute top-0 left-1/2 w-[clamp(210px,24vw,330px)] transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]',
                hidden && 'pointer-events-none',
              )}
            >
              <Link
                href={`/product/${product.slug}`}
                tabIndex={offset === 0 ? 0 : -1}
                onClick={(e) => {
                  // A click on a side card brings it forward first.
                  if (offset !== 0) {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
                className="group block"
              >
                <span className="relative block aspect-[3/4] overflow-hidden rounded-sm bg-ivory-200 shadow-[0_30px_60px_-30px_rgba(42,6,16,0.55)]">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 60vw, 25vw"
                    className="object-cover"
                    draggable={false}
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-crimson-900/85 to-transparent p-5 pt-16 text-left">
                    <span className="block font-display text-xl leading-tight text-ivory-50">
                      {product.name}
                    </span>
                    <span className="tnum mt-1 block text-xs text-marigold-300">
                      {formatPrice(product.price)}
                    </span>
                  </span>
                </span>
              </Link>
            </article>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link href={remembered.cta.href} className="eyebrow link-underline text-ink-900">
          {remembered.cta.label}
        </Link>
      </div>
    </section>
  );
}
